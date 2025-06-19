import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/animations.css';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Modern gradient background with animated shapes */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-50 z-0">
          {/* CSS-based pattern overlay */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `radial-gradient(#C4E538 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-72 h-72 bg-[#C4E538] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-20 w-72 h-72 bg-[#B4D532] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-[#A4C52C] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8">
            <div className="inline-block">
              <h1 className="text-7xl font-bold text-gray-900 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
                RacketBuddy
              </h1>
              <div className="h-1 w-24 bg-[#C4E538] mx-auto mt-4 rounded-full"></div>
            </div>
            <p className="text-3xl text-gray-600 max-w-3xl mx-auto animate-fade-in-delay leading-relaxed">
              Connect with tennis players, organize matches, and improve your game together.
            </p>
            {!isAuthenticated && (
              <div className="flex justify-center space-x-6 animate-fade-in-delay-2">
                <Link
                  to="/register"
                  className="bg-[#C4E538] text-gray-900 px-10 py-4 rounded-full text-xl font-medium hover:bg-[#B4D532] transition-all duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-1"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="bg-white text-[#C4E538] px-10 py-4 rounded-full text-xl font-medium border-2 border-[#C4E538] hover:bg-green-50 transition-all duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-1"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-center text-gray-900 mb-20 animate-fade-in">
            Everything you need to play tennis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-10 transform hover:-translate-y-2">
              <div className="bg-[#C4E538] bg-opacity-10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#C4E538]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">Find Players</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Connect with tennis players of all skill levels in your area. Find the perfect match for your next game.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-10 transform hover:-translate-y-2">
              <div className="bg-[#C4E538] bg-opacity-10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#C4E538]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">Organize Matches</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Create and join tennis events easily. Set up matches, manage participants, and keep track of your games.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-10 transform hover:-translate-y-2">
              <div className="bg-[#C4E538] bg-opacity-10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#C4E538]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">Improve Together</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Track your progress, share tips, and grow as a player with a supportive tennis community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-center text-gray-900 mb-20 animate-fade-in">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 transform hover:-translate-y-2">
              <div className="bg-[#C4E538] bg-opacity-10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-[#C4E538]">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Create Account</h3>
              <p className="text-lg text-gray-600 leading-relaxed">Sign up and set up your profile with your skill level and preferences.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 transform hover:-translate-y-2">
              <div className="bg-[#C4E538] bg-opacity-10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-[#C4E538]">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Join Events</h3>
              <p className="text-lg text-gray-600 leading-relaxed">Participate in tennis events or organize your own matches.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 transform hover:-translate-y-2">
              <div className="bg-[#C4E538] bg-opacity-10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-[#C4E538]">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Play & Connect</h3>
              <p className="text-lg text-gray-600 leading-relaxed">Enjoy your game and build lasting connections with fellow players.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Only show for non-authenticated users */}
      {!isAuthenticated && (
        <section className="py-32 bg-[#C4E538]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold text-gray-900 mb-8 animate-fade-in">
                Ready to Start Playing?
              </h2>
              <p className="text-2xl text-gray-800 mb-12 animate-fade-in-delay">
                Join our community of tennis enthusiasts and take your game to the next level.
              </p>
              <Link
                to="/register"
                className="bg-white text-[#C4E538] px-12 py-4 rounded-full text-xl font-medium hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-lg inline-block"
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-16 bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h3 className="text-3xl font-bold text-white">RacketBuddy</h3>
              <p className="mt-2 text-lg">Your tennis community</p>
            </div>
            <div className="flex space-x-8">
              <Link to="/about" className="text-lg hover:text-white transition-colors">About</Link>
              <Link to="/privacy" className="text-lg hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="text-lg hover:text-white transition-colors">Terms</Link>
              <Link to="/contact" className="text-lg hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          <div className="mt-12 text-center text-sm">
            © {new Date().getFullYear()} RacketBuddy. All rights reserved.
          </div>
          <div className="mt-4 text-center text-sm text-gray-400 flex items-center justify-center space-x-2">
            <span>Created with</span>
            <span className="text-xl">🎾</span>
            <span>by Christian Morini</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 