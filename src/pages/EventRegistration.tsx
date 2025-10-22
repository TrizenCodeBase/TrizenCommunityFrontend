import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Calendar, MapPin, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { eventsService } from "@/services/events";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const EventRegistration = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [event, setEvent] = useState<any>(null);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        comments: "",
    });

    // Load event details
    useEffect(() => {
        const loadEvent = async () => {
            if (!eventId) {
                navigate('/events');
                return;
            }

            try {
                setIsLoading(true);
                const response = await eventsService.getEvent(eventId);
                setEvent(response.event);

                // Pre-fill form with user data if authenticated
                if (isAuthenticated && user) {
                    const nameParts = user.name?.split(' ') || ['', ''];
                    setFormData(prev => ({
                        ...prev,
                        firstName: nameParts[0] || '',
                        lastName: nameParts.slice(1).join(' ') || '',
                        email: user.email || '',
                    }));
                }
            } catch (error) {
                console.error('Error loading event:', error);

                // Fallback to demo events for hardcoded IDs
                const demoEvents: { [key: string]: any } = {
                    "1": {
                        _id: "1",
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
                        status: "Published",
                        createdAt: "2025-01-01T00:00:00Z",
                        updatedAt: "2025-01-01T00:00:00Z"
                    },
                    "2": {
                        _id: "2",
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
                        status: "Published",
                        createdAt: "2025-01-01T00:00:00Z",
                        updatedAt: "2025-01-01T00:00:00Z"
                    },
                    "3": {
                        _id: "3",
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
                        status: "Published",
                        createdAt: "2025-01-01T00:00:00Z",
                        updatedAt: "2025-01-01T00:00:00Z"
                    }
                } as { [key: string]: any };

                if (demoEvents[eventId]) {
                    setEvent(demoEvents[eventId]);

                    // Pre-fill form with user data if authenticated
                    if (isAuthenticated && user) {
                        const nameParts = user.name?.split(' ') || ['', ''];
                        setFormData(prev => ({
                            ...prev,
                            firstName: nameParts[0] || '',
                            lastName: nameParts.slice(1).join(' ') || '',
                            email: user.email || '',
                        }));
                    }
                } else {
                    toast.error('Event not found');
                    navigate('/events');
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadEvent();
    }, [eventId, isAuthenticated, user, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!formData.email.includes('@')) {
            toast.error('Please enter a valid email address');
            return;
        }

        setIsSubmitting(true);

        try {
            // Call backend API
            await eventsService.registerForEvent(eventId!, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                comments: formData.comments,
            });

            // Show success message
            toast.success("Registration Successful! 🎉", {
                description: "Check your email for confirmation and event details.",
                duration: 5000,
            });

            // Redirect to events page after successful registration
            navigate('/events');
        } catch (error: any) {
            console.error("Registration error:", error);
            toast.error("Registration Failed", {
                description: error.message || "Please try again later.",
                duration: 4000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/events');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                            <p className="text-gray-600">Loading event details...</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
                    <div className="text-center py-20">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Event Not Found</h1>
                        <p className="text-lg text-gray-600 mb-8">The event you're looking for doesn't exist.</p>
                        <Link to="/events">
                            <Button className="bg-blue-600 hover:bg-blue-700">Back to Events</Button>
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/events" className="inline-flex items-center text-primary hover:text-primary-dark mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Events
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                        Event Registration
                    </h1>
                    <p className="text-lg text-gray-600">
                        Complete your registration for this event
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Event Details Card */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-8">
                            <CardHeader>
                                <CardTitle className="text-xl">{event.title}</CardTitle>
                                <CardDescription className="text-sm text-gray-600">
                                    {event.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>{new Date(event.startDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Clock className="w-4 h-4 mr-2" />
                                    <span>{new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                {event.location && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>
                                            {typeof event.location === 'string'
                                                ? event.location
                                                : event.location?.venue || event.location?.city || 'Location TBD'
                                            }
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center text-sm text-gray-600">
                                    <Users className="w-4 h-4 mr-2" />
                                    <span>{event.currentAttendees || 0} registered</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Registration Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Registration Details</CardTitle>
                                <CardDescription>
                                    Please provide your information to complete the registration
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name Fields */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName" className="text-sm font-medium">
                                                First Name <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="firstName"
                                                name="firstName"
                                                type="text"
                                                placeholder="Enter your first name"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                                className="mt-1"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName" className="text-sm font-medium">
                                                Last Name <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="lastName"
                                                name="lastName"
                                                type="text"
                                                placeholder="Enter your last name"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium">
                                            Email Address <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Enter your email address"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Phone Number Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phoneNumber" className="text-sm font-medium">
                                            Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                                        </Label>
                                        <Input
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Comments Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="comments" className="text-sm font-medium">
                                            Additional Comments <span className="text-gray-400 text-xs">(Optional)</span>
                                        </Label>
                                        <Textarea
                                            id="comments"
                                            name="comments"
                                            placeholder="Any questions or special requirements..."
                                            value={formData.comments}
                                            onChange={handleChange}
                                            rows={4}
                                            className="mt-1 resize-none"
                                        />
                                    </div>

                                    {/* Info Box */}
                                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                        <p className="text-sm text-blue-900">
                                            <strong className="font-semibold">📧 Confirmation Email:</strong> You'll receive a confirmation email with your registration details and event information. Our team will review your submission and send you any additional details.
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                        <Button
                                            type="button"
                                            onClick={handleCancel}
                                            variant="outline"
                                            className="flex-1"
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Submitting Registration...
                                                </>
                                            ) : (
                                                "Submit Registration"
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default EventRegistration;
