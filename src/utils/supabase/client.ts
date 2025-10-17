import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Use static values for the demo environment
const supabaseUrl = 'https://placeholder.supabase.co';
const supabaseAnonKey = 'placeholder-key';

export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
};

// Create a singleton instance for compatibility with existing code
export const supabase = createClient();

// Mock makeRequest function for API calls
export const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
  // Since we're using a mock authentication system, we'll simulate API responses
  console.log(`Mock API call to ${endpoint}`, options);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Handle different endpoints
  switch (endpoint) {
    case '/skills':
      if (options.method === 'POST') {
        // Mock skill creation
        return { id: Date.now(), ...JSON.parse(options.body as string) };
      }
      break;
      
    case '/auth/signup':
      if (options.method === 'POST') {
        const userData = JSON.parse(options.body as string);
        // Mock user creation
        return { 
          id: btoa(userData.email), 
          email: userData.email, 
          name: userData.name,
          created_at: new Date().toISOString()
        };
      }
      break;
      
    case '/users/me':
      // Mock user profile fetch
      return {
        id: 'mock-user-id',
        email: 'demo@skillswap.com',
        name: 'Demo User',
        credits: 10,
        skills: [],
        created_at: new Date().toISOString()
      };
      
    default:
      // Default mock response
      return { success: true, message: 'Mock API response' };
  }
  
  // If no specific handler, return success
  return { success: true };
};