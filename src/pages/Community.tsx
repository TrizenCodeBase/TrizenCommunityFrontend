import { useState } from "react";
import {
    Users,
    MessageSquare,
    TrendingUp,
    Award,
    Calendar,
    MapPin,
    Clock,
    Star,
    Heart,
    Share2,
    Search,
    Plus,
    ArrowLeft,
    Globe,
    Zap,
    Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Community = () => {
    const [searchQuery, setSearchQuery] = useState("");

    // Mock discussions
    const discussions = [
        {
            id: 1,
            title: "AI and Machine Learning Trends 2025",
            author: {
                name: "Dr. Sarah Chen",
                avatar: "/api/placeholder/40/40",
                role: "AI Researcher",
                verified: true
            },
            content: "Exploring the latest developments in AI and ML, including new frameworks and breakthrough research...",
            category: "Research",
            tags: ["AI", "Machine Learning", "Research"],
            likes: 42,
            comments: 18,
            views: 234,
            timeAgo: "2 hours ago",
            isPinned: true,
            isTrending: true
        },
        {
            id: 2,
            title: "Best Practices for Remote Team Collaboration",
            author: {
                name: "Alex Rodriguez",
                avatar: "/api/placeholder/40/40",
                role: "Product Manager",
                verified: true
            },
            content: "Sharing insights on how to maintain productivity and team cohesion in remote work environments...",
            category: "Product",
            tags: ["Remote Work", "Collaboration", "Productivity"],
            likes: 28,
            comments: 12,
            views: 156,
            timeAgo: "4 hours ago",
            isPinned: false,
            isTrending: false
        }
    ];

    // Mock members
    const topMembers = [
        {
            id: 1,
            name: "Dr. Sarah Chen",
            avatar: "/api/placeholder/60/60",
            role: "AI Researcher",
            company: "Tech Innovations Inc.",
            contributions: 156,
            badges: ["Top Contributor", "Research Pioneer", "Mentor"],
            isOnline: true
        },
        {
            id: 2,
            name: "Alex Rodriguez",
            avatar: "/api/placeholder/60/60",
            role: "Product Manager",
            company: "Innovation Labs",
            contributions: 134,
            badges: ["Community Builder", "Event Organizer"],
            isOnline: false
        }
    ];

    // Mock events
    const upcomingEvents = [
        {
            id: 1,
            title: "Community Meetup: AI Discussion",
            date: "March 30, 2025",
            time: "6:00 PM - 8:00 PM",
            location: "Virtual",
            attendees: 45,
            maxAttendees: 100,
            type: "Meetup"
        }
    ];

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
                        Our <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">Community</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        Connect with innovators, share knowledge, and collaborate with like-minded professionals in technology and research.
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Discussions */}
                    <div className="lg:col-span-2">
                        <Card className="rounded-2xl border-2 border-gray-200/50 shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <CardTitle className="flex items-center text-xl">
                                        <MessageSquare className="w-6 h-6 mr-2 text-blue-600" />
                                        Community Discussions
                                    </CardTitle>
                                    <div className="flex gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                placeholder="Search discussions..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10 w-64 border-gray-300 focus:border-primary"
                                            />
                                        </div>
                                        <Button
                                            onClick={() => alert('Start New Discussion (Demo)')}
                                            className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            New Post
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {discussions.map((discussion) => (
                                    <div key={discussion.id} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <Avatar className="w-10 h-10">
                                                    <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                                                    <AvatarFallback className="bg-primary text-white text-sm">
                                                        {discussion.author.name.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <h4 className="font-semibold text-gray-900">{discussion.author.name}</h4>
                                                        {discussion.author.verified && (
                                                            <Badge className="bg-blue-100 text-blue-800 text-xs">Verified</Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600">{discussion.author.role}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {discussion.isPinned && (
                                                    <Badge className="bg-yellow-100 text-yellow-800">Pinned</Badge>
                                                )}
                                                {discussion.isTrending && (
                                                    <Badge className="bg-orange-100 text-orange-800">Trending</Badge>
                                                )}
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-primary cursor-pointer">
                                            {discussion.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{discussion.content}</p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <Badge variant="outline" className="border-primary text-primary">
                                                {discussion.category}
                                            </Badge>
                                            {discussion.tags.map((tag) => (
                                                <Badge key={tag} variant="outline" className="border-gray-300 text-gray-600">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                                                <div className="flex items-center space-x-1">
                                                    <Heart className="w-4 h-4" />
                                                    <span>{discussion.likes}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <MessageSquare className="w-4 h-4" />
                                                    <span>{discussion.comments}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Share2 className="w-4 h-4" />
                                                    <span>{discussion.views}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary">
                                                    <Share2 className="w-4 h-4" />
                                                </Button>
                                                <span className="text-sm text-gray-500">{discussion.timeAgo}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Members & Events */}
                    <div className="space-y-6">
                        {/* Top Members */}
                        <Card className="rounded-2xl border-2 border-gray-200/50 shadow-lg">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center text-lg">
                                    <Award className="w-5 h-5 mr-2 text-primary" />
                                    Top Contributors
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {topMembers.map((member) => (
                                    <div key={member.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="relative">
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage src={member.avatar} alt={member.name} />
                                                <AvatarFallback className="bg-primary text-white">
                                                    {member.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            {member.isOnline && (
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-900 truncate">{member.name}</h4>
                                            <p className="text-sm text-gray-600 truncate">{member.role}</p>
                                            <p className="text-xs text-gray-500 truncate">{member.company}</p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {member.badges.slice(0, 2).map((badge) => (
                                                    <Badge key={badge} className="text-xs bg-primary/10 text-primary">
                                                        {badge}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-semibold text-primary">{member.contributions}</div>
                                            <div className="text-xs text-gray-500">posts</div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Upcoming Events */}
                        <Card className="rounded-2xl border-2 border-gray-200/50 shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center text-lg">
                                        <Calendar className="w-5 h-5 mr-2 text-primary" />
                                        Upcoming Events
                                    </CardTitle>
                                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark">
                                        View all
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {upcomingEvents.map((event) => (
                                    <div key={event.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                {event.date} • {event.time}
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                {event.location}
                                            </div>
                                            <div className="flex items-center">
                                                <Users className="w-4 h-4 mr-2" />
                                                {event.attendees}/{event.maxAttendees} attendees
                                            </div>
                                        </div>
                                        <Badge className="mt-2 bg-primary/10 text-primary">
                                            {event.type}
                                        </Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="rounded-2xl border-2 border-gray-200/50 shadow-lg">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center text-lg">
                                    <Zap className="w-5 h-5 mr-2 text-primary" />
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    className="w-full justify-start bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white"
                                    onClick={() => alert('Start Discussion (Demo)')}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Start Discussion
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start border-gray-300 hover:border-primary hover:text-primary"
                                    onClick={() => alert('Join Event (Demo)')}
                                >
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Join Event
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start border-gray-300 hover:border-primary hover:text-primary"
                                    onClick={() => alert('Find Members (Demo)')}
                                >
                                    <Users className="w-4 h-4 mr-2" />
                                    Find Members
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Community;