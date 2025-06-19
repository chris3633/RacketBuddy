import React, { useState } from 'react';
import { Event } from '../types';
import { format } from 'date-fns';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface EventCardProps {
  event: Event;
  onRegister?: () => void;
  onWithdraw?: () => void;
  onCancel?: () => void;
  isRegistered?: boolean;
  isCreator?: boolean;
  setSelectedEvent?: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onRegister, onWithdraw, onCancel, isRegistered, isCreator, setSelectedEvent }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  console.log('EventCard props:', {
    eventId: event.id,
    isRegistered,
    isCreator,
    hasWithdrawHandler: !!onWithdraw,
    registrations: event.registrations,
    is_cancelled: event.is_cancelled
  });

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
      isCreator ? 'border-2 border-[#C4E538]' : ''
    }`}>
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">
          Tennis Match at {event.court_location}
          {isCreator && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#C4E538] text-gray-900">
              Your Event
            </span>
          )}
          {event.is_cancelled && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Cancelled
            </span>
          )}
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
          {event.max_participants ? (
            <p>
              Participants: {event.registrations?.length || 0}/{event.max_participants}
            </p>
          ) : (
            <p>
              Participants: {event.registrations?.length || 0} (open registration)
            </p>
          )}
        </div>
        <div className="mt-6 space-y-3">
          <button
            onClick={() => setSelectedEvent?.(event)}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C4E538]"
          >
            See Event Details
          </button>
          {isRegistered && onWithdraw && !event.is_cancelled && (
            <button
              onClick={onWithdraw}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Withdraw
            </button>
          )}
          {!isRegistered && onRegister && !event.is_cancelled && (
            event.max_participants !== null && event.registrations && event.registrations.length >= event.max_participants ? (
              <button
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 cursor-not-allowed"
                disabled
              >
                Event Full
              </button>
            ) : (
              <button
                onClick={onRegister}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-900 bg-[#C4E538] hover:bg-[#B4D532] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C4E538]"
              >
                Register
              </button>
            )
          )}
          {isCreator && onCancel && !event.is_cancelled && (
            <button
              onClick={onCancel}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel Event
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard; 