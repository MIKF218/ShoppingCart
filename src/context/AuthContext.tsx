import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import app from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth';

// Initialize Firebase Auth
const auth = getAuth(app);

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: null | {
    id: string;
    email: string;
    name: string;
  };
}

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    loading: true,
    error: null,
    user: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthState({
          isAuthenticated: true,
          loading: false,
          error: null,
          user: {
            id: user.uid,
            email: user.email || '',
            name: user.displayName || '',
          },
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          loading: false,
          error: null,
          user: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to login',
      }));
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to register',
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Check if there's a current user before attempting to sign out
      if (!auth.currentUser) {
        throw new Error('No user is currently logged in');
      }

      await signOut(auth);
      
      // Explicitly set the auth state to logged out
      setAuthState({
        isAuthenticated: false,
        loading: false,
        error: null,
        user: null,
      });
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to logout',
      }));
      throw error;
    }
  };

  const updateUserProfile = async (name: string) => {
    try {
      if (!auth.currentUser) throw new Error('No user logged in');
      await updateProfile(auth.currentUser, { displayName: name });
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, name } : null,
      }));
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Failed to update profile',
      }));
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        register,
        logout,
        updateProfile: updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};