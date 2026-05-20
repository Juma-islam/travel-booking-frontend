"use client";

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { 
  onIdTokenChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User, AuthState, LoginCredentials, RegisterData } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Validate that Firebase user has uid (required)
          if (!firebaseUser.uid) {
            throw new Error('Firebase user has no UID - authentication failed');
          }

          const token = await firebaseUser.getIdToken();
          
          // Sync with backend to get role and Mongo ID
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
          
          // Prefer the real Firebase email, then provider data email, then fallback to a generated placeholder
          const providerEmail = firebaseUser.providerData?.find(p => p.email)?.email;
          const providerName = firebaseUser.providerData?.find(p => p.displayName)?.displayName;
          const userEmail = firebaseUser.email || providerEmail || `firebase-${firebaseUser.uid.substring(0, 12)}@travel-ai.local`;
          const userName = firebaseUser.displayName || providerName || userEmail.split('@')[0];
          
          const syncPayload = {
            email: userEmail,
            name: userName,
            firebaseUid: firebaseUser.uid
          };
          
          console.log("Sending auth sync payload:", syncPayload);
          console.log("Firebase user details:", {
            uid: firebaseUser.uid,
            email: firebaseUser.email || providerEmail || '(missing)',
            displayName: firebaseUser.displayName || providerName || '(missing)',
            provider: firebaseUser.providerData?.[0]?.providerId || 'unknown'
          });
          
          try {
            const res = await fetch(`${baseUrl}/api/auth/sync`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(syncPayload)
            });

            if (res.ok) {
              const backendUser = await res.json();
              
              const user: User = {
                id: backendUser._id,
                email: backendUser.email,
                name: backendUser.name,
                role: backendUser.role,
                createdAt: new Date(),
              };

              localStorage.setItem('auth-token', backendUser.token || token);
              localStorage.setItem('auth-user', JSON.stringify(user));

              setAuthState({
                user,
                isAuthenticated: true,
                isLoading: false
              });
            } else {
              const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
              throw new Error(`Backend sync failed (${res.status}): ${errorData.message || 'Unknown error'}`);
            }
          } catch (fetchError) {
            if (fetchError instanceof TypeError) {
              throw new Error(`Cannot connect to backend at ${baseUrl}. Please ensure the backend server is running.`);
            }
            throw fetchError;
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error("Auth sync error:", errorMessage);
          console.error("Full error object:", error);
          setAuthState({ user: null, isAuthenticated: false, isLoading: false });
          localStorage.removeItem('auth-token');
          localStorage.removeItem('auth-user');
        }
      } else {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        localStorage.removeItem('auth-token');
        localStorage.removeItem('auth-user');
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    } catch (error: any) {
      // If it's a demo account and it doesn't exist in Firebase yet, create it on the fly
      if (
        (credentials.email === "admin@travelai.com" || credentials.email === "demo@travelai.com") &&
        (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-login-credentials')
      ) {
        await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
      } else {
        throw error;
      }
    }
  };

  const register = async (data: RegisterData) => {
    await createUserWithEmailAndPassword(auth, data.email, data.password);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    loginWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}