import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, User } from '@/services/api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
        role?: string;
        interests?: string[];
    }) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<User>) => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is authenticated on app load
    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (apiService.isAuthenticated()) {
                    const storedUser = apiService.getStoredUser();
                    if (storedUser) {
                        setUser(storedUser);
                        // Optionally verify token with server (with timeout)
                        try {
                            const timeoutPromise = new Promise((_, reject) =>
                                setTimeout(() => reject(new Error('Request timeout')), 5000)
                            );
                            const currentUser = await Promise.race([
                                apiService.getCurrentUser(),
                                timeoutPromise
                            ]);
                            setUser(currentUser as any);
                        } catch (error) {
                            console.warn('Token verification failed, using stored user:', error);
                            // Keep stored user if server verification fails
                            // Don't clear storage immediately to prevent blank page
                        }
                    }
                }
            } catch (error) {
                console.error('Auth check error:', error);
                // Don't clear storage on general errors to prevent blank page
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        // Add a timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
            setIsLoading(false);
        }, 10000); // 10 second timeout

        checkAuth();

        return () => clearTimeout(timeoutId);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const { user: userData } = await apiService.login({ email, password });
            setUser(userData);
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
        role?: string;
        interests?: string[];
    }) => {
        try {
            setIsLoading(true);
            const { user: userData } = await apiService.register(data);
            setUser(userData);
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await apiService.logout();
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
            // Clear local state even if API call fails
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    const refreshUser = async () => {
        try {
            if (apiService.isAuthenticated()) {
                const currentUser = await apiService.getCurrentUser();
                setUser(currentUser);
            }
        } catch (error) {
            console.error('Refresh user error:', error);
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
    };

    // Show loading screen while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};