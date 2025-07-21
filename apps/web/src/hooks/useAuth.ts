'use client';

import { useState, useEffect } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, appleProvider, db } from '@/lib/firebase';
import type { AuthUser, RegistrationData, PredefinedEmployee } from '@/types/auth';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Load user data from Firestore
        const userData = await loadUserData(firebaseUser);
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadUserData = async (firebaseUser: User): Promise<AuthUser> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userData = userDoc.data();

      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role: userData?.role || 'employee',
        employeeData: userData?.employeeData,
      };
    } catch (error) {
      console.error('Error loading user data:', error);
      // Return basic user data if Firestore fails
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role: 'employee',
      };
    }
  };

  const registerWithEmail = async (data: RegistrationData, selectedEmployee?: PredefinedEmployee) => {
    try {
      setError(null);
      setLoading(true);

      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Update display name
      if (selectedEmployee?.name) {
        await updateProfile(firebaseUser, {
          displayName: selectedEmployee.name
        });
      }

      // Save user data to Firestore
      const userData: Partial<AuthUser> = {
        role: data.role,
        ...(data.role === 'employee' && selectedEmployee && {
          employeeData: {
            predefinedId: selectedEmployee.id,
            name: selectedEmployee.name,
            station: selectedEmployee.station,
          }
        })
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);

      // Mark employee as taken if it's an employee registration
      if (data.role === 'employee' && selectedEmployee) {
        await updateDoc(doc(db, 'predefined-employees', selectedEmployee.id), {
          isAvailable: false,
          registeredBy: firebaseUser.uid
        });
      }

      return { success: true };
    } catch (error: any) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      
      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        // New user - redirect to role selection
        return { success: true, isNewUser: true };
      }
      
      return { success: true, isNewUser: false };
    } catch (error: any) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signInWithApple = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInWithPopup(auth, appleProvider);
      
      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        // New user - redirect to role selection
        return { success: true, isNewUser: true };
      }
      
      return { success: true, isNewUser: false };
    } catch (error: any) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    loading,
    error,
    registerWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signInWithApple,
    logout,
  };
} 