import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getEvents, registerForEvent, cancelEvent } from '../services/api';
import { Event } from '../types';
import { format, isThisWeek, isThisMonth, addWeeks, startOfWeek, endOfWeek, isPast, parseISO } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import LocationMap from '../components/LocationMap';
import EventCard from '../components/EventCard';
import { debounce } from 'lodash';

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    upcoming: true,
    past: false
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lon: number; display_name: string } | null>(null);
  const [mileRange, setMileRange] = useState(20);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedLocation) {
      fetchEvents();
    }
  }, [selectedLocation]);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: number) => {
    try {
      console.log('Attempting to register for event:', eventId);
      await registerForEvent(eventId);
      setToast({ message: 'Successfully registered for event!', type: 'success' });
      // Force a complete refresh of events data
      await fetchEvents();
      console.log('Events after registration:', events);
    } catch (err) {
      console.error('Registration error:', err);
      setToast({ message: 'Failed to register for event', type: 'error' });
    }
  };

  const handleWithdraw = async (eventId: number) => {
    try {
      console.log('Attempting to withdraw from event:', eventId);
      await registerForEvent(eventId, true);
      setToast({ message: 'Successfully withdrew from event!', type: 'success' });
      
      // Force a complete refresh of events data
      const updatedEvents = await getEvents();
      setEvents(updatedEvents);
      
      console.log('Events after withdrawal:', updatedEvents);
    } catch (err) {
      console.error('Withdrawal error:', err);
      setToast({ message: 'Failed to withdraw from event', type: 'error' });
    }
  };

  const handleCancelEvent = async (eventId: number) => {
    try {
      await cancelEvent(eventId);
      setToast({ message: 'Event cancelled successfully!', type: 'success' });
      fetchEvents();
    } catch (err) {
      setToast({ message: 'Failed to cancel event', type: 'error' });
    }
  };

  const searchAddress = debounce(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/geocode?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        setSearchResults(data);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    } catch (error) {
      console.error('Error searching address:', error);
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  }, 300);

  const handleLocationSelect = (result: SearchResult) => {
    setSelectedLocation({
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      display_name: result.display_name
    });
    setSearchQuery(result.display_name);
    setShowResults(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    searchAddress(value);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const filteredEvents = events.filter(event => {
    if (!selectedLocation) return false;
    
    const distance = calculateDistance(
      selectedLocation.lat,
      selectedLocation.lon,
      event.latitude,
      event.longitude
    );
    
    return distance <= mileRange;
  });

  const upcoming = filteredEvents.filter(event => !isPast(new Date(event.event_date)));
  const past = filteredEvents.filter(event => isPast(new Date(event.event_date)));
  const hasAnyEvents = upcoming.length > 0 || past.length > 0;

  const renderEventCard = (event: Event) => {
    // Check if the user is registered using the exact same logic as ManageEvents
    const isRegistered = event.registrations?.some(reg => reg.user?.id === user?.id) || false;
    // Only set isCreator if the user is the organizer
    const isCreator = event.organizer_id === user?.id;
    
    console.log('Event card registration status:', {
      eventId: event.id,
      isRegistered,
      isCreator,
      registrations: event.registrations,
      userId: user?.id,
      organizerId: event.organizer_id,
      hasRegisterHandler: !!handleRegister,
      hasWithdrawHandler: !!handleWithdraw
    });
    
    return (
      <EventCard
        key={event.id}
        event={event}
        onRegister={() => handleRegister(event.id)}
        onWithdraw={() => handleWithdraw(event.id)}
        onCancel={() => handleCancelEvent(event.id)}
        isRegistered={isRegistered}
        isCreator={isCreator}
        setSelectedEvent={setSelectedEvent}
      />
    );
  };

  const renderEventSection = (title: string, events: Event[], sectionKey: keyof typeof expandedSections) => (
    <div className="mb-8">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex justify-between items-center text-2xl font-bold text-gray-900 mb-4 hover:text-[#C4E538] transition-colors"
      >
        <span>{title}</span>
        <span className="text-lg">
          {expandedSections[sectionKey] ? '▼' : '▶'}
        </span>
      </button>
      {expandedSections[sectionKey] && events.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map(renderEventCard)}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">
          {expandedSections[sectionKey] ? 'No events in this period' : ''}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Find Events
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            {selectedLocation ? `Events within ${mileRange} miles of ${selectedLocation.display_name}` : 'Select a location to search for events'}
          </p>
        </div>

        {/* Location Search */}
        <div className="max-w-3xl mx-auto mb-12 px-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for a location"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C4E538] focus:border-[#C4E538]"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#C4E538]"></div>
                </div>
              )}
              {showResults && searchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                      onClick={() => handleLocationSelect(result)}
                    >
                      <div className="flex items-center">
                        <span className="ml-3 truncate">{result.display_name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 min-w-[200px]">
              <input
                type="range"
                min="1"
                max="100"
                value={mileRange}
                onChange={(e) => setMileRange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C4E538] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#C4E538] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-track]:bg-gray-200 [&::-moz-range-track]:rounded-lg [&::-moz-range-track]:h-2"
                style={{
                  background: `linear-gradient(to right, #C4E538 0%, #C4E538 ${(mileRange - 1) * (100 / 99)}%, #E5E7EB ${(mileRange - 1) * (100 / 99)}%, #E5E7EB 100%)`
                }}
              />
              <span className="text-sm font-medium text-[#C4E538] whitespace-nowrap">{mileRange} miles</span>
            </div>
          </div>
        </div>

        {/* Events List */}
        {selectedLocation ? (
          <>
            {hasAnyEvents ? (
              <div className="space-y-12">
                {upcoming.length > 0 && renderEventSection('Upcoming Events', upcoming, 'upcoming')}
                {past.length > 0 && renderEventSection('Past Events', past, 'past')}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">No events found in this area</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">Please select a location to view events</p>
          </div>
        )}

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Event Details
                  </h2>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Location</h3>
                    <p className="mt-1 text-gray-500">{selectedEvent.court_location}</p>
                    <div className="mt-2">
                      <LocationMap 
                        location={selectedEvent.court_location}
                        latitude={selectedEvent.latitude}
                        longitude={selectedEvent.longitude}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Date & Time</h3>
                    <p className="mt-1 text-gray-500">
                      {format(new Date(selectedEvent.event_date), 'MMMM d, yyyy')} at{' '}
                      {format(new Date(selectedEvent.event_time), 'h:mm a')}
                    </p>
                  </div>

                  {selectedEvent.description && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Description</h3>
                      <p className="mt-1 text-gray-500">{selectedEvent.description}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Participants</h3>
                    <div className="mt-4">
                      <ul className="mt-2 divide-y divide-gray-200">
                        {selectedEvent.registrations?.map((registration) => (
                          <li key={registration.id} className="py-2 flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                {registration.user?.profile_image ? (
                                  <img
                                    className="h-8 w-8 rounded-full"
                                    src={`http://localhost:8000/uploads/${registration.user.profile_image}`}
                                    alt=""
                                  />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-sm font-medium text-gray-500">
                                      {registration.user?.first_name?.charAt(0) || '?'}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">
                                  {registration.user ? `${registration.user.first_name} ${registration.user.last_name}` : 'Unknown User'}
                                  {registration.user?.id === selectedEvent.organizer_id && (
                                    <span className="ml-2 text-xs text-gray-500">(Organizer)</span>
                                  )}
                                  <span className="ml-2 text-xs text-gray-500">
                                    {registration.user?.tennis_level ? `(${registration.user.tennis_level})` : ''}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Capacity</h3>
                    <p className="mt-1 text-gray-500">
                      {selectedEvent.max_participants
                        ? `${selectedEvent.registrations?.length || 0}/${selectedEvent.max_participants} spots filled`
                        : `${selectedEvent.registrations?.length || 0} (open registration)`}
                    </p>
                  </div>

                  {selectedEvent.is_cancelled && (
                    <div className="mt-4">
                      <p className="text-red-600">This event has been cancelled</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50">
            <p className={`text-sm font-medium ${toast.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {toast.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 