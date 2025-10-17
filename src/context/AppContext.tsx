import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Mock user type for our simplified auth system
export interface User {
  id: string;
  email: string;
  name?: string;
  created_at?: string;
}

export interface UserProfile {
  id?: string;
  name?: string;
  title?: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  experience?: string;
  availability?: string;
  skills?: string[];
  interests?: string[];
  hourlyRate?: number;
  timezone?: string;
  credits?: number;
  rating?: number;
  totalSessions?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  provider: {
    name: string;
    rating: number;
    avatar: string;
    credits: number;
  };
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  tags: string[];
}

interface AppContextType {
  // Auth state
  currentUser: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  
  // Auth functions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  setCurrentUser: (user: User | null) => void;
  refreshData: () => Promise<void>;
  
  // App state
  currentPage: string;
  setCurrentPage: (page: string) => void;
  
  // Skills state
  skills: Skill[];
  setSkills: (skills: Skill[]) => void;
  
  // Booking state
  bookings: any[];
  setBookings: (bookings: any[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

// Default demo users that should always exist
const DEFAULT_DEMO_USERS = {
  'demo@skillswap.com': {
    email: 'demo@skillswap.com',
    password: 'demo123',
    name: 'Demo User'
  },
  'sarah@example.com': {
    email: 'sarah@example.com',
    password: 'password123',
    name: 'Sarah Chen'
  },
  'john@example.com': {
    email: 'john@example.com',
    password: 'password123',
    name: 'John Smith'
  },
  'emily@skillswap.com': {
    email: 'emily@skillswap.com',
    password: 'password123',
    name: 'Emily Rodriguez'
  },
  'carlos@skillswap.com': {
    email: 'carlos@skillswap.com',
    password: 'password123',
    name: 'Carlos Mendez'
  }
};

// Key for localStorage
const MOCK_USERS_KEY = 'skillswap_mock_users';

// Get mock users from localStorage or initialize with defaults
const getMockUsers = () => {
  try {
    const stored = localStorage.getItem(MOCK_USERS_KEY);
    if (stored) {
      const existing = JSON.parse(stored);
      // Always ensure demo users exist, but keep any additional users
      const merged = { ...DEFAULT_DEMO_USERS, ...existing };
      return merged;
    }
  } catch (error) {
    console.warn('Error reading mock users from localStorage:', error);
  }
  return { ...DEFAULT_DEMO_USERS };
};

// Save mock users to localStorage
const saveMockUsers = (users: any) => {
  try {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.warn('Error saving mock users to localStorage:', error);
  }
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('skillswap_user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
          loadUserProfile(user.id);
          setCurrentPage('dashboard');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('skillswap_user');
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to simulate loading
    setTimeout(initializeAuth, 1000);
  }, []);

  const loadUserProfile = (userId: string) => {
    try {
      const storedProfile = localStorage.getItem(`skillswap_profile_${userId}`);
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
      } else {
        // Create default profile
        const defaultProfile: UserProfile = {
          id: userId,
          credits: 10,
          rating: 4.9,
          totalSessions: 0,
          skills: [],
          interests: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setUserProfile(defaultProfile);
        localStorage.setItem(`skillswap_profile_${userId}`, JSON.stringify(defaultProfile));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const refreshData = async () => {
    // Mock function to refresh user data
    // In a real app, this would fetch fresh data from the server
    if (currentUser) {
      loadUserProfile(currentUser.id);
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Data refreshed');
  };

  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (!currentUser) {
      throw new Error('No user signed in');
    }

    try {
      const updatedProfile = {
        ...userProfile,
        ...profileData,
        id: currentUser.id,
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem(`skillswap_profile_${currentUser.id}`, JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const emailLower = email.toLowerCase().trim();
      
      // Get current mock users
      const mockUsers = getMockUsers();
      
      // Check mock database
      const mockUser = mockUsers[emailLower];
      if (!mockUser || mockUser.password !== password) {
        throw new Error('Invalid email or password. Try demo@skillswap.com with password demo123');
      }

      const user: User = {
        id: btoa(emailLower), // Simple ID generation
        email: emailLower,
        name: mockUser.name,
        created_at: new Date().toISOString()
      };

      // Store user in localStorage
      localStorage.setItem('skillswap_user', JSON.stringify(user));
      
      setCurrentUser(user);
      loadUserProfile(user.id);
      setCurrentPage('dashboard');
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const emailLower = email.toLowerCase().trim();
      const nameTrimmed = name.trim();
      
      // Validate inputs
      if (!emailLower || !password || !nameTrimmed) {
        throw new Error('Please fill in all required fields');
      }
      
      if (!emailLower.includes('@') || !emailLower.includes('.')) {
        throw new Error('Please enter a valid email address');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      // Get current mock users
      const mockUsers = getMockUsers();
      
      // Check if user already exists
      if (mockUsers[emailLower]) {
        throw new Error(`An account with email ${emailLower} already exists. Please try signing in instead.`);
      }

      // Create new user
      const user: User = {
        id: btoa(emailLower), // Simple ID generation
        email: emailLower,
        name: nameTrimmed,
        created_at: new Date().toISOString()
      };

      // Add to mock database
      const updatedUsers = {
        ...mockUsers,
        [emailLower]: { 
          email: emailLower, 
          password: password, 
          name: nameTrimmed 
        }
      };
      saveMockUsers(updatedUsers);

      // Store user in localStorage
      localStorage.setItem('skillswap_user', JSON.stringify(user));
      
      // Create initial profile
      const initialProfile: UserProfile = {
        id: user.id,
        name: nameTrimmed,
        credits: 10,
        rating: 0,
        totalSessions: 0,
        skills: [],
        interests: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(`skillswap_profile_${user.id}`, JSON.stringify(initialProfile));
      setUserProfile(initialProfile);
      setCurrentUser(user);
      setCurrentPage('dashboard');
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Clear localStorage
      localStorage.removeItem('skillswap_user');
      
      setCurrentUser(null);
      setUserProfile(null);
      setCurrentPage('home');
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  const value: AppContextType = {
    // Auth state
    currentUser,
    userProfile,
    isLoading,
    
    // Auth functions
    signIn,
    signUp,
    signOut,
    updateUserProfile,
    setCurrentUser,
    refreshData,
    
    // App state
    currentPage,
    setCurrentPage,
    
    // Skills state
    skills,
    setSkills,
    
    // Booking state
    bookings,
    setBookings,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};