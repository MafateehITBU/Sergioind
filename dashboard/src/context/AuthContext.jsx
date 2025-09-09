import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookie from 'js-cookie';
import axiosInstance from '../axiosConfig';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    name: null,
    email: null,
    phoneNumber: null,
    image: null,
    role: null,
    isActive: null,
    permissions: [],
  });
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [userInteracted, setUserInteracted] = useState(false);

  // Detect user interaction once
  useEffect(() => {
    const handleInteraction = () => {
      setUserInteracted(true);
      window.removeEventListener('click', handleInteraction);
    };
    window.addEventListener('click', handleInteraction);
    return () => window.removeEventListener('click', handleInteraction);
  }, []);

  const fetchUserData = async (userId, role) => {
    try {
      const token = Cookie.get('token');
      if (!token || !role) return;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const endpoint = role === 'superadmin' ? `/superadmin/${userId}` : `/admin/me`;
      const response = await axiosInstance.get(endpoint, config);

      const userData = response.data.data;

      if (!userData.isActive) {
        // If user is not active, logout and redirect or show message
        logout();
        toast.error('Your account is deactivated. Please contact support.');
        return;
      }

      setUser({
        id: userData._id || userId,
        name: userData.name || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        image: userData.image?.url || '',
        role: userData.role || role,
        isActive: userData.isActive,
        permissions: userData.permissions || [],
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
    }
  };

  useEffect(() => {
    // Load saved notifications from localStorage
    const savedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
    setNotifications(savedNotifications);

    const initializeUser = async () => {
      const token = Cookie.get('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const { id, role } = decoded;

        await fetchUserData(id, role);

      } catch (error) {
        console.error('Error initializing user:', error);
        Cookie.remove('token');
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [userInteracted]);

  const login = async (email, password) => {
    try {
      // Try superadmin login first
      let response;
      try {
        response = await axiosInstance.post('/superadmin/login', { email, password });
      } catch (err) {
        // If superadmin login fails, fallback to admin login
        response = await axiosInstance.post('/admin/login', { email, password });
      }
      const token = response.data.token;

      if (!token || typeof token !== 'string') {
        throw new Error('Invalid token received');
      }

      Cookie.set('token', token, { expires: 1 });

      const decoded = jwtDecode(token);
      const { id, role } = decoded;

      await fetchUserData(id, role);

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    Cookie.remove('token');
    setUser({
      id: null,
      name: null,
      email: null,
      phoneNumber: null,
      image: null,
      role: null,
      isActive: null,
      permissions: [],
    });
  };

  const removeNotification = (notifID) => {
    // Remove the notification with the given notifID
    const updatedNotifications = notifications.filter((notif) => notif.notifID !== notifID);
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications)); // Update localStorage
  };

  const value = {
    user,
    loading,
    notifications,
    login,
    logout,
    removeNotification,
    isAuthenticated: !!user?.id,
    updateUser: (newUserData) => {
      setUser((prev) => ({
        ...prev,
        ...newUserData,
      }));
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
