import { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, Plus, Search, Filter, ArrowLeft, Eye, Share2, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CreateEventModal from "@/components/CreateEventModal";
import { eventsService, Event } from "@/services/events";

const Events = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedDate, setSelectedDate] = useState("All Dates");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is admin
    const isAdmin = user?.isAdmin || false;

    // Load events from API
    useEffect(() => {
        const loadEvents = async () => {
            try {
                setIsLoading(true);
                const response = await eventsService.getEvents();
                // If no events from API, use fallback events
                if (!response.events || response.events.length === 0) {
                    throw new Error('No events from API');
                }
                setEvents(response.events);
            } catch (error) {
                console.error('Failed to load events:', error);
                // Fallback to mock data if API fails
                const mockEvents = [
                    {
                        _id: "507f1f77bcf86cd799439011",
                        title: "AI & Machine Learning Workshop",
                        description: "Learn the latest in AI and ML technologies",
                        startDate: "2025-03-25T14:00:00Z",
                        endDate: "2025-03-25T17:00:00Z",
                        location: {
                            venue: "Virtual Event",
                            onlineLink: "https://zoom.us/j/123456789"
                        },
                        category: "Workshop",
                        type: "Online",
                        difficulty: "Beginner",
                        timezone: "UTC",
                        duration: 180,
                        organizer: {
                            _id: "1",
                            name: "Tech Academy"
                        },
                        coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
                        currentAttendees: 0,
                        maxAttendees: 100,
                        price: 0,
                        currency: "USD",
                        isFeatured: false,
                        isPublic: true,
                        registrationOpen: true,
                        requiresApproval: false,
                        tags: ["AI", "Machine Learning", "Workshop"],
                        topics: ["Machine Learning", "AI", "Data Science"],
                        prerequisites: ["Basic programming knowledge"],
                        requirements: ["Laptop", "Internet connection"],
                        whatYouWillLearn: ["AI fundamentals", "ML algorithms", "Practical applications"],
                        targetAudience: ["Developers", "Students", "Tech enthusiasts"],
                        speakers: [],
                        likes: [],
                        bookmarks: [],
                        shares: 0,
                        views: 0,
                        reviews: [],
                        averageRating: 0,
                        totalReviews: 0,
                        analytics: { registrations: [], attendance: { registered: 0, attended: 0, noShow: 0 }, engagement: { pageViews: 0, uniqueVisitors: 0, timeOnPage: 0 } },
                        status: "Published",
                        createdAt: "2025-01-01T00:00:00Z",
                        updatedAt: "2025-01-01T00:00:00Z"
                    },
                    {
                        _id: "507f1f77bcf86cd799439012",
                        title: "Research Symposium 2025",
                        description: "Present your research and network with peers",
                        startDate: "2025-04-10T09:00:00Z",
                        endDate: "2025-04-10T18:00:00Z",
                        location: {
                            venue: "Innovation Hub",
                            address: "123 Tech Street",
                            city: "New York",
                            state: "NY",
                            country: "USA"
                        },
                        category: "Conference",
                        type: "In-Person",
                        difficulty: "Advanced",
                        timezone: "UTC",
                        duration: 540,
                        organizer: {
                            _id: "2",
                            name: "Research Institute"
                        },
                        coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
                        currentAttendees: 0,
                        maxAttendees: 200,
                        price: 0,
                        currency: "USD",
                        isFeatured: false,
                        isPublic: true,
                        registrationOpen: true,
                        requiresApproval: false,
                        tags: ["Research", "Conference", "Networking"],
                        topics: ["Research", "Academic", "Innovation"],
                        prerequisites: ["Research background"],
                        requirements: ["Presentation materials"],
                        whatYouWillLearn: ["Research methodologies", "Academic networking", "Publication strategies"],
                        targetAudience: ["Researchers", "Academics", "PhD students"],
                        speakers: [],
                        likes: [],
                        bookmarks: [],
                        shares: 0,
                        views: 0,
                        reviews: [],
                        averageRating: 0,
                        totalReviews: 0,
                        analytics: { registrations: [], attendance: { registered: 0, attended: 0, noShow: 0 }, engagement: { pageViews: 0, uniqueVisitors: 0, timeOnPage: 0 } },
                        status: "Published",
                        createdAt: "2025-01-01T00:00:00Z",
                        updatedAt: "2025-01-01T00:00:00Z"
                    },
                    {
                        _id: "507f1f77bcf86cd799439013",
                        title: "Startup Pitch Competition",
                        description: "Pitch your startup idea to investors",
                        startDate: "2025-04-20T15:00:00Z",
                        endDate: "2025-04-20T20:00:00Z",
                        location: {
                            venue: "Tech Center",
                            address: "456 Startup Ave",
                            city: "San Francisco",
                            state: "CA",
                            country: "USA"
                        },
                        category: "Meetup",
                        type: "In-Person",
                        difficulty: "Intermediate",
                        timezone: "UTC",
                        duration: 300,
                        organizer: {
                            _id: "3",
                            name: "Startup Hub"
                        },
                        coverImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop",
                        currentAttendees: 0,
                        maxAttendees: 50,
                        price: 0,
                        currency: "USD",
                        isFeatured: false,
                        isPublic: true,
                        registrationOpen: true,
                        requiresApproval: false,
                        tags: ["Startup", "Pitch", "Competition"],
                        topics: ["Entrepreneurship", "Pitching", "Investment"],
                        prerequisites: ["Startup idea"],
                        requirements: ["Pitch deck", "Business plan"],
                        whatYouWillLearn: ["Pitch techniques", "Investor relations", "Business development"],
                        targetAudience: ["Entrepreneurs", "Startup founders", "Business students"],
                        speakers: [],
                        likes: [],
                        bookmarks: [],
                        shares: 0,
                        views: 0,
                        reviews: [],
                        averageRating: 0,
                        totalReviews: 0,
                        analytics: { registrations: [], attendance: { registered: 0, attended: 0, noShow: 0 }, engagement: { pageViews: 0, uniqueVisitors: 0, timeOnPage: 0 } },
                        status: "Published",
                        createdAt: "2025-01-01T00:00:00Z",
                        updatedAt: "2025-01-01T00:00:00Z"
                    }] as Event[];
                setEvents(mockEvents);
            } finally {
                setIsLoading(false);
            }
        };

        loadEvents();
    }, []);

    const categories = ["All Categories", "Workshop", "Training", "Webinar", "Meetup", "Conference"];
    const quickFilters = ["Workshop", "Training", "Webinar", "Meetup", "Conference"];

    // Helper functions to format event data
    const formatEventDate = (startDate: string) => {
        return new Date(startDate).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatEventTime = (startDate: string, endDate: string) => {
        const start = new Date(startDate).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        const end = new Date(endDate).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        return `${start} - ${end}`;
    };

    const getEventLocation = (event: Event) => {
        if (event.type === 'Online') {
            return 'Online Event';
        } else if (event.type === 'Hybrid') {
            return event.location.venue ? `${event.location.venue} & Online` : 'Hybrid Event';
        } else {
            if (event.location.venue) {
                return event.location.city ? `${event.location.venue}, ${event.location.city}` : event.location.venue;
            } else if (event.location.city) {
                return event.location.city;
            } else {
                return 'In-Person Event';
            }
        }
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All Categories" || event.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleEventCreated = async () => {
        // Refresh events list after creating a new event
        try {
            setIsLoading(true);
            // Add a small delay to ensure the backend has processed the new event
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await eventsService.getEvents();
            console.log('Refreshed events:', response.events);
            setEvents(response.events);
            toast.success("Events list updated!");
        } catch (error) {
            console.error('Failed to refresh events:', error);
            toast.error("Failed to refresh events list");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditEvent = (event: Event) => {
        if (!isAdmin) {
            toast.error("Only administrators can edit events");
            return;
        }
        // For now, we'll just show a toast. In a real app, you'd open an edit modal
        toast.info("Edit functionality coming soon!");
        console.log("Edit event:", event);
    };

    const handleDeleteEvent = async (event: Event) => {
        if (!isAdmin) {
            toast.error("Only administrators can delete events");
            return;
        }

        if (window.confirm(`Are you sure you want to delete "${event.title}"? This action cannot be undone.`)) {
            try {
                await eventsService.deleteEvent(event._id);
                toast.success("Event deleted successfully!");
                // Refresh events list
                const response = await eventsService.getEvents();
                setEvents(response.events);
            } catch (error: any) {
                console.error('Delete event error:', error);
                toast.error(error.message || "Failed to delete event");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50">
            <Navbar />

            {/* Back to Home Link */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center text-primary hover:text-primary-dark transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </button>
            </div>

            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        Upcoming <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">Events</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        Discover workshops, conferences, meetups, and training sessions designed to accelerate your learning and career growth.
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 mb-6">
                        {/* Search Bar */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12 text-lg border-gray-300 focus:border-primary"
                            />
                        </div>

                        {/* Category Filter */}
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full lg:w-48 h-12 border-gray-300 focus:border-primary">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Date Filter */}
                        <Select value={selectedDate} onValueChange={setSelectedDate}>
                            <SelectTrigger className="w-full lg:w-48 h-12 border-gray-300 focus:border-primary">
                                <SelectValue placeholder="All Dates" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All Dates">All Dates</SelectItem>
                                <SelectItem value="This Week">This Week</SelectItem>
                                <SelectItem value="This Month">This Month</SelectItem>
                                <SelectItem value="Next Month">Next Month</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Create Event Button - Admin Only */}
                        {isAdmin && (
                            <Button
                                onClick={() => {
                                    if (!isAdmin) {
                                        toast.error("Only administrators can create events");
                                        return;
                                    }
                                    setShowCreateModal(true);
                                }}
                                className="h-12 px-6 bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white shadow-lg shadow-primary/25"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Create Event
                            </Button>
                        )}
                    </div>

                    {/* Quick Filters */}
                    <div className="flex flex-wrap gap-3">
                        <span className="text-sm font-medium text-gray-600 mr-2">Quick filters:</span>
                        {quickFilters.map((filter) => (
                            <Button
                                key={filter}
                                variant={selectedCategory === filter ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(filter)}
                                className={`${selectedCategory === filter
                                    ? "bg-primary text-white"
                                    : "border-gray-300 text-gray-600 hover:border-primary hover:text-primary"
                                    }`}
                            >
                                {filter}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Events Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {filteredEvents.map((event) => (
                        <Card key={event._id} className="group overflow-hidden rounded-2xl border-2 border-gray-200/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                            {/* Event Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={event.coverImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop"}
                                    alt={event.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        // Fallback to gradient with icon if image fails
                                        e.currentTarget.style.display = 'none';
                                        const parent = e.currentTarget.parentElement;
                                        if (parent) {
                                            parent.classList.add('bg-gradient-to-br', 'from-primary/10', 'to-accent/10');
                                            const fallbackIcon = document.createElement('div');
                                            fallbackIcon.className = 'absolute inset-0 flex items-center justify-center';
                                            fallbackIcon.innerHTML = '<svg class="w-16 h-16 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                                            parent.appendChild(fallbackIcon);
                                        }
                                    }}
                                />
                                {/* Category Badge Overlay */}
                                <div className="absolute top-3 left-3">
                                    <Badge className="bg-white/90 backdrop-blur-sm text-primary border-0 shadow-md">
                                        {event.category}
                                    </Badge>
                                </div>

                                {/* Admin Actions Menu */}
                                {isAdmin && (
                                    <div className="absolute top-3 right-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white/95 shadow-md"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit Event
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteEvent(event)}
                                                    className="text-red-600 focus:text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete Event
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )}
                            </div>

                            <CardContent className="p-6">
                                {/* Event Title */}
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                                    {event.title}
                                </h3>

                                {/* Event Details */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="w-4 h-4 mr-3 text-primary" />
                                        <span className="text-sm">{formatEventDate(event.startDate)} • {formatEventTime(event.startDate, event.endDate)}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="w-4 h-4 mr-3 text-primary" />
                                        <span className="text-sm">{getEventLocation(event)}</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {event.description}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex space-x-2">
                                    <Button
                                        onClick={() => {
                                            if (!isAuthenticated) {
                                                toast.error("Please login to register for events");
                                                return;
                                            }
                                            navigate(`/events/${event._id}/register`);
                                        }}
                                        className="flex-1 bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white"
                                    >
                                        Register
                                    </Button>
                                    <Button variant="outline" size="icon" className="border-gray-300 hover:border-primary hover:text-primary">
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="border-gray-300 hover:border-primary hover:text-primary">
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Load More Button */}
                <div className="text-center">
                    <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5 hover:border-primary/50 px-8 py-3">
                        Load More Events
                    </Button>
                </div>
            </div>

            {/* Create Event Modal */}
            <CreateEventModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onEventCreated={handleEventCreated}
            />

            <Footer />
        </div>
    );
};

export default Events;

