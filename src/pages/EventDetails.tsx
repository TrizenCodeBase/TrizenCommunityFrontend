import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Calendar, MapPin, Clock, Users, ArrowLeft, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { eventsService, Event } from "@/services/events";

const EventDetails = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRegistering, setIsRegistering] = useState(false);

    useEffect(() => {
        const loadEvent = async () => {
            if (!eventId) return;

            try {
                setIsLoading(true);
                const response = await eventsService.getEvent(eventId);
                setEvent(response.event);
            } catch (error) {
                console.error('Failed to load event:', error);
                toast.error("Failed to load event details");
                navigate('/events');
            } finally {
                setIsLoading(false);
            }
        };

        loadEvent();
    }, [eventId, navigate]);

    const handleRegister = async () => {
        if (!isAuthenticated) {
            toast.error("Please log in to register for events");
            return;
        }

        if (!event) return;

        try {
            setIsRegistering(true);
            // Navigate to registration page
            navigate(`/events/${eventId}/register`);
        } catch (error) {
            console.error('Registration error:', error);
            toast.error("Failed to start registration process");
        } finally {
            setIsRegistering(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-64 bg-gray-200 rounded mb-6"></div>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                Back to Events
                            </Button>
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
                {/* Back Button */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/events')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Events
                    </Button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Event Header */}
                        <Card className="rounded-2xl border-2 border-gray-200/50 shadow-lg">
                            <div className="h-64 overflow-hidden rounded-t-2xl">
                                <img
                                    src={event.coverImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop"}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                                {event.category}
                                            </Badge>
                                            <Badge variant="outline" className="text-green-600 border-green-200">
                                                {event.type}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="icon" className="border-gray-300 hover:border-primary hover:text-primary">
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                <p className="text-gray-600 text-lg leading-relaxed mb-6">{event.description}</p>

                                {/* Event Details */}
                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="w-5 h-5 mr-3 text-primary" />
                                        <div>
                                            <p className="font-medium">Date & Time</p>
                                            <p className="text-sm">
                                                {new Date(event.startDate).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(event.startDate).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })} - {new Date(event.endDate).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="w-5 h-5 mr-3 text-primary" />
                                        <div>
                                            <p className="font-medium">Location</p>
                                            <p className="text-sm">
                                                {event.type === 'Online'
                                                    ? 'Online Event'
                                                    : typeof event.location === 'string'
                                                        ? event.location
                                                        : event.location?.venue || event.location?.city || 'Location TBD'
                                                }
                                            </p>
                                            {event.type === 'Online' && event.location?.onlineLink && (
                                                <a
                                                    href={event.location.onlineLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                    Join Online
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center text-gray-600">
                                        <Clock className="w-5 h-5 mr-3 text-primary" />
                                        <div>
                                            <p className="font-medium">Duration</p>
                                            <p className="text-sm">{event.duration} minutes</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center text-gray-600">
                                        <Users className="w-5 h-5 mr-3 text-primary" />
                                        <div>
                                            <p className="font-medium">Attendees</p>
                                            <p className="text-sm">{event.currentAttendees} / {event.maxAttendees} registered</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Speakers Section */}
                        {event.speakers && event.speakers.length > 0 && (
                            <Card className="rounded-2xl border-2 border-gray-200/60 shadow-xl">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center text-2xl font-extrabold tracking-tight text-gray-900">
                                        <Users className="w-6 h-6 mr-2 text-primary" />
                                        Featured Speakers ({event.speakers.length})
                                    </CardTitle>
                                    <p className="text-sm text-gray-600 mt-1">Learn from industry experts. Detailed bios are shown in full.</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {event.speakers.map((speaker, index) => {
                                            type SpeakerWithImages = typeof speaker & { image?: string; profilePicture?: string; avatar?: string };
                                            const sp = speaker as SpeakerWithImages;
                                            const speakerImage = sp.image || sp.profilePicture || sp.avatar;
                                            return (
                                                <div key={index} className="flex items-start gap-5 p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
                                                    <Avatar className="w-20 h-20 ring-4 ring-blue-50 shadow">
                                                        <AvatarImage
                                                            src={speakerImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(speaker.name)}&background=3b82f6&color=ffffff&size=80`}
                                                            alt={speaker.name}
                                                            className="object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(speaker.name)}&background=3b82f6&color=ffffff&size=80`;
                                                            }}
                                                        />
                                                        <AvatarFallback className="bg-primary text-white text-lg font-semibold">
                                                            {speaker.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-gray-900 text-xl mb-1">{speaker.name}</h4>
                                                        {(speaker.title || speaker.company) && (
                                                            <div className="text-sm text-gray-700 mb-3">
                                                                {speaker.title && <span className="font-medium text-primary">{speaker.title}</span>}
                                                                {speaker.title && speaker.company && <span className="mx-2 text-gray-400">•</span>}
                                                                {speaker.company && <span>{speaker.company}</span>}
                                                            </div>
                                                        )}
                                                        {speaker.bio && (
                                                            <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line mb-4">{speaker.bio}</p>
                                                        )}
                                                        {speaker.socialLinks && (speaker.socialLinks.linkedin || speaker.socialLinks.twitter || speaker.socialLinks.website) && (
                                                            <div className="flex flex-wrap gap-3">
                                                                {speaker.socialLinks.linkedin && (
                                                                    <a
                                                                        href={speaker.socialLinks.linkedin}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        aria-label={`LinkedIn profile of ${speaker.name}`}
                                                                        className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium inline-flex items-center gap-1"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                                                        LinkedIn
                                                                    </a>
                                                                )}
                                                                {speaker.socialLinks.twitter && (
                                                                    <a
                                                                        href={speaker.socialLinks.twitter}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        aria-label={`Twitter profile of ${speaker.name}`}
                                                                        className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 text-sm font-medium inline-flex items-center gap-1"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                                                                        Twitter
                                                                    </a>
                                                                )}
                                                                {speaker.socialLinks.website && (
                                                                    <a
                                                                        href={speaker.socialLinks.website}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        aria-label={`Website of ${speaker.name}`}
                                                                        className="px-3 py-1.5 rounded-full bg-gray-50 text-gray-700 hover:bg-gray-100 text-sm font-medium inline-flex items-center gap-1"
                                                                    >
                                                                        <ExternalLink className="w-4 h-4" />
                                                                        Website
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Additional Information */}
                        {(event.topics && event.topics.length > 0) || (event.prerequisites && event.prerequisites.length > 0) || (event.whatYouWillLearn && event.whatYouWillLearn.length > 0) ? (
                            <Card className="rounded-2xl border-2 border-gray-200/50 shadow-lg">
                                <CardHeader>
                                    <CardTitle>Additional Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {event.topics && event.topics.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">Topics Covered</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {event.topics.map((topic, index) => (
                                                    <Badge key={index} variant="outline" className="text-gray-700 border-gray-300">
                                                        {topic}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {event.whatYouWillLearn && event.whatYouWillLearn.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">What You'll Learn</h4>
                                            <ul className="space-y-2">
                                                {event.whatYouWillLearn.map((item, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <span className="text-green-500 mr-2">✓</span>
                                                        <span className="text-gray-600">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {event.prerequisites && event.prerequisites.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3">Prerequisites</h4>
                                            <ul className="space-y-2">
                                                {event.prerequisites.map((prereq, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <span className="text-blue-500 mr-2">•</span>
                                                        <span className="text-gray-600">{prereq}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ) : null}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Registration Card */}
                        <Card className="rounded-2xl border-2 border-gray-200/50 shadow-lg sticky top-24">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Registration</span>
                                    <Badge className="bg-green-100 text-green-700 border-green-200">
                                        {event.price === 0 ? 'Free' : `$${event.price}`}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900 mb-2">
                                        {event.price === 0 ? 'Free' : `$${event.price}`}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {event.currentAttendees} of {event.maxAttendees} spots filled
                                    </p>
                                </div>

                                <Button
                                    onClick={handleRegister}
                                    disabled={isRegistering || event.currentAttendees >= event.maxAttendees}
                                    className="w-full bg-primary hover:bg-primary-dark text-white"
                                >
                                    {isRegistering ? 'Processing...' :
                                        event.currentAttendees >= event.maxAttendees ? 'Event Full' :
                                            'Register Now'}
                                </Button>

                                {event.currentAttendees >= event.maxAttendees && (
                                    <p className="text-sm text-red-600 text-center">
                                        This event is at capacity
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Event Stats */}
                        <Card className="rounded-2xl border-2 border-gray-200/50 shadow-lg">
                            <CardHeader>
                                <CardTitle>Event Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Difficulty</span>
                                    <Badge variant="outline">{event.difficulty}</Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Language</span>
                                    <span className="text-gray-900">English</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Format</span>
                                    <span className="text-gray-900">{event.type}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default EventDetails;
