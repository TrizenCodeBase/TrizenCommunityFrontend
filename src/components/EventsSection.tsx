import { Calendar, MapPin, Users, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { eventsService, Event } from "@/services/events";

const EventsSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    <section className="py-16 bg-gray-50" id="events">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Upcoming <span className="text-blue-600">Events</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join us for workshops, conferences, and networking events designed to advance your skills and career
          </p>
        </div>

        {/* Events Grid - Circular Images */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse relative">
                  <div className="absolute top-3 left-3 w-16 h-6 bg-gray-300 rounded-full animate-pulse"></div>
                </div>
                <div className="px-6 pb-6 text-center">
                  <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="space-y-3 mb-6">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))
          ) : (
            events.map((event, index) => (
              <div
                key={event._id}
                className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >

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
                        parent.classList.add('bg-gradient-to-br', 'from-blue-500/20', 'to-orange-500/20');
                        const fallbackIcon = document.createElement('div');
                        fallbackIcon.className = 'absolute inset-0 flex items-center justify-center';
                        fallbackIcon.innerHTML = '<svg class="w-16 h-16 text-blue-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                        parent.appendChild(fallbackIcon);
                      }
                    }}
                  />
                  {/* Category Badge Overlay */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md ${event.category === 'Workshop' ? 'bg-blue-500' :
                      event.category === 'Conference' ? 'bg-orange-500' :
                        'bg-blue-600'
                      }`}>
                      {event.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-6 text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 leading-tight hover:text-blue-600 transition-colors duration-200">
                    {event.title}
                  </h3>

                  <div className="space-y-3 mb-6 text-left">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-3 text-blue-600" />
                      <span className="text-sm">{new Date(event.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-3 text-blue-600" />
                      <span className="text-sm">{new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-3 text-blue-600" />
                      <span className="text-sm">
                        {typeof event.location === 'string'
                          ? event.location
                          : event.location?.venue || event.location?.city || 'Location TBD'
                        }
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      if (!isAuthenticated) {
                        toast.error("Please login to register for events");
                        return;
                      }
                      // Scroll to top before navigating
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      // Small delay to allow scroll animation
                      setTimeout(() => {
                        navigate(`/events/${event._id}/register`);
                      }, 300);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200"
                  >
                    Register Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* View All Events */}
        <div className="text-center">
          <Button
            variant="outline"
            size="default"
            onClick={() => {
              navigate('/events');
              setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
            }}
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium px-6 py-2 rounded-lg transition-colors duration-200"
          >
            View All Events
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
