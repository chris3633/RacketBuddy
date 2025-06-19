import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMyRegistrations, registerForEvent, getEvents } from '../services/api';
import { EventRegistration, Event } from '../types';
import { format } from 'date-fns';
import LocationMap from '../components/LocationMap';

interface Section {
  active: boolean;
  cancelled: boolean;
}

const MyRegistrations: React.FC = () => {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [cancelledRegistrations, setCancelledRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [expandedSections, setExpandedSections] = useState<Section>({
    active: true,
    cancelled: false
  });
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      console.log('Fetching all events...');
      const allEvents = await getEvents();
      console.log('Fetched all events:', allEvents);
      
      // Get user's registrations
      const userRegistrations = await getMyRegistrations();
      console.log('Fetched user registrations:', userRegistrations);
      
      // Create a map of event IDs to registrations for quick lookup
      const registrationMap = new Map(userRegistrations.map(reg => [reg.event_id, reg]));
      
      // Filter events to only those where the user is registered
      const userEvents = allEvents.filter((event: Event) => registrationMap.has(event.id));
      
      // Separate events into active and cancelled
      const active = userEvents.filter((event: Event) => !event.is_cancelled);
      const cancelled = userEvents.filter((event: Event) => event.is_cancelled);
      
      console.log('Filtered events:', {
        active: active.map(e => ({ id: e.id, is_cancelled: e.is_cancelled })),
        cancelled: cancelled.map(e => ({ id: e.id, is_cancelled: e.is_cancelled }))
      });
      
      // Update all registration states
      setRegistrations(active.map((event: Event) => ({
        id: registrationMap.get(event.id)!.id,
        event_id: event.id,
        user_id: user!.id,
        event: event,
        registration_date: registrationMap.get(event.id)!.registration_date,
        is_withdrawn: registrationMap.get(event.id)!.is_withdrawn,
        user: registrationMap.get(event.id)!.user
      })));
      setCancelledRegistrations(cancelled.map((event: Event) => ({
        id: registrationMap.get(event.id)!.id,
        event_id: event.id,
        user_id: user!.id,
        event: event,
        registration_date: registrationMap.get(event.id)!.registration_date,
        is_withdrawn: registrationMap.get(event.id)!.is_withdrawn,
        user: registrationMap.get(event.id)!.user
      })));
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setToast({ 
        message: 'Failed to fetch registrations', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancelRegistration = async (registrationId: number) => {
    try {
      setLoading(true);
      console.log('Attempting to cancel registration:', registrationId);
      // Get the event_id from the registration
      const registration = registrations.find(reg => reg.id === registrationId);
      if (!registration) {
        throw new Error('Registration not found');
      }
      console.log('Found registration:', registration);
      console.log('Calling registerForEvent with:', { eventId: registration.event_id, isWithdraw: true });
      const response = await registerForEvent(registration.event_id, true);
      console.log('Withdrawal response:', response);
      setToast({ message: 'Successfully withdrew from event', type: 'success' });
      
      // Remove the registration from the list
      setRegistrations(prev => prev.filter(reg => reg.id !== registrationId));
      
    } catch (error: any) {
      console.error('Failed to withdraw from event:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        detail: error.detail
      });
      setToast({ 
        message: error.response?.data?.detail || error.detail || 'Failed to withdraw from event', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: keyof Section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderRegistrationCard = (registration: EventRegistration, isCancelled: boolean = false) => {
    console.log('Rendering registration card:', {
      registrationId: registration.id,
      eventId: registration.event.id,
      isCancelled,
      eventIsCancelled: registration.event.is_cancelled,
      event: registration.event
    });

    return (
      <div
        key={registration.id}
        className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${isCancelled ? 'opacity-75' : ''}`}
      >
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">
            Tennis Match at {registration.event.court_location}
            {registration.event.is_cancelled && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Cancelled
              </span>
            )}
          </h3>
          <div className="mt-2 text-sm text-gray-500">
            <p>
              Date:{' '}
              {format(new Date(registration.event.event_date), 'MMMM d, yyyy')}
            </p>
            <p>
              Time:{' '}
              {format(new Date(registration.event.event_time), 'h:mm a')}
            </p>
            {registration.event.max_participants ? (
              <p>
                Participants: {registration.event.registrations?.length || 0}/{registration.event.max_participants}
              </p>
            ) : (
              <p>
                Participants: {registration.event.registrations?.length || 0} (open registration)
              </p>
            )}
            {registration.event.is_cancelled && (
              <p className="text-red-600 mt-2">This event has been cancelled</p>
            )}
          </div>
          <div className="mt-6 space-y-3">
            <button
              onClick={() => setSelectedEvent(registration.event)}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C4E538]"
            >
              See Event Details
            </button>
            {!registration.event.is_cancelled && (
              <button
                onClick={() => handleCancelRegistration(registration.id)}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Withdraw
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading && registrations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C4E538] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your registrations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            My Registrations
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            View and manage your event registrations
          </p>
        </div>

        <div className="mt-12">
          {/* Active Registrations Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between cursor-pointer mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Active Registrations</h2>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => toggleSection('active')}
              >
                {expandedSections.active ? '▼' : '▶'}
              </button>
            </div>
            {expandedSections.active && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registrations.length === 0 ? (
                  <p className="text-gray-500 col-span-full text-center">No active registrations</p>
                ) : (
                  registrations.map(registration => renderRegistrationCard(registration))
                )}
              </div>
            )}
          </div>

          {/* Cancelled Events Section */}
          <div>
            <div className="flex items-center justify-between cursor-pointer mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Cancelled Events</h2>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => toggleSection('cancelled')}
              >
                {expandedSections.cancelled ? '▼' : '▶'}
              </button>
            </div>
            {expandedSections.cancelled && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cancelledRegistrations.length === 0 ? (
                  <p className="text-gray-500 col-span-full text-center">No cancelled events</p>
                ) : (
                  cancelledRegistrations.map(registration => renderRegistrationCard(registration, true))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default MyRegistrations; 