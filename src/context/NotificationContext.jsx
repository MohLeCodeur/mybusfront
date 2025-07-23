// src/context/NotificationContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import AuthContext from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [socket, setSocket] = useState(null);
    const { user } = useContext(AuthContext);

    // ==========================================================
    // === DÉBUT DE LA CORRECTION : AJOUT D'UN DÉCLENCHEUR
    // ==========================================================
    const [refetchTrigger, setRefetchTrigger] = useState(0);
    // ==========================================================
    // === FIN DE LA CORRECTION
    // ==========================================================

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'https://mybusback-js0t.onrender.com');
        setSocket(newSocket);
        return () => newSocket.disconnect();
    }, []);

    useEffect(() => {
        if (socket && user) {
            socket.emit('addNewUser', user._id);
        }
    }, [socket, user]);

    useEffect(() => {
        if (socket) {
            socket.on('getNotification', (data) => {
                setNotifications(prev => [data, ...prev]);
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification(data.title, { body: data.message });
                }
            });

            // ==========================================================
            // === DÉBUT DE LA CORRECTION : ÉCOUTE DE L'ÉVÉNEMENT DE MISE À JOUR
            // ==========================================================
            socket.on('tripStateChanged', (data) => {
                console.log('Received tripStateChanged for trajet:', data.trajetId);
                // On incrémente le déclencheur pour forcer les composants à se rafraîchir
                setRefetchTrigger(prev => prev + 1);
            });
            // ==========================================================
            // === FIN DE LA CORRECTION
            // ==========================================================
        }
    }, [socket]);

    const markAsRead = () => {
        // Logique future
    };

    return (
        // On expose le déclencheur dans la valeur du contexte
        <NotificationContext.Provider value={{ notifications, markAsRead, refetchTrigger }}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContext;