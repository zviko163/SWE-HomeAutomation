import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

// Create Socket context
const SocketContext = createContext();

// Socket provider component
export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        // Only connect to socket if user is authenticated
        if (isAuthenticated) {
            // Create socket connection
            const socketInstance = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            // Set up event listeners
            socketInstance.on('connect', () => {
                console.log('Socket connected');
                setIsConnected(true);
            });

            socketInstance.on('disconnect', () => {
                console.log('Socket disconnected');
                setIsConnected(false);
            });

            socketInstance.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                setIsConnected(false);
            });

            // Save socket instance to state
            setSocket(socketInstance);

            // Clean up on unmount
            return () => {
                socketInstance.disconnect();
            };
        } else {
            // Disconnect socket if user is not authenticated
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
        }
    }, [isAuthenticated]);

    // Function to join a room
    const joinRoom = (room) => {
        if (socket && isConnected) {
            socket.emit('join-room', room);
        }
    };

    return (
        <SocketContext.Provider value={{ socket, isConnected, joinRoom }}>
            {children}
        </SocketContext.Provider>
    );
};

// Custom hook to use the socket context
export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
