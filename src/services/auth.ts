import { apiService, ApiResponse } from './api';

// Auth interfaces
export interface User {
    _id: string;
    name: string;
    email: string;
    username?: string;
    avatar?: string;
    bio?: string;
    location?: string;
    company?: string;
    jobTitle?: string;
    experience?: string;
    skills?: string[];
    interests?: string[];
    specialties?: string[];
    socialLinks?: {
        linkedin?: string;
        github?: string;
        twitter?: string;
        portfolio?: string;
    };
    isEmailVerified: boolean;
    isActive: boolean;
    isAdmin: boolean;
    isModerator: boolean;
    preferences: {
        emailNotifications: boolean;
        eventNotifications: boolean;
        newsletter: boolean;
        privacy: {
            profileVisibility: 'public' | 'community' | 'private';
            showEmail: boolean;
            showLocation: boolean;
        };
    };
    stats: {
        eventsAttended: number;
        eventsOrganized: number;
        postsCreated: number;
        commentsMade: number;
    };
    createdAt: string;
    updatedAt: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    username?: string;
}

export interface AuthResponse {
    user: User;
    token?: string; // Optional because registration doesn't return token
    requiresVerification?: boolean;
}

export interface RegisterResponse {
    user: User;
    requiresVerification: boolean;
}

export interface OTPVerificationData {
    email: string;
    otp: string;
}

export interface ResendOTPData {
    email: string;
    type: 'email_verification' | 'password_reset';
}

// Auth service class
class AuthService {
    // Register new user
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await apiService.post<RegisterResponse>('/auth/register', data);
        console.log('🔍 AuthService register - full response:', response);
        console.log('🔍 AuthService register - response.data:', response.data);

        // Don't set token during registration - only after OTP verification
        // Backend returns: { success, message, data: { user, requiresVerification } }
        // Convert to AuthResponse format
        if (!response.data) {
            throw new Error('No data received from registration');
        }

        const authResponse: AuthResponse = {
            user: response.data.user,
            requiresVerification: response.data.requiresVerification,
            token: undefined // No token until OTP verification
        };

        console.log('🔍 AuthService register - returning:', authResponse);

        return authResponse;
    }

    // Login user
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiService.post<AuthResponse>('/auth/login', credentials);
        if (response.data?.token) {
            apiService.setToken(response.data.token);
        }
        return response.data!;
    }

    // Logout user
    async logout(): Promise<void> {
        try {
            await apiService.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            apiService.removeToken();
        }
    }

    // Get current user
    async getCurrentUser(): Promise<User> {
        const response = await apiService.get<{ user: User }>('/auth/me');
        return response.data!.user;
    }

    // Verify email with OTP
    async verifyEmail(data: OTPVerificationData): Promise<AuthResponse> {
        const response = await apiService.post<AuthResponse>('/auth/verify-email', data);
        console.log('🔍 AuthService verifyEmail - full response:', response);
        console.log('🔍 AuthService verifyEmail - response.data:', response.data);

        if (!response.data) {
            throw new Error('No data received from email verification');
        }

        // Set token after successful verification
        if (response.data.token) {
            apiService.setToken(response.data.token);
            console.log('✅ Token set in apiService');
        }

        return response.data;
    }

    // Resend OTP
    async resendOTP(data: ResendOTPData): Promise<void> {
        await apiService.post('/auth/resend-otp', data);
    }

    // Forgot password
    async forgotPassword(email: string): Promise<void> {
        await apiService.post('/auth/forgot-password', { email });
    }

    // Reset password with OTP
    async resetPassword(email: string, otp: string, password: string): Promise<void> {
        await apiService.post('/auth/reset-password', { email, otp, password });
    }

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return !!apiService.getToken();
    }

    // Get stored token
    getToken(): string | null {
        return apiService.getToken();
    }

    // Set token (for OAuth callbacks)
    setToken(token: string): void {
        apiService.setToken(token);
    }

    // OAuth login URLs
    getOAuthUrl(provider: 'google' | 'github' | 'linkedin'): string {
        return `${apiService['baseURL']}/auth/${provider}`;
    }
}

// Create and export auth service instance
export const authService = new AuthService();

// Export the class for testing
export { AuthService };

