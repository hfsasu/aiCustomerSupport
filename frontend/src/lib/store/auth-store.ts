import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../supabase/schema';
import { useAuth, useUser } from '@clerk/nextjs';

// This is a lightweight wrapper around Clerk's auth
// It maintains compatibility with the rest of our app while using Clerk

interface AuthState {
  // We'll keep minimal state here since Clerk manages most of it
  clerkToSupabaseUser: (clerkUser: any) => User | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Convert Clerk user to our app's user format
      clerkToSupabaseUser: (clerkUser) => {
        if (!clerkUser) return null;
        
        return {
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          created_at: clerkUser.createdAt || new Date().toISOString()
        };
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Custom hook to get the current user in our app's format
export function useCurrentUser() {
  const { user: clerkUser } = useUser();
  const clerkToSupabaseUser = useAuthStore(state => state.clerkToSupabaseUser);
  
  return {
    user: clerkUser ? clerkToSupabaseUser(clerkUser) : null,
    isLoaded: true,
    isSignedIn: !!clerkUser
  };
}