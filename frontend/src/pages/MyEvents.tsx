import React, { useState, useEffect } from 'react';
import { getMyEvents, cancelEvent } from '../services/api';
import { Event } from '../types';
import { format } from 'date-fns';

const MyEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getMyEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (eventId: number) => {
    try {
      await cancelEvent(eventId);
      // Refresh events after cancellation
      fetchEvents();
    } catch (err) {
      setError('Failed to cancel event');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage the events you've created
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white overflow-hidden shadow rounded-lg"
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
                {event.max_participants && (
                  <p>
                    Spots:{' '}
                    {event.max_participants - (event.registrations?.length || 0)}/
                    {event.max_participants}
                  </p>
                )}
                <p className="mt-2">
                  Status:{' '}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      event.is_cancelled
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {event.is_cancelled ? 'Cancelled' : 'Active'}
                  </span>
                </p>
              </div>
              {!event.is_cancelled && (
                <div className="mt-4">
                  <button
                    onClick={() => handleCancel(event.id)}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Cancel Event
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">
            No events created yet
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Create your first event to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default MyEvents; 