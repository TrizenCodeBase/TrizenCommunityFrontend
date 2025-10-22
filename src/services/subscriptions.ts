import { apiService, ApiResponse } from './api';

export interface SubscriptionStatus {
    isSubscribed: boolean;
    preferences: {
        eventUpdates: boolean;
        newsletter: boolean;
        promotional: boolean;
    };
}

export interface SubscriptionPreferences {
    eventUpdates?: boolean;
    newsletter?: boolean;
    promotional?: boolean;
}

class SubscriptionService {
    // Get subscription status
    async getStatus(): Promise<SubscriptionStatus> {
        try {
            console.log('🔍 Getting subscription status...');
            const response = await apiService.get<{ data: SubscriptionStatus }>('/subscriptions/status');
            console.log('📡 Raw API response:', response);
            console.log('📡 Response data:', response.data);

            // The backend returns { success: true, data: { isSubscribed, preferences } }
            const subscriptionData = response.data;
            console.log('📡 Subscription data:', subscriptionData);

            // Ensure preferences exist with defaults
            const result = {
                isSubscribed: subscriptionData.isSubscribed || false,
                preferences: {
                    eventUpdates: subscriptionData.preferences?.eventUpdates ?? true,
                    newsletter: subscriptionData.preferences?.newsletter ?? true,
                    promotional: subscriptionData.preferences?.promotional ?? false
                }
            };

            console.log('📡 Processed subscription data:', result);
            return result;
        } catch (error) {
            console.error('❌ Error in getStatus:', error);
            throw error;
        }
    }

    // Subscribe to email updates
    async subscribe(): Promise<{ success: boolean; message: string; isSubscribed: boolean }> {
        try {
            console.log('🔍 Calling authenticated subscribe endpoint...');
            const response = await apiService.post<{ success: boolean; message: string; isSubscribed: boolean }>('/subscriptions/subscribe');
            console.log('📡 Authenticated subscribe response:', response);
            return response.data!;
        } catch (error) {
            console.error('❌ Authenticated subscribe error:', error);
            return {
                success: false,
                message: `Authentication error: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    // Unsubscribe from email updates
    async unsubscribe(): Promise<{ success: boolean; message: string; isSubscribed: boolean }> {
        const response = await apiService.post<{ success: boolean; message: string; isSubscribed: boolean }>('/subscriptions/unsubscribe');
        return response.data!;
    }

    // Update subscription preferences
    async updatePreferences(preferences: SubscriptionPreferences): Promise<{
        success: boolean;
        message: string;
        data: SubscriptionStatus;
    }> {
        const response = await apiService.put<{
            success: boolean;
            message: string;
            data: SubscriptionStatus;
        }>('/subscriptions/preferences', preferences);
        return response.data!;
    }

    // Helper method to get the correct API base URL
    private getApiBaseUrl(): string {
        // Force localhost for development
        const url = 'http://localhost:5000/api';
        console.log('🔗 API Base URL:', url);
        console.log('🔍 Environment mode:', import.meta.env.MODE);
        console.log('🔍 VITE_API_URL:', import.meta.env.VITE_API_URL);
        return url;
    }

    // Unsubscribe via token (public endpoint)
    async unsubscribeByToken(token: string): Promise<{
        success: boolean;
        message: string;
        user?: {
            name: string;
            email: string;
        };
    }> {
        const response = await fetch(`${this.getApiBaseUrl()}/subscriptions/unsubscribe/${token}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    }

    // Subscribe via token (public endpoint)
    async subscribeByToken(token: string): Promise<{
        success: boolean;
        message: string;
        user?: {
            name: string;
            email: string;
        };
    }> {
        const response = await fetch(`${this.getApiBaseUrl()}/subscriptions/subscribe/${token}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    }

    // Test connection to backend
    async testConnection(): Promise<boolean> {
        try {
            const url = `${this.getApiBaseUrl()}/subscriptions/guest`;
            console.log('🧪 Testing connection to:', url);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: 'test@example.com' }),
            });

            console.log('🧪 Test response status:', response.status);
            return response.ok;
        } catch (error) {
            console.error('🧪 Connection test failed:', error);
            return false;
        }
    }

    // Subscribe guest email (public endpoint)
    async subscribeGuest(email: string): Promise<{
        success: boolean;
        message: string;
        email?: string;
    }> {
        try {
            const url = 'http://localhost:5000/api/subscriptions/guest';
            console.log('🔗 Guest subscription URL:', url);
            console.log('📧 Email being sent:', email);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            console.log('📡 Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('📡 Error response body:', errorText);
                return {
                    success: false,
                    message: `Server error: ${response.status}`
                };
            }

            const result = await response.json();
            console.log('📡 Response data:', result);

            return result;
        } catch (error) {
            console.error('❌ Guest subscription API error:', error);
            return {
                success: false,
                message: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
}

// Create and export subscription service instance
export const subscriptionService = new SubscriptionService();

// Export the class for testing
export { SubscriptionService };
