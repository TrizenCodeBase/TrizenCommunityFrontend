import { apiService, ApiResponse } from './api';

// Event interfaces
export interface Event {
    _id: string;
    title: string;
    description: string;
    shortDescription?: string;
    category: 'Workshop' | 'Conference' | 'Meetup' | 'Webinar' | 'Training' | 'Hackathon' | 'Networking' | 'Other';
    type: 'Online' | 'In-Person' | 'Hybrid';
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
    startDate: string;
    endDate: string;
    timezone: string;
    duration: number;
    location: {
        venue?: string;
        address?: string;
        city?: string;
        state?: string;
        country?: string;
        coordinates?: {
            latitude: number;
            longitude: number;
        };
        onlineLink?: string;
        meetingId?: string;
        meetingPassword?: string;
    };
    organizer: {
        _id: string;
        name: string;
        avatar?: string;
        bio?: string;
    };
    coOrganizers?: Array<{
        _id: string;
        name: string;
        avatar?: string;
    }>;
    speakers?: Array<{
        name: string;
        title: string;
        company: string;
        bio: string;
        avatar: string;
        socialLinks: {
            linkedin?: string;
            twitter?: string;
            website?: string;
        };
    }>;
    price: number;
    currency: string;
    maxAttendees: number;
    currentAttendees: number;
    status: 'Draft' | 'Published' | 'Cancelled' | 'Completed' | 'Postponed';
    isFeatured: boolean;
    isPublic: boolean;
    registrationOpen: boolean;
    registrationDeadline?: string;
    requiresApproval: boolean;
    registrationFields?: Array<{
        name: string;
        type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio';
        required: boolean;
        options?: string[];
        placeholder?: string;
    }>;
    coverImage?: string;
    images?: string[];
    videos?: Array<{
        title: string;
        url: string;
        thumbnail: string;
    }>;
    documents?: Array<{
        title: string;
        url: string;
        type: string;
    }>;
    agenda?: Array<{
        time: string;
        title: string;
        description: string;
        speaker: string;
        duration: number;
    }>;
    tags: string[];
    topics: string[];
    prerequisites: string[];
    requirements: string[];
    whatYouWillLearn: string[];
    targetAudience: string[];
    likes: string[];
    bookmarks: string[];
    shares: number;
    views: number;
    reviews: Array<{
        user: {
            _id: string;
            name: string;
            avatar?: string;
        };
        rating: number;
        comment: string;
        createdAt: string;
    }>;
    averageRating: number;
    totalReviews: number;
    analytics: {
        registrations: Array<{
            date: string;
            count: number;
        }>;
        attendance: {
            registered: number;
            attended: number;
            noShow: number;
        };
        engagement: {
            pageViews: number;
            uniqueVisitors: number;
            timeOnPage: number;
        };
    };
    createdAt: string;
    updatedAt: string;
}

export interface EventRegistration {
    _id: string;
    event: string | Event;
    user: string;
    registrationData: Record<string, any>;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'attended' | 'no_show';
    payment: {
        amount: number;
        currency: string;
        status: 'pending' | 'completed' | 'failed' | 'refunded';
        transactionId?: string;
        paymentMethod?: string;
        paidAt?: string;
    };
    attendance: {
        checkedIn: boolean;
        checkedInAt?: string;
        checkedOut: boolean;
        checkedOutAt?: string;
        attendanceDuration?: number;
    };
    feedback: {
        rating?: number;
        comment?: string;
        submittedAt?: string;
    };
    notifications: {
        confirmationSent: boolean;
        reminderSent: boolean;
        followUpSent: boolean;
    };
    notes?: string;
    specialRequirements?: string;
    dietaryRestrictions?: string;
    registeredAt: string;
    approvedAt?: string;
    cancelledAt?: string;
}

