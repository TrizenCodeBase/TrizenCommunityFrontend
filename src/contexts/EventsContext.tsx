import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { eventsService, Event, EventFilters } from '../services/events';

// Events context interface
interface EventsContextType {
    events: Event[];
    featuredEvents: Event[];
    isLoading: boolean;
    error: string | null;
    filters: EventFilters;
    pagination: {
        current: number;
        pages: number;
        total: number;
        hasNext: boolean;
        hasPrev: boolean;
    } | null;
    fetchEvents: (newFilters?: EventFilters) => Promise<void>;
    fetchFeaturedEvents: () => Promise<void>;
    setFilters: (filters: EventFilters) => void;
    clearError: () => void;
}

// Create events context
const EventsContext = createContext<EventsContextType | undefined>(undefined);

// Events provider props
interface EventsProviderProps {
    children: ReactNode;
}

// Events provider component
export const EventsProvider: React.FC<EventsProviderProps> = ({ children }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFiltersState] = useState<EventFilters>({
        page: 1,
        limit: 10,
    });
    const [pagination, setPagination] = useState<EventsContextType['pagination']>(null);

    // Fetch events
    const fetchEvents = async (newFilters?: EventFilters) => {
        try {
            setIsLoading(true);
            setError(null);

            const currentFilters = newFilters || filters;
            const response = await eventsService.getEvents(currentFilters);

            setEvents(response.events);
            setPagination(response.pagination);
            setFiltersState(currentFilters);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch events';
            setError(errorMessage);
            console.error('Error loading events:', err);

            // If it's a network error, show a more user-friendly message
            if (err instanceof Error && err.message.includes('Network error')) {
                setError('Unable to connect to the server. Please check your internet connection and try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch featured events
    const fetchFeaturedEvents = async () => {
        try {
            const featured = await eventsService.getFeaturedEvents();
            setFeaturedEvents(featured);
        } catch (err) {
            console.error('Error loading featured events:', err);
            // Don't set error state for featured events as it's not critical
        }
    };

    // Set filters
    const setFilters = (newFilters: EventFilters) => {
        setFiltersState(newFilters);
    };

    // Clear error
    const clearError = () => {
        setError(null);
    };

    // Load featured events on mount
    useEffect(() => {
        fetchFeaturedEvents();
    }, []);

    // Context value
    const value: EventsContextType = {
        events,
        featuredEvents,
        isLoading,
        error,
        filters,
        pagination,
        fetchEvents,
        fetchFeaturedEvents,
        setFilters,
        clearError,
    };

    return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
};

// Custom hook to use events context
export const useEvents = (): EventsContextType => {
    const context = useContext(EventsContext);
    if (context === undefined) {
        throw new Error('useEvents must be used within an EventsProvider');
    }
    return context;
};

// Custom hook for event details
export const useEvent = (eventId: string) => {
    const [event, setEvent] = useState<Event | null>(null);
    const [userRegistration, setUserRegistration] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEvent = async () => {
        if (!eventId) return;

        try {
            setIsLoading(true);
            setError(null);
            const response = await eventsService.getEvent(eventId);
            setEvent(response.event);
            setUserRegistration(response.userRegistration);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch event';
            setError(errorMessage);
            console.error('Fetch event error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvent();
    }, [eventId]);

    const registerForEvent = async (registrationData?: Record<string, any>) => {
        if (!eventId) return;

        try {
            const registration = await eventsService.registerForEvent(eventId, registrationData);
            setUserRegistration(registration);
            return registration;
        } catch (err) {
            console.error('Event registration error:', err);
            throw err;
        }
    };

    const cancelRegistration = async () => {
        if (!eventId) return;

        try {
            await eventsService.cancelRegistration(eventId);
            setUserRegistration(null);
        } catch (err) {
            console.error('Cancel registration error:', err);
            throw err;
        }
    };

    return {
        event,
        userRegistration,
        isLoading,
        error,
        registerForEvent,
        cancelRegistration,
        refetch: fetchEvent,
    };
};

