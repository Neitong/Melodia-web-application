import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('admin_token'));
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = 'http://localhost:4000/api';

    // Check if user is authenticated on app load
    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const userData = data.data.user;
                        
                        // Only allow admin users
                        if (userData.role === 'admin') {
                            setUser(userData);
                        } else {
                            // Clear non-admin user
                            localStorage.removeItem('admin_token');
                            setToken(null);
                            setUser(null);
                        }
                    } else {
                        // Token is invalid, clear it
                        localStorage.removeItem('admin_token');
                        setToken(null);
                        setUser(null);
                    }
                } catch (error) {
                    console.error('Auth check error:', error);
                    localStorage.removeItem('admin_token');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Check if user is admin
                if (data.data.user.role !== 'admin') {
                    return { success: false, message: 'Admin access required' };
                }

                setUser(data.data.user);
                setToken(data.data.token);
                localStorage.setItem('admin_token', data.data.token);
                return { success: true, data: data.data };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Network error' };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('admin_token');
    };

    const getSampleAccounts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/sample-accounts`);
            const data = await response.json();
            // Filter only admin accounts
            const adminAccounts = data.data.sampleAccounts.filter(account => account.role === 'admin');
            return adminAccounts;
        } catch (error) {
            console.error('Get sample accounts error:', error);
            return [];
        }
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        getSampleAccounts,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 