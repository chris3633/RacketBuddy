import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            About RacketBuddy
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Your Ultimate Tennis Community Platform
          </p>
        </div>

        <div className="mt-12 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            <p className="mt-4 text-gray-600">
              RacketBuddy is dedicated to bringing tennis enthusiasts together, making it easier than ever to find, organize, and participate in tennis matches. We believe that tennis is more than just a sport—it's a community.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">What We Do</h2>
            <div className="mt-4 space-y-4 text-gray-600">
              <p>
                • <strong>Find Matches:</strong> Discover tennis events in your area and connect with players of similar skill levels.
              </p>
              <p>
                • <strong>Organize Events:</strong> Create and manage your own tennis events, set participant limits, and track registrations.
              </p>
              <p>
                • <strong>Community Building:</strong> Join a network of tennis enthusiasts, share experiences, and grow your tennis community.
              </p>
              <p>
                • <strong>Location-Based:</strong> Find courts and events near you with our integrated location services.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">Our Features</h2>
            <div className="mt-4 space-y-4 text-gray-600">
              <p>
                • <strong>Event Management:</strong> Create, manage, and track tennis events with ease.
              </p>
              <p>
                • <strong>Registration System:</strong> Easy registration and withdrawal from events.
              </p>
              <p>
                • <strong>Location Services:</strong> Find courts and events in your area.
              </p>
              <p>
                • <strong>User Profiles:</strong> Track your tennis journey and connect with other players.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">Join Our Community</h2>
            <p className="mt-4 text-gray-600">
              Whether you're a seasoned player or just starting out, RacketBuddy is here to help you find your next tennis match. Join our growing community of tennis enthusiasts and start playing today!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 