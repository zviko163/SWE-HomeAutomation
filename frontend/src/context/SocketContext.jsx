// frontend/src/context/SocketContext.jsx
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
        if (isAuthenticated) {
            const socketInstance = io('https://web-production-1479.up.railway.app', {
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionAttempts: 3,
                reconnectionDelay: 1000,
                withCredentials: true,
                cors: {
                    origin: "http://localhost:5173"
                }
            });

            socketInstance.on('connect', () => {
                console.log('Socket connected successfully');
                console.log('Socket ID:', socketInstance.id);
                setIsConnected(true);
            });

            socketInstance.on('disconnect', () => {
                console.log('Socket disconnected');
                setIsConnected(false);
            });

            socketInstance.on('connect_error', (error) => {
                console.error('Detailed Socket Connection Error:', error);
                console.log('Connection URL:', import.meta.env.VITE_API_URL);
                console.log('Socket Path:', socketInstance.io.opts.path);
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