export interface CreateEventData {
    title: string;
    description: string;
    category: Event['category'];
    type: Event['type'];
    difficulty?: Event['difficulty'];
    startDate: string;
    endDate: string;
    timezone?: string;
    duration: number;
    location: Event['location'];
    maxAttendees: number;
    price?: number;
    currency?: string;
    registrationOpen?: boolean;
    registrationDeadline?: string;
    requiresApproval?: boolean;
    registrationFields?: Event['registrationFields'];
    coverImage?: string;
    tags?: string[];
    topics?: string[];
    prerequisites?: string[];
    requirements?: string[];
    whatYouWillLearn?: string[];
    targetAudience?: string[];
}

export interface EventFilters {
    page?: number;
    limit?: number;
    category?: string;
    type?: string;
    status?: string;
    search?: string;
    upcoming?: boolean;
    past?: boolean;
    sort?: 'date' | '-date' | 'title' | '-title' | 'createdAt' | '-createdAt';
}

// Events service class
class EventsService {
    // Get all events
    async getEvents(filters: EventFilters = {}): Promise<{
        events: Event[];
        pagination: ApiResponse['pagination'];
    }> {
        const response = await apiService.get<{ events: Event[] }>('/events', filters);
        return {
            events: response.data!.events,
            pagination: response.pagination!,
        };
    }

    // Get single event
    async getEvent(id: string): Promise<{
        event: Event;
        userRegistration?: EventRegistration;
    }> {
        const response = await apiService.get<{
            event: Event;
            userRegistration?: EventRegistration;
        }>(`/events/${id}`);
        return response.data!;
    }

    // Get featured events
    async getFeaturedEvents(): Promise<Event[]> {
        const response = await apiService.get<{ events: Event[] }>('/events/featured');
        return response.data!.events;
    }

    // Create event
    async createEvent(data: CreateEventData): Promise<Event> {
        const response = await apiService.post<{ event: Event }>('/events', data);
        return response.data!.event;
    }

    // Update event
    async updateEvent(id: string, data: Partial<CreateEventData>): Promise<Event> {
        const response = await apiService.put<{ event: Event }>(`/events/${id}`, data);
        return response.data!.event;
    }

    // Delete event
    async deleteEvent(id: string): Promise<void> {
        await apiService.delete(`/events/${id}`);
    }

    // Register for event
    async registerForEvent(
        eventId: string,
        registrationData?: Record<string, any>
    ): Promise<EventRegistration> {
        const response = await apiService.post<{ registration: EventRegistration }>(
            `/events/${eventId}/register`,
            { registrationData }
        );
        return response.data!.registration;
    }

    // Cancel event registration
    async cancelRegistration(eventId: string): Promise<void> {
        await apiService.delete(`/events/${eventId}/register`);
    }

    // Get event registrations (for organizers/admins)
    async getEventRegistrations(
        eventId: string,
        status?: string
    ): Promise<EventRegistration[]> {
        const params = status ? { status } : {};
        const response = await apiService.get<{ registrations: EventRegistration[] }>(
            `/events/${eventId}/registrations`,
            params
        );
        return response.data!.registrations;
    }

    // Like event
    async likeEvent(eventId: string): Promise<void> {
        await apiService.post(`/events/${eventId}/like`);
    }

    // Unlike event
    async unlikeEvent(eventId: string): Promise<void> {
        await apiService.delete(`/events/${eventId}/like`);
    }

    // Bookmark event
    async bookmarkEvent(eventId: string): Promise<void> {
        await apiService.post(`/events/${eventId}/bookmark`);
    }

    // Remove bookmark
    async removeBookmark(eventId: string): Promise<void> {
        await apiService.delete(`/events/${eventId}/bookmark`);
    }

    // Submit event review
    async submitReview(
        eventId: string,
        rating: number,
        comment: string
    ): Promise<void> {
        await apiService.post(`/events/${eventId}/review`, { rating, comment });
    }

    // Get event categories
    async getCategories(): Promise<Array<{ name: string; count: number; slug: string }>> {
        const response = await apiService.get<{ categories: Array<{ name: string; count: number; slug: string }> }>('/events/categories');
        return response.data!.categories;
    }
}

// Create and export events service instance
export const eventsService = new EventsService();

// Export the class for testing
export { EventsService };

