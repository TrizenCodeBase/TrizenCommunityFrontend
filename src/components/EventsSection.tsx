import { Calendar, MapPin, Users, ArrowRight, Clock, Star, Globe, Zap, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { eventsService, Event } from "@/services/events";

const EventsSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());

  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = [sectionRef.current, headerRef.current, cardsRef.current, ctaRef.current];
    elements.forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Load events from API
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const response = await eventsService.getEvents({ limit: 3 });
        setEvents(response.events || []);
      } catch (error) {
        console.error('Error loading events:', error);
        // Fallback to demo events if API fails
        setEvents([
          {
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
          {
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
          {
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
        ] as Event[]);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="events-section"
      className="py-20 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%, #f8fafc 100%)'
      }}
    >
      {/* Professional Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large gradient orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-orange-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-500/15 to-blue-700/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-to-br from-orange-500/15 to-orange-700/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>

        {/* Additional decorative elements */}
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-300/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-orange-300/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2.5s' }}></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        {/* Professional Section Header with scroll animations */}
        <div
          ref={headerRef}
          id="events-header"
          className={`text-center mb-16 transition-all duration-1000 ${visibleElements.has('events-header')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
            }`}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Upcoming <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent animate-gradient">Events</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join us for workshops, conferences, and networking events designed to advance your skills and career
          </p>
        </div>

        {/* Professional Events Grid with scroll animations */}
        <div
          ref={cardsRef}
          id="events-cards"
          className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-200 ${visibleElements.has('events-cards')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
            }`}
        >
          {isLoading ? (
            // Clean Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute top-4 left-4 w-16 h-5 bg-gray-300 rounded-full"></div>
                  <div className="absolute top-4 right-4 w-12 h-5 bg-gray-300 rounded-full"></div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
                      <div className="w-20 h-10 bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : events.length > 0 ? (
            events.map((event, index) => (
              <Card
                key={event._id}
                className="group bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2"
              >
                {/* Clean Event Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.coverImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.classList.add('bg-gradient-to-br', 'from-gray-100', 'to-gray-200');
                        const fallbackIcon = document.createElement('div');
                        fallbackIcon.className = 'absolute inset-0 flex items-center justify-center';
                        fallbackIcon.innerHTML = '<svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                        parent.appendChild(fallbackIcon);
                      }
                    }}
                  />

                  {/* Clean Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className={`px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg ${event.category === 'Workshop' ? 'bg-blue-600' :
                        event.category === 'Conference' ? 'bg-orange-500' :
                          'bg-gray-600'
                      }`}>
                      {event.category}
                    </Badge>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-green-600 shadow-lg">
                      {event.price === 0 ? 'Free' : `$${event.price}`}
                    </Badge>
                  </div>
                </div>

                {/* Clean Content */}
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Title and Description */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
                        <div>
                          <span className="text-sm font-medium">
                            {new Date(event.startDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="text-xs text-gray-500 block">
                            {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 text-orange-500 mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium truncate">
                          {typeof event.location === 'string'
                            ? event.location
                            : event.location?.venue || event.location?.city || 'Location TBD'
                          }
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium">
                          {event.currentAttendees || 0} / {event.maxAttendees || '∞'} attendees
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => {
                          if (!isAuthenticated) {
                            toast.error("Please login to register for events");
                            return;
                          }
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          setTimeout(() => {
                            navigate(`/events/${event._id}/register`);
                          }, 300);
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200"
                      >
                        Register Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Navigate to event details
                          navigate(`/events/${event._id}`);
                        }}
                        className="border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 px-3"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Events Available</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We're working on bringing you amazing events. Check back soon for updates!
              </p>
              <Button
                onClick={() => navigate('/events')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Browse All Events
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>

        {/* Professional View All Events with scroll animations */}
        <div
          ref={ctaRef}
          id="events-cta"
          className={`text-center transition-all duration-1000 delay-400 ${visibleElements.has('events-cta')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
            }`}
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              navigate('/events');
              setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
            }}
            className="border-2 border-blue-200/50 text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-orange-50 hover:border-blue-300 font-bold px-10 py-4 rounded-2xl transition-all duration-500 shadow-xl hover:shadow-2xl group relative overflow-hidden backdrop-blur-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <span className="relative z-10 flex items-center justify-center">
              View All Events
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-orange-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
