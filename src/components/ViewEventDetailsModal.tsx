import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, Clock, Users, DollarSign, Globe, User, Building, Award } from 'lucide-react';
import { Event } from '@/services/events';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ViewEventDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: Event | null;
}

const ViewEventDetailsModal: React.FC<ViewEventDetailsModalProps> = ({
    isOpen,
    onClose,
    event
}) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (!event) return null;

    const formatEventDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatEventTime = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const startTime = start.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        const endTime = end.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        return `${startTime} - ${endTime}`;
    };

    const getEventLocation = (event: Event) => {
        if (typeof event.location === 'string') {
            return event.location;
        }
        return event.location?.venue || event.location?.city || 'Location TBD';
    };

    const getEventPrice = (event: Event) => {
        if (event.price === 0) return 'Free';
        return `$${event.price}`;
    };

    const handleRegister = () => {
        if (!isAuthenticated) {
            toast.error("Please login to register for events");
            return;
        }
        onClose(); // Close the modal first
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
            navigate(`/events/${event._id}/register`);
        }, 300);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                        {event.title}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Event Image */}
                    <div className="relative h-64 overflow-hidden rounded-lg">
                        <img
                            src={event.coverImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop"}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                            <Badge className="bg-white/90 backdrop-blur-sm text-primary border-0 shadow-md">
                                {event.category}
                            </Badge>
                        </div>
                    </div>

                    {/* Event Details Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <Calendar className="w-5 h-5 mr-2 text-primary" />
                                    Event Details
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="w-4 h-4 mr-3 text-primary" />
                                        <span className="text-sm">{formatEventDate(event.startDate)}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Clock className="w-4 h-4 mr-3 text-primary" />
                                        <span className="text-sm">{formatEventTime(event.startDate, event.endDate)}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="w-4 h-4 mr-3 text-primary" />
                                        <span className="text-sm">{getEventLocation(event)}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Users className="w-4 h-4 mr-3 text-primary" />
                                        <span className="text-sm">{event.maxAttendees} attendees</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <DollarSign className="w-4 h-4 mr-3 text-primary" />
                                        <span className="text-sm">{getEventPrice(event)}</span>
                                    </div>
                                    {event.type === 'Online' && (
                                        <div className="flex items-center text-gray-600">
                                            <Globe className="w-4 h-4 mr-3 text-primary" />
                                            <span className="text-sm">Online Event</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Event Description */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Description</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {event.description}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Speakers Section */}
                    {event.speakers && event.speakers.length > 0 && (
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <User className="w-5 h-5 mr-2 text-primary" />
                                    Speakers
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {event.speakers.map((speaker, index) => (
                                        <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage src={speaker.image} alt={speaker.name} />
                                                <AvatarFallback>
                                                    {speaker.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900">{speaker.name}</h4>
                                                <p className="text-sm text-gray-600">{speaker.title}</p>
                                                {speaker.company && (
                                                    <p className="text-sm text-gray-500 flex items-center">
                                                        <Building className="w-3 h-3 mr-1" />
                                                        {speaker.company}
                                                    </p>
                                                )}
                                                {speaker.bio && (
                                                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                                                        {speaker.bio}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Additional Information */}
                    {(event.tags || event.topics || event.learningOutcomes) && (
                        <div className="grid md:grid-cols-3 gap-4">
                            {event.tags && event.tags.length > 0 && (
                                <Card>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold text-sm mb-2">Tags</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {event.tags.map((tag, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {event.topics && event.topics.length > 0 && (
                                <Card>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold text-sm mb-2">Topics</h4>
                                        <ul className="text-xs text-gray-600 space-y-1">
                                            {event.topics.map((topic, index) => (
                                                <li key={index} className="flex items-center">
                                                    <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                                                    {topic}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}

                            {event.learningOutcomes && event.learningOutcomes.length > 0 && (
                                <Card>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold text-sm mb-2 flex items-center">
                                            <Award className="w-4 h-4 mr-1" />
                                            Learning Outcomes
                                        </h4>
                                        <ul className="text-xs text-gray-600 space-y-1">
                                            {event.learningOutcomes.map((outcome, index) => (
                                                <li key={index} className="flex items-center">
                                                    <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                                                    {outcome}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        onClick={handleRegister}
                        className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white"
                    >
                        Register
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewEventDetailsModal;
