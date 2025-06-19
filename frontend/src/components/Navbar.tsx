import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    console.log('User data in Navbar:', user);
    console.log('Profile image URL:', user?.profile_image);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getLinkClass = (path: string) => {
    const baseClass = "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium";
    const activeClass = "border-[#C4E538] text-[#C4E538]";
    const inactiveClass = "border-transparent text-gray-500 hover:border-[#C4E538] hover:text-[#C4E538]";
    
    return `${baseClass} ${isActive(path) ? activeClass : inactiveClass}`;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-3xl font-extrabold tracking-tight text-[#C4E538] hover:opacity-80 transition-opacity">RacketBuddy</Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {isAuthenticated && (
                <>
                  <Link
                    to="/events"
                    className={getLinkClass('/events')}
                  >
                    Find Events
                  </Link>
                  <Link
                    to="/create-event"
                    className={getLinkClass('/create-event')}
                  >
                    Create Event
                  </Link>
                  <Link
                    to="/manage-events"
                    className={getLinkClass('/manage-events')}
                  >
                    Events Manager
                  </Link>
                  <Link
                    to="/my-registrations"
                    className={getLinkClass('/my-registrations')}
                  >
                    My Registrations
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="relative">
                <div className="flex items-center">
                  <div className="relative group">
                    <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer">
                      {user?.profile_image ? (
                        <img
                          src={`http://localhost:8000/uploads/${user.profile_image}`}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#C4E538] flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        <Link
                          to="/profile"
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={getLinkClass('/login')}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={getLinkClass('/register')}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 