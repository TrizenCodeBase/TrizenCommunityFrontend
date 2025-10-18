const API_BASE_URL = import.meta.env.MODE === 'production'
    ? 'https://your-backend-url.vercel.app/api'
    : 'http://localhost:5000/api';

interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    errors?: any[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    location?: string;
    company?: string;
    jobTitle?: string;
    experience?: string;
    skills?: string[];
    interests?: string[];
    isEmailVerified: boolean;
    isAdmin: boolean;
    isModerator: boolean;
    preferences?: {
        emailNotifications: boolean;
        eventNotifications: boolean;
        newsletter: boolean;
        privacy?: {
            profileVisibility: string;
            showEmail: boolean;
            showLocation: boolean;
        };
    };
    createdAt: string;
    updatedAt: string;
}

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    username?: string;
}

class ApiService {
    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('authToken');
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    }

    // Method to set auth token
    setToken(token: string): void {
        localStorage.setItem('authToken', token);
    }

    // Method to remove auth token
    removeToken(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    }

    private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
        let data;

        try {
            data = await response.json();
        } catch (error) {
            // If response is not JSON (network error, server error, etc.)
            throw new Error(`Network error: ${response.status} ${response.statusText}`);
        }

        if (!response.ok) {
            throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        return data;
    }

    // Authentication methods
    async login(loginData: LoginData): Promise<{ user: User; token: string }> {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(loginData),
        });

        const result = await this.handleResponse<{ user: User; token: string }>(response);

        if (result.success && result.data) {
            // Store token in localStorage
            localStorage.setItem('authToken', result.data.token);
            localStorage.setItem('user', JSON.stringify(result.data.user));
        }

        return result.data!;
    }

    async register(registerData: RegisterData): Promise<{ user: User; token?: string; requiresVerification?: boolean }> {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(registerData),
        });

        const result = await this.handleResponse<{ user: User; token?: string; requiresVerification?: boolean }>(response);

        // Only store token if it exists (after OTP verification)
        if (result.success && result.data && result.data.token) {
            localStorage.setItem('authToken', result.data.token);
            localStorage.setItem('user', JSON.stringify(result.data.user));
        }

        return result.data!;
    }

    async getCurrentUser(): Promise<User> {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });

        const result = await this.handleResponse<{ user: User }>(response);
        return result.data!.user;
    }

    async logout(): Promise<void> {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local storage regardless of API response
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        }
    }

    // OTP verification methods
    async verifyEmail(data: { email: string; otp: string }): Promise<{ user: User; token: string }> {
        const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data),
        });

        const result = await this.handleResponse<{ user: User; token: string }>(response);

        if (result.success && result.data) {
            // Store token after successful verification
            localStorage.setItem('authToken', result.data.token);
            localStorage.setItem('user', JSON.stringify(result.data.user));
        }

        return result.data!;
    }

    async resendOTP(data: { email: string; type: string }): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data),
        });

        await this.handleResponse(response);
    }

    // Generic HTTP methods for other services
    async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
        const url = new URL(`${API_BASE_URL}${endpoint}`);

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, String(value));
                }
            });
        }

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });

        return this.handleResponse<T>(response);
    }

    async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: data ? JSON.stringify(data) : undefined,
        });

        return this.handleResponse<T>(response);
    }

    async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: data ? JSON.stringify(data) : undefined,
        });

        return this.handleResponse<T>(response);
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders(),
        });

        return this.handleResponse<T>(response);
    }

    // User profile methods
    async updateProfile(userId: string, profileData: Partial<User>): Promise<{ user: User }> {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(profileData),
        });

        const result = await this.handleResponse<{ user: User }>(response);

        if (result.success && result.data) {
            // Update stored user data
            localStorage.setItem('user', JSON.stringify(result.data.user));
        }

        return result.data!;
    }

    async updatePreferences(userId: string, preferences: any): Promise<{ preferences: any }> {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/preferences`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(preferences),
        });

        const result = await this.handleResponse<{ preferences: any }>(response);
        return result.data!;
    }

    async changePassword(userId: string, passwordData: { currentPassword: string; newPassword: string }): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/password`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(passwordData),
        });

        await this.handleResponse(response);
    }

    // Utility methods
    isAuthenticated(): boolean {
        return !!localStorage.getItem('authToken');
    }

    getStoredUser(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    getToken(): string | null {
        return localStorage.getItem('authToken');
    }
}

export const apiService = new ApiService();
export type { User, LoginData, RegisterData, ApiResponse };
