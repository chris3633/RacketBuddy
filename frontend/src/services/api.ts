import axios from 'axios';
import { AuthResponse, Event, EventRegistration, LoginCredentials, RegisterData, User, Sex, TennisLevel, UpdateUserData } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (!error.response) {
      // Network error or server not responding
      return Promise.reject({
        message: 'Unable to connect to server. Please check your internet connection.'
      });
    }
    
    if (error.response.status === 401) {
      // Clear token and redirect to login on auth error
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error.response.data || error);
  }
);

// Auth endpoints
export const login = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    console.log('Login attempt for:', username);

    const response = await api.post('/api/auth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    console.log('Login successful');
    return response.data;
  } catch (error: any) {
    console.error('Login error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 401) {
      throw new Error('Invalid email or password');
    } else if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    } else {
      throw new Error('Failed to login. Please try again.');
    }
  }
};

export const register = async (userData: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  sex: Sex;
  tennis_level: TennisLevel;
}): Promise<User> => {
  try {
    // Format the data to match the server's expectations
    const formattedData = {
      email: userData.email.trim(),
      password: userData.password,
      first_name: userData.first_name.trim(),
      last_name: userData.last_name.trim(),
      date_of_birth: new Date(userData.date_of_birth).toISOString().split('.')[0] + 'Z', // Format as YYYY-MM-DDThh:mm:ssZ
      sex: userData.sex,
      tennis_level: userData.tennis_level
    };

    console.log('API Registration Request:', {
      url: '/api/auth/register',
      method: 'POST',
      data: { ...formattedData, password: '***' }
    });

    const response = await api.post('/api/auth/register', formattedData);
    console.log('API Registration Response:', response.data);
    return response.data;
  } catch (error: any) {
    // Format the data again for error logging
    const formattedData = {
      email: userData.email.trim(),
      password: userData.password,
      first_name: userData.first_name.trim(),
      last_name: userData.last_name.trim(),
      date_of_birth: new Date(userData.date_of_birth).toISOString().split('.')[0] + 'Z',
      sex: userData.sex,
      tennis_level: userData.tennis_level
    };

    console.error('API Registration Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      headers: error.response?.headers,
      requestData: { ...userData, password: '***' },
      formattedData: { ...formattedData, password: '***' }
    });
    
    // Log validation errors if present
    if (error.response?.data?.detail) {
      console.error('Validation Errors:', error.response.data.detail);
      if (Array.isArray(error.response.data.detail)) {
        error.response.data.detail.forEach((err: any) => {
          console.error('Validation Error:', {
            field: err.loc,
            message: err.msg,
            type: err.type
          });
        });
      }
    }
    
    if (error.response?.data?.detail) {
      // If the detail is an array, join the messages
      if (Array.isArray(error.response.data.detail)) {
        throw new Error(error.response.data.detail.map((err: any) => err.msg).join(', '));
      }
      // If it's a string, use it directly
      throw new Error(error.response.data.detail);
    }
    throw error;
  }
};

// User endpoints
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/api/users/me');
  return response.data;
};

export const updateUser = async (data: UpdateUserData): Promise<User> => {
  try {
    const formData = new FormData();
    
    // Add text fields
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'profile_image' && value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    
    // Add profile image if present
    if (data.profile_image) {
      formData.append('profile_image', data.profile_image);
    }
    
    const response = await api.put<User>('/api/users/me', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Update user error:', error);
    throw error;
  }
};

// Event endpoints
export const getEvents = async (): Promise<Event[]> => {
  try {
    console.log('Fetching events...');
    const response = await api.get<Event[]>('/api/events');
    console.log('Events response:', response.data);
    // Log each event's registrations
    response.data.forEach(event => {
      console.log(`Event ${event.id} registrations:`, event.registrations);
    });
    return response.data;
  } catch (error: any) {
    console.error('Get events error:', error);
    throw error;
  }
};

export const getMyEvents = async (): Promise<Event[]> => {
  try {
    const response = await api.get<Event[]>('/api/events/my-events');
    return response.data;
  } catch (error: any) {
    console.error('Get my events error:', error);
    throw error;
  }
};

export const createEvent = async (eventData: {
  address: string;
  latitude: number;
  longitude: number;
  event_date: string;
  event_time: string;
  max_participants?: number;
  description?: string;
}): Promise<Event> => {
  try {
    const response = await api.post('/api/events', {
      ...eventData,
      court_location: eventData.address
    });
    return response.data;
  } catch (error: any) {
    console.error('Create event error:', error);
    throw error;
  }
};

export const registerForEvent = async (eventId: number, isWithdraw: boolean = false): Promise<EventRegistration | { message: string }> => {
  try {
    console.log('Registering for event:', { eventId, isWithdraw });
    // Check if we have a token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const response = await api.post<EventRegistration | { message: string }>(`/api/events/${eventId}/register?is_withdraw=${isWithdraw}`);
    console.log('Registration response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Register for event error:', error);
    if (error.response) {
      console.error('Error response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    throw error;
  }
};

export const cancelEvent = async (eventId: number): Promise<void> => {
  try {
    const response = await api.delete(`/api/events/${eventId}`);
    return response.data;
  } catch (error: any) {
    console.error('Cancel event error:', error);
    throw error;
  }
};

export const getMyRegistrations = async (): Promise<EventRegistration[]> => {
  try {
    console.log('Fetching registrations...');
    const response = await api.get<EventRegistration[]>('/api/events/my-registrations');
    console.log('Received registrations:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Get my registrations error:', error);
    throw error;
  }
};

export const cancelRegistration = async (registrationId: number): Promise<void> => {
  try {
    console.log('Canceling registration:', registrationId);
    const response = await api.delete(`/api/events/registrations/${registrationId}`);
    console.log('Cancel registration response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Cancel registration error:', error);
    if (error.response) {
      console.error('Error response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    throw error;
  }
};

export default api; 