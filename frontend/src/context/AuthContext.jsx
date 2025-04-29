import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Create the authentication context
const AuthContext = createContext();

// Create a provider component
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        // Set up a listener for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);

            // Determine user role
            if (user) {
                // In a production environment, you would typically:
                // 1. Query Firestore for a user's role
                // 2. Use Firebase Custom Claims
                // 3. Or have a role-based database structure

                // For this demo, we'll use a simple email check
                // Super Admin emails contain 'admin'
                if (user.email && user.email.includes('admin')) {
                    setUserRole('admin');
                } else {
                    setUserRole('homeowner');
                }
            } else {
                setUserRole(null);
            }

            setLoading(false);
        });

        // Clean up the listener when the component unmounts
        return unsubscribe;
    }, []);

    // Value to be provided to consuming components
    const value = {
        currentUser,
        isAuthenticated: !!currentUser,
        loading,
        userRole,
        isAdmin: userRole === 'admin',
        isHomeowner: userRole === 'homeowner'
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

// Create a custom hook to use the auth context
export function useAuth() {
    return useContext(AuthContext);
}
