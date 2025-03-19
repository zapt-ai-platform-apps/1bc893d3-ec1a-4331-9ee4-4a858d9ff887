import React, { createContext, useState, useEffect, useRef } from 'react';
import { supabase, recordLogin } from '@/supabaseClient';
import { eventBus, events } from '@/modules/core/events';
import * as Sentry from '@sentry/browser';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [hasRecordedLogin, setHasRecordedLogin] = useState(false);
  const hasSessionRef = useRef(false);
  
  // Use this function to update session so we also update our ref
  const updateSession = (newSession) => {
    setSession(newSession);
    hasSessionRef.current = newSession !== null;
  };

  // Fetch user profile and type from the database
  const fetchUserProfile = async (userId) => {
    try {
      const response = await fetch(`/api/users/profile?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      setUserProfile(data.profile);
      setUserType(data.profile.userType);
      return data.profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Sentry.captureException(error);
      return null;
    }
  };
  
  useEffect(() => {
    // Check active session on initial mount
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        // Set initial session
        updateSession(data.session);
        if (data.session) {
          hasSessionRef.current = true;
          setUser(data.session.user);
          await fetchUserProfile(data.session.user.id);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error checking session:', error);
        Sentry.captureException(error);
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth event:', event, 'Has session:', hasSessionRef.current);
      
      // For SIGNED_IN, only update session if we don't have one
      if (event === 'SIGNED_IN') {
        if (!hasSessionRef.current) {
          updateSession(newSession);
          setUser(newSession.user);
          await fetchUserProfile(newSession.user.id);
          eventBus.publish(events.USER_SIGNED_IN, { user: newSession.user });
          setHasRecordedLogin(false);
        } else {
          console.log('Already have session, ignoring SIGNED_IN event');
        }
      }
      // For TOKEN_REFRESHED, always update the session
      else if (event === 'TOKEN_REFRESHED') {
        updateSession(newSession);
        setUser(newSession.user);
      }
      // For SIGNED_OUT, clear the session
      else if (event === 'SIGNED_OUT') {
        updateSession(null);
        setUser(null);
        setUserType(null);
        setUserProfile(null);
        eventBus.publish(events.USER_SIGNED_OUT, {});
        setHasRecordedLogin(false);
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []); // No dependencies to prevent re-creating the listener
  
  useEffect(() => {
    if (session?.user?.email && !hasRecordedLogin) {
      try {
        recordLogin(session.user.email, import.meta.env.VITE_PUBLIC_APP_ENV);
        setHasRecordedLogin(true);
      } catch (error) {
        console.error('Failed to record login:', error);
        Sentry.captureException(error);
      }
    }
  }, [session, hasRecordedLogin]);
  
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      Sentry.captureException(error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        session, 
        user, 
        loading, 
        signOut, 
        userType, 
        userProfile, 
        refreshProfile: () => user && fetchUserProfile(user.id) 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}