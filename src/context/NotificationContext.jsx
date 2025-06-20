// src/context/NotificationContext.jsx (CODE CORRIGÉ)

import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import AuthContext from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [socket, setSocket] = useState(null);
    const { user } = useContext(AuthContext);

    // Initialisation du socket
    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'https://mybusback.onrender.com');
        setSocket(newSocket);
        return () => newSocket.disconnect();
    }, []);

    // Envoi de l'ID utilisateur au serveur
    useEffect(() => {
        if (socket && user) {
            socket.emit('addNewUser', user._id);
        }
    }, [socket, user]);

    // Réception des notifications
    useEffect(() => {
        if (socket) {
            socket.on('getNotification', (data) => {
                setNotifications(prev => [data, ...prev]);
                
                // ==============================================================
                // === DÉBUT DE LA CORRECTION
                // ==============================================================
                // On vérifie que l'API existe ET que la permission a été accordée
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification(data.title, { body: data.message });
                }
                // ==============================================================
                // === FIN DE LA CORRECTION
                // ==============================================================
            });
        }
    }, [socket]);

    const markAsRead = () => {
        // Logique future pour marquer comme lu
    };

    return (
        <NotificationContext.Provider value={{ notifications, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContext;