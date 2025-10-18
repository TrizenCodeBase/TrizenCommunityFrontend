import { useState } from "react";
import {
    Calendar,
    MapPin,
    Trophy,
    TrendingUp,
    Users,
    MessageSquare,
    Award,
    Clock,
    CheckCircle,
    Star,
    Eye,
    Share2,
    Settings,
    Bell,
    Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const { user, isAuthenticated } = useAuth();

    // If not authenticated, redirect or show message
    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
                    <div className="text-center py-20">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Please Login</h1>
                        <p className="text-lg text-gray-600 mb-8">You need to be logged in to view your profile.</p>
                        <Link to="/">
                            <Button className="bg-blue-600 hover:bg-blue-700">Go to Home</Button>
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // Format member since date
    const memberSince = new Date(user.createdAt).getFullYear().toString();

    // Placeholder for recent activities (will be populated from backend)
    const recentActivities: Array<{
        id: number;
        type: string;
        title: string;
        time: string;
        icon: any;
    }> = [];

    // Placeholder for participation history (will be populated from backend)
    const participationHistory: Array<{
        id: number;
        title: string;
        role: string;
        status: string;
        date: string;
        rating: number;
    }> = [];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50">
            <Navbar />

            {/* Dashboard Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                            Your Profile
                        </h1>
                        <p className="text-lg text-gray-600">
                            Manage your profile information and view your activity.
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex space-x-3 mt-4 lg:mt-0">
                        <Link to="/settings">
                            <Button variant="outline" className="border-gray-300 hover:border-primary hover:text-primary">
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Main Dashboard Content */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile & Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* User Profile Card */}
                        <Card className="rounded-2xl border-2 border-gray-200/50 shadow-lg">
                            <CardContent className="p-6">
                                <div className="text-center mb-6">
                                    <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-primary/20">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback className="bg-primary text-white text-xl font-bold">
                                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h3>
                                    <p className="text-sm text-gray-600 mb-1">{user.email}</p>
                                    <p className="text-sm text-gray-500">Member since {memberSince}</p>
                                    {user.isEmailVerified && (
                                        <Badge className="mt-2 bg-green-100 text-green-800 border-green-200">
                                            ✓ Verified
                                        </Badge>
                                    )}
                                </div>

                                {/* Additional Info */}
                                {(user.jobTitle || user.company || user.location) && (
                                    <div className="mb-6 space-y-2 text-sm">
                                        {user.jobTitle && (
                                            <div className="flex items-center text-gray-700">
                                                <Users className="w-4 h-4 mr-2" />
                                                <span>{user.jobTitle}</span>
                                            </div>
                                        )}
                                        {user.company && (
                                            <div className="flex items-center text-gray-700">
                                                <Award className="w-4 h-4 mr-2" />
                                                <span>{user.company}</span>
                                            </div>
                                        )}
                                        {user.location && (
                                            <div className="flex items-center text-gray-700">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                <span>{user.location}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Bio */}
                                {user.bio && (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">About</h4>
                                        <p className="text-sm text-gray-600">{user.bio}</p>
                                    </div>
                                )}

                                {/* Skills */}
                                {user.skills && user.skills.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {user.skills.map((skill, index) => (
                                                <Badge
                                                    key={index}
                                                    className="bg-blue-100 text-blue-700 border-blue-200"
                                                >
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Interests */}
                                {user.interests && user.interests.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Interests</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {user.interests.map((interest, index) => (
                                                <Badge
                                                    key={index}
                                                    className="bg-purple-100 text-purple-700 border-purple-200"
                                                >
                                                    {interest}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card className="rounded-2xl border-2 border-gray-200/50 shadow-lg">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center text-lg">
                                    <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {recentActivities.length > 0 ? (
                                    recentActivities.map((activity) => (
                                        <div key={activity.id} className="flex items-start space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <activity.icon className="w-4 h-4 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                                                <p className="text-xs text-gray-500">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                        <p className="text-gray-600">No recent activity yet</p>
                                        <p className="text-sm text-gray-500 mt-2">Your activities will appear here</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Account Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Account Details */}
                        <Card className="rounded-2xl border-2 border-gray-200/50 shadow-lg">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center text-lg">
                                    <Users className="w-5 h-5 mr-2 text-primary" />
                                    Account Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Full Name</h4>
                                        <p className="text-gray-900">{user.name}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Email Address</h4>
                                        <p className="text-gray-900">{user.email}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Member Since</h4>
                                        <p className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Account Status</h4>
                                        <div className="flex items-center space-x-2">
                                            <Badge className={user.isEmailVerified ? "bg-green-100 text-green-800 border-green-200" : "bg-yellow-100 text-yellow-800 border-yellow-200"}>
                                                {user.isEmailVerified ? "Verified" : "Pending Verification"}
                                            </Badge>
                                            {user.isAdmin && (
                                                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                                                    Admin
                                                </Badge>
                                            )}
                                            {user.isModerator && (
                                                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                                    Moderator
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Professional Information */}
                        {(user.jobTitle || user.company || user.experience || user.location) && (
                            <Card className="rounded-2xl border-2 border-gray-200/50 shadow-lg">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center text-lg">
                                        <Award className="w-5 h-5 mr-2 text-primary" />
                                        Professional Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {user.jobTitle && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Job Title</h4>
                                                <p className="text-gray-900">{user.jobTitle}</p>
                                            </div>
                                        )}
                                        {user.company && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Company</h4>
                                                <p className="text-gray-900">{user.company}</p>
                                            </div>
                                        )}
                                        {user.experience && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Experience</h4>
                                                <p className="text-gray-900">{user.experience}</p>
                                            </div>
                                        )}
                                        {user.location && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Location</h4>
                                                <p className="text-gray-900">{user.location}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Participation History */}
                        <Card className="rounded-2xl border-2 border-gray-200/50 shadow-lg">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center text-lg">
                                    <Trophy className="w-5 h-5 mr-2 text-primary" />
                                    Participation History
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {participationHistory.length > 0 ? (
                                    participationHistory.map((participation) => (
                                        <div key={participation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{participation.title}</h4>
                                                    <p className="text-sm text-gray-600">Role: {participation.role}</p>
                                                    <p className="text-xs text-gray-500">{participation.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                                    {participation.status}
                                                </Badge>
                                                <div className="flex items-center mt-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < participation.rating
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "text-gray-300"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                        <p className="text-gray-600">No participation history yet</p>
                                        <p className="text-sm text-gray-500 mt-2">Your event participation will appear here</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Events Section */}
                        <Card className="rounded-2xl border-2 border-gray-200/50 shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center text-lg">
                                        <Calendar className="w-5 h-5 mr-2 text-primary" />
                                        Events
                                    </CardTitle>
                                    <Link to="/events">
                                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark">
                                            Browse Events
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <p className="text-gray-600 mb-4">Your registered events will appear here</p>
                                    <Link to="/events">
                                        <Button className="bg-blue-600 hover:bg-blue-700">
                                            Explore Events
                                        </Button>
                                    </Link>
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

export default Dashboard;

