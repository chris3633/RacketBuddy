import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../services/api';
import { debounce } from 'lodash';

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: '',
    latitude: 0,
    longitude: 0,
    event_date: '',
    event_time: '',
    max_participants: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchAddress = debounce(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      console.log('Searching for:', query);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/geocode?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Search results:', data);
      
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

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('Input value changed:', value);
    setFormData(prev => ({ ...prev, address: value }));
    searchAddress(value);
  };

  const handleAddressSelect = (result: SearchResult) => {
    console.log('Selected result:', result);
    setFormData(prev => ({
      ...prev,
      address: result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon)
    }));
    setSearchResults([]);
    setShowResults(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const eventDateTime = new Date(`${formData.event_date}T${formData.event_time}`);
      
      const eventData = {
        ...formData,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : undefined,
        event_date: eventDateTime.toISOString(),
        event_time: eventDateTime.toISOString(),
      };
      await createEvent(eventData);
      navigate('/events');
    } catch (err: any) {
      console.error('Create event error:', err);
      let errorMsg = 'Failed to create event';
      if (err.detail) {
        errorMsg = typeof err.detail === 'string' ? err.detail : JSON.stringify(err.detail);
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Create Your Event
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Set up a new tennis event and allow players to join
          </p>
        </div>

        <div className="mt-12">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                  Create New Event
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="address-search-container">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Location
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="text"
                        name="address"
                        id="address"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#C4E538] focus:border-[#C4E538] sm:text-sm"
                        value={formData.address}
                        onChange={handleAddressChange}
                        placeholder="Search for a location"
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
                              onClick={() => handleAddressSelect(result)}
                            >
                              <div className="flex items-center">
                                <span className="ml-3 truncate">{result.display_name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="event_date"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Date
                    </label>
                    <input
                      type="date"
                      name="event_date"
                      id="event_date"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#C4E538] focus:border-[#C4E538] sm:text-sm"
                      value={formData.event_date}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="event_time"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Time
                    </label>
                    <input
                      type="time"
                      name="event_time"
                      id="event_time"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#C4E538] focus:border-[#C4E538] sm:text-sm"
                      value={formData.event_time}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="max_participants"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Max Participants
                    </label>
                    <input
                      type="number"
                      name="max_participants"
                      id="max_participants"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#C4E538] focus:border-[#C4E538] sm:text-sm"
                      value={formData.max_participants}
                      onChange={handleChange}
                      placeholder="Enter max participants"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#C4E538] focus:border-[#C4E538] sm:text-sm"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter event description"
                    />
                  </div>

                  {error && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">{error}</h3>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#C4E538] hover:bg-[#B4D532] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C4E538] disabled:opacity-50"
                    >
                      {loading ? 'Creating...' : 'Create Event'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent; 