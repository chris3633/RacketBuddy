import React, { useState, useEffect } from 'react';
import { getMyEvents, cancelEvent, registerForEvent } from '../services/api';
import { Event } from '../types';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import LocationMap from '../components/LocationMap';

const ManageEvents: React.FC = () => {
  const [activeEvents, setActiveEvents] = useState<Event[]>([]);
  const [cancelledEvents, setCancelledEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelled, setShowCancelled] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

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
      const data = await getMyEvents();
      const active = data.filter(event => !event.is_cancelled);
      const cancelled = data.filter(event => event.is_cancelled);
      setActiveEvents(active);
      setCancelledEvents(cancelled);
      setError(null);
    } catch (err) {
      setError('Failed to fetch events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEvent = async (eventId: number) => {
    try {
      await cancelEvent(eventId);
      await fetchEvents();
      setToast({ message: 'Event cancelled successfully', type: 'success' });
    } catch (err) {
      console.error('Error cancelling event:', err);
      setToast({ message: 'Failed to cancel event', type: 'error' });
    }
  };

  const handleWithdraw = async (eventId: number) => {
    try {
      console.log('Attempting to withdraw from event:', eventId);
      const response = await registerForEvent(eventId, true);
      console.log('Withdrawal response:', response);
      setToast({ message: 'Successfully withdrew from event', type: 'success' });
      // Refresh events to update the UI
      await fetchEvents();
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
    }
  };

  const handleRegister = async (eventId: number) => {
    try {
      console.log('Attempting to register for event:', eventId);
      await registerForEvent(eventId);
      // Refresh events after registration
      await fetchEvents();
      setToast({ message: 'Successfully registered for event!', type: 'success' });
    } catch (err: any) {
      console.error('Failed to register for event:', err);
      console.error('Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        detail: err.detail
      });
      let errorMsg = 'Failed to register for event';
      if (err.detail) {
        errorMsg = typeof err.detail === 'string' ? err.detail : JSON.stringify(err.detail);
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
      setToast({ message: errorMsg, type: 'error' });
    }
  };

  const formatDateTime = (date: string, time: string) => {
    console.log('Raw date:', date, 'Raw time:', time);
    
    // Parse the ISO date string
    const dateObj = new Date(date);
    const timeObj = new Date(time);
    
    // Combine the date from dateObj with the time from timeObj
    const combinedDateTime = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate(),
      timeObj.getHours(),
      timeObj.getMinutes()
    );
    
    console.log('Combined DateTime:', combinedDateTime);
    
    // Format the date and time
    const formatted = combinedDateTime.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
    
    console.log('Formatted result:', formatted);
    return formatted;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C4E538] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
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
            Manage Your Events
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            View and manage all your tennis events
          </p>
        </div>

        {/* Active Events Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Active Events</h2>
          </div>
          {activeEvents.length === 0 ? (
            <p className="text-gray-500 text-center">No active events</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activeEvents.map(event => {
                const isRegistered = event.registrations?.some(reg => reg.user?.id === user?.id) || false;
                return (
                  <div
                    key={event.id}
                    className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium text-gray-900">
                        Tennis Match at {event.court_location}
                      </h3>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>
                          Date:{' '}
                          {format(new Date(event.event_date), 'MMMM d, yyyy')}
                        </p>
                        <p>
                          Time:{' '}
                          {format(new Date(event.event_time), 'h:mm a')}
                        </p>
                        <p>
                          Participants:{' '}
                          {event.registrations?.length || 0}/{event.max_participants || 'Unlimited'}
                        </p>
                      </div>
                      <div className="mt-6 space-y-3">
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C4E538]"
                        >
                          View Details
                        </button>
                        {isRegistered ? (
                          <button
                            onClick={() => handleWithdraw(event.id)}
                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                          >
                            Withdraw
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRegister(event.id)}
                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-900 bg-[#C4E538] hover:bg-[#B4D532] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C4E538]"
                          >
                            Register
                          </button>
                        )}
                        <button
                          onClick={() => handleCancelEvent(event.id)}
                          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Cancel Event
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cancelled Events Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Cancelled Events</h2>
            <button
              onClick={() => setShowCancelled(!showCancelled)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C4E538]"
            >
              {showCancelled ? 'Hide Cancelled Events' : 'Show Cancelled Events'}
            </button>
          </div>
          {showCancelled && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cancelledEvents.length === 0 ? (
                <p className="text-gray-500 col-span-full text-center">No cancelled events</p>
              ) : (
                cancelledEvents.map(event => {
                  const isRegistered = event.registrations?.some(reg => reg.user?.id === user?.id) || false;
                  return (
                    <div
                      key={event.id}
                      className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200 opacity-75"
                    >
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900">
                          Tennis Match at {event.court_location}
                        </h3>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>
                            Date:{' '}
                            {format(new Date(event.event_date), 'MMMM d, yyyy')}
                          </p>
                          <p>
                            Time:{' '}
                            {format(new Date(event.event_time), 'h:mm a')}
                          </p>
                          <p>
                            Participants:{' '}
                            {event.registrations?.length || 0}/{event.max_participants || 'Unlimited'}
                          </p>
                          <p className="text-red-600 mt-2">This event has been cancelled</p>
                        </div>
                        <div className="mt-6 space-y-3">
                          <button
                            onClick={() => setSelectedEvent(event)}
                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C4E538]"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Tennis Match at {selectedEvent.court_location}
                  </h3>
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
                  {/* Location */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Location</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedEvent.court_location}</p>
                    <div className="mt-2">
                      <LocationMap 
                        location={selectedEvent.court_location}
                        latitude={selectedEvent.latitude}
                        longitude={selectedEvent.longitude}
                      />
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Date & Time</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {format(new Date(selectedEvent.event_date), 'MMMM d, yyyy')} at{' '}
                      {format(new Date(selectedEvent.event_time), 'h:mm a')}
                    </p>
                  </div>

                  {/* Description */}
                  {selectedEvent.description && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Description</h4>
                      <p className="mt-1 text-sm text-gray-900">{selectedEvent.description}</p>
                    </div>
                  )}

                  {/* Participants */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Participants</h4>
                    <div className="mt-2 space-y-2">
                      {selectedEvent.registrations?.map(registration => (
                        <div key={registration.id} className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {registration.user?.profile_image ? (
                              <img
                                src={`http://localhost:8000/uploads/${registration.user.profile_image}`}
                                alt={`${registration.user.first_name} ${registration.user.last_name}`}
                                className="h-8 w-8 rounded-full"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-500">
                                  {registration.user?.first_name?.charAt(0) || '?'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
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
                      ))}
                    </div>
                  </div>

                  {/* Capacity */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Capacity</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedEvent.max_participants
                        ? `${selectedEvent.registrations?.length || 0}/${selectedEvent.max_participants} spots filled`
                        : `${selectedEvent.registrations?.length || 0} (open registration)`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEvents; 