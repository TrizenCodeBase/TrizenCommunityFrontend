import { apiService, ApiResponse } from './api';
import { User } from './auth';

// User service interfaces
export interface UpdateProfileData {
    name?: string;
    bio?: string;
    location?: string;
    website?: string;
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
}

export interface UpdatePreferencesData {
    emailNotifications?: boolean;
    eventNotifications?: boolean;
    newsletter?: boolean;
    privacy?: {
        profileVisibility?: 'public' | 'community' | 'private';
        showEmail?: boolean;
        showLocation?: boolean;
    };
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}

export interface UserFilters {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
}

export interface UserSearchFilters {
    q: string;
    page?: number;
    limit?: number;
}

// Users service class
class UsersService {
    // Get all users (admin only)
    async getUsers(filters: UserFilters = {}): Promise<{
        users: User[];
        pagination: ApiResponse['pagination'];
    }> {
        const response = await apiService.get<{ users: User[] }>('/users', filters);
        return {
            users: response.data!.users,
            pagination: response.pagination!,
        };
    }

    // Get user profile
    async getUser(id: string): Promise<User> {
        const response = await apiService.get<{ user: User }>(`/users/${id}`);
        return response.data!.user;
    }

    // Update user profile
    async updateProfile(id: string, data: UpdateProfileData): Promise<User> {
        const response = await apiService.put<{ user: User }>(`/users/${id}`, data);
        return response.data!.user;
    }

    // Update user preferences
    async updatePreferences(id: string, data: UpdatePreferencesData): Promise<{
        preferences: User['preferences'];
    }> {
        const response = await apiService.put<{ preferences: User['preferences'] }>(
            `/users/${id}/preferences`,
            data
        );
        return response.data!;
    }

    // Change password
    async changePassword(id: string, data: ChangePasswordData): Promise<void> {
        await apiService.put(`/users/${id}/password`, data);
    }

    // Deactivate user account
    async deactivateAccount(id: string): Promise<void> {
        await apiService.put(`/users/${id}/deactivate`);
    }

    // Get user's events
    async getUserEvents(id: string): Promise<Array<{
        _id: string;
        title: string;
        description: string;
        startDate: string;
        endDate: string;
        category: string;
        type: string;
        status: string;
        organizer: {
            _id: string;
            name: string;
            avatar?: string;
        };
    }>> {
        const response = await apiService.get<{ events: any[] }>(`/users/${id}/events`);
        return response.data!.events;
    }

    // Get user's event registrations
    async getUserRegistrations(
        id: string,
        status?: string
    ): Promise<Array<{
        _id: string;
        event: {
            _id: string;
            title: string;
            startDate: string;
            endDate: string;
            coverImage?: string;
            organizer: {
                name: string;
                avatar?: string;
            };
        };
        status: string;
        registeredAt: string;
    }>> {
        const params = status ? { status } : {};
        const response = await apiService.get<{ registrations: any[] }>(
            `/users/${id}/registrations`,
            params
        );
        return response.data!.registrations;
    }

    // Search users
    async searchUsers(filters: UserSearchFilters): Promise<{
        users: User[];
        pagination: ApiResponse['pagination'];
    }> {
        const response = await apiService.get<{ users: User[] }>('/users/search', filters);
        return {
            users: response.data!.users,
            pagination: response.pagination!,
        };
    }

    // Upload avatar
    async uploadAvatar(file: File): Promise<{
        url: string;
        publicId: string;
        secureUrl: string;
    }> {
        const response = await apiService.uploadFile<{
            url: string;
            publicId: string;
            secureUrl: string;
        }>('/upload/avatar', file, 'avatar');
        return response.data!;
    }

    // Follow user
    async followUser(userId: string): Promise<void> {
        await apiService.post(`/users/${userId}/follow`);
    }

    // Unfollow user
    async unfollowUser(userId: string): Promise<void> {
        await apiService.delete(`/users/${userId}/follow`);
    }

    // Get user followers
    async getUserFollowers(userId: string): Promise<User[]> {
        const response = await apiService.get<{ followers: User[] }>(`/users/${userId}/followers`);
        return response.data!.followers;
    }

    // Get user following
    async getUserFollowing(userId: string): Promise<User[]> {
        const response = await apiService.get<{ following: User[] }>(`/users/${userId}/following`);
        return response.data!.following;
    }

    // Get user activity
    async getUserActivity(userId: string): Promise<Array<{
        type: 'event_created' | 'event_attended' | 'post_created' | 'comment_made';
        description: string;
        timestamp: string;
        metadata?: any;
    }>> {
        const response = await apiService.get<{ activity: any[] }>(`/users/${userId}/activity`);
        return response.data!.activity;
    }

    // Get user stats
    async getUserStats(userId: string): Promise<{
        eventsAttended: number;
        eventsOrganized: number;
        postsCreated: number;
        commentsMade: number;
        followersCount: number;
        followingCount: number;
        profileViews: number;
    }> {
        const response = await apiService.get<{ stats: any }>(`/users/${userId}/stats`);
        return response.data!.stats;
    }
}

// Create and export users service instance
export const usersService = new UsersService();

// Export the class for testing
export { UsersService };

