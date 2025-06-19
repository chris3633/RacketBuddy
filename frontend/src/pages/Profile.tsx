import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateUser } from '../services/api';
import { User, Sex, TennisLevel, UpdateUserData } from '../types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<UpdateUserData>({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    sex: 'male' as Sex,
    tennis_level: 'beginner' as TennisLevel,
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        date_of_birth: user.date_of_birth.split('T')[0],
        sex: user.sex,
        tennis_level: user.tennis_level,
      });
      if (user.profile_image) {
        setPreviewUrl(`http://localhost:8000/uploads/${user.profile_image}`);
      }
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfileImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateUser({
        ...formData,
        profile_image: profileImage
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
      console.error('Update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Settings</h3>
            <div className="mt-6">
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <img
                    src={previewUrl || 'https://via.placeholder.com/150'}
                    alt="Profile"
                    className="h-32 w-32 rounded-full object-cover border-4 border-[#C4E538]"
                  />
                  <label
                    htmlFor="profile-image"
                    className="absolute bottom-0 right-0 bg-[#C4E538] text-gray-900 p-2 rounded-full cursor-pointer hover:bg-[#B4D532] transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </label>
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                      First name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-[#C4E538] focus:border-[#C4E538] block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                      Last name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-[#C4E538] focus:border-[#C4E538] block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={user.email}
                        disabled
                        className="bg-gray-50 shadow-sm block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
                      Date of birth
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        name="date_of_birth"
                        id="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-[#C4E538] focus:border-[#C4E538] block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
                      Sex
                    </label>
                    <div className="mt-1">
                      <select
                        id="sex"
                        name="sex"
                        value={formData.sex}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-[#C4E538] focus:border-[#C4E538] block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="tennis_level" className="block text-sm font-medium text-gray-700">
                      Tennis level
                    </label>
                    <div className="mt-1">
                      <select
                        id="tennis_level"
                        name="tennis_level"
                        value={formData.tennis_level}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-[#C4E538] focus:border-[#C4E538] block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="professional">Professional</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Member since
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        value={new Date(user.created_at).toLocaleDateString()}
                        disabled
                        className="bg-gray-50 shadow-sm block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-5">
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-900 bg-[#C4E538] hover:bg-[#B4D532] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C4E538] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 