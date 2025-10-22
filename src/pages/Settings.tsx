import { useState, useEffect } from "react";
import { Lock, User, Bell, Shield, Mail, Save, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { apiService } from "@/services/api";
import { subscriptionService, SubscriptionStatus } from "@/services/subscriptions";

const Settings = () => {
    const { user, isAuthenticated, updateUser, refreshUser } = useAuth();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Profile form state
    const [profileData, setProfileData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        bio: user?.bio || "",
        location: user?.location || "",
        company: user?.company || "",
        jobTitle: user?.jobTitle || "",
        skills: user?.skills?.join(", ") || "",
        interests: user?.interests?.join(", ") || "",
    });

    // Password form state
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Notification preferences
    const [notifications, setNotifications] = useState({
        emailNotifications: user?.preferences?.emailNotifications ?? true,
        eventNotifications: user?.preferences?.eventNotifications ?? true,
        newsletter: user?.preferences?.newsletter ?? true,
    });

    // Subscription preferences
    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
    const [subscriptionLoading, setSubscriptionLoading] = useState(false);

    // Load subscription status
    const loadSubscriptionStatus = async () => {
        if (!isAuthenticated) {
            console.log('❌ User not authenticated, skipping subscription status load');
            return;
        }

        try {
            console.log('🔍 Loading subscription status for user:', user?.email);
            console.log('🔍 User ID:', user?._id);
            console.log('🔍 Is authenticated:', isAuthenticated);
            setSubscriptionLoading(true);

            // Test if we can reach the API first
            const testResponse = await fetch('http://localhost:5000/api/subscriptions/guest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'test@example.com' })
            });
            console.log('🧪 Test API response status:', testResponse.status);

            const status = await subscriptionService.getStatus();
            console.log('📡 Subscription status loaded:', status);
            setSubscriptionStatus(status);
        } catch (error) {
            console.error('❌ Failed to load subscription status:', error);
            console.error('Error details:', {
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });

            // Check if it's an authentication error
            if (error instanceof Error && error.message.includes('401')) {
                toast.error('Authentication expired. Please log in again.');
            } else {
                toast.error('Failed to load subscription settings');
            }
        } finally {
            setSubscriptionLoading(false);
        }
    };

    // Update form data when user data changes
    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || "",
                email: user.email || "",
                bio: user.bio || "",
                location: user.location || "",
                company: user.company || "",
                jobTitle: user.jobTitle || "",
                skills: user.skills?.join(", ") || "",
                interests: user.interests?.join(", ") || "",
            });

            setNotifications({
                emailNotifications: user.preferences?.emailNotifications ?? true,
                eventNotifications: user.preferences?.eventNotifications ?? true,
                newsletter: user.preferences?.newsletter ?? true,
            });
        }
    }, [user]);

    // Load subscription status when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            loadSubscriptionStatus();
        }
    }, [isAuthenticated]);

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
                    <div className="text-center py-20">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Please Login</h1>
                        <p className="text-lg text-gray-600 mb-8">You need to be logged in to access settings.</p>
                        <Link to="/">
                            <Button className="bg-blue-600 hover:bg-blue-700">Go to Home</Button>
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            setIsLoading(true);
            const updatedData = {
                ...profileData,
                skills: profileData.skills.split(",").map(s => s.trim()).filter(s => s),
                interests: profileData.interests.split(",").map(s => s.trim()).filter(s => s),
            };

            const response = await apiService.updateProfile(user._id, updatedData);
            updateUser(response.user);
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error(error instanceof Error ? error.message : "Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match!");
            return;
        }

        try {
            setIsLoading(true);
            await apiService.changePassword(user._id, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            toast.success("Password updated successfully!");
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            console.error('Password change error:', error);
            toast.error(error instanceof Error ? error.message : "Failed to update password");
        } finally {
            setIsLoading(false);
        }
    };

    const handleNotificationUpdate = async () => {
        if (!user) return;

        try {
            setIsLoading(true);
            await apiService.updatePreferences(user._id, notifications);
            await refreshUser(); // Refresh user data to get updated preferences
            toast.success("Notification preferences updated!");
        } catch (error) {
            console.error('Notification update error:', error);
            toast.error(error instanceof Error ? error.message : "Failed to update preferences");
        } finally {
            setIsLoading(false);
        }
    };

    // Subscription management functions
    const handleSubscriptionToggle = async () => {
        if (!subscriptionStatus) return;

        try {
            setSubscriptionLoading(true);
            let result;

            if (subscriptionStatus.isSubscribed) {
                result = await subscriptionService.unsubscribe();
            } else {
                result = await subscriptionService.subscribe();
            }

            if (result.success) {
                toast.success(result.message);
                await loadSubscriptionStatus(); // Reload subscription status
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Subscription toggle error:', error);
            toast.error("Failed to update subscription status");
        } finally {
            setSubscriptionLoading(false);
        }
    };

    const handleSubscriptionPreferenceChange = async (preference: keyof SubscriptionStatus['preferences'], value: boolean) => {
        if (!subscriptionStatus) return;

        try {
            setSubscriptionLoading(true);
            const result = await subscriptionService.updatePreferences({
                [preference]: value
            });

            if (result.success) {
                toast.success("Subscription preferences updated!");
                setSubscriptionStatus(result.data);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Subscription preference update error:', error);
            toast.error("Failed to update subscription preferences");
        } finally {
            setSubscriptionLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                        Settings
                    </h1>
                    <p className="text-lg text-gray-600">
                        Manage your account settings and preferences.
                    </p>
                </div>

                <Tabs defaultValue="profile" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 lg:w-auto lg:inline-grid">
                        <TabsTrigger value="profile" className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                        </TabsTrigger>
                        <TabsTrigger value="security" className="flex items-center space-x-2">
                            <Lock className="w-4 h-4" />
                            <span>Security</span>
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="flex items-center space-x-2">
                            <Bell className="w-4 h-4" />
                            <span>Notifications</span>
                        </TabsTrigger>
                        <TabsTrigger value="subscriptions" className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>Emails</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Settings */}
                    <TabsContent value="profile" className="space-y-6">
                        <Card className="rounded-2xl border-2 border-gray-200/50 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <User className="w-5 h-5 mr-2 text-primary" />
                                    Profile Information
                                </CardTitle>
                                <CardDescription>
                                    Update your personal information and profile details.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleProfileUpdate} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                placeholder="your.email@example.com"
                                                disabled
                                            />
                                            <p className="text-xs text-gray-500">Email cannot be changed</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea
                                            id="bio"
                                            value={profileData.bio}
                                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                            placeholder="Tell us about yourself..."
                                            rows={4}
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="jobTitle">Job Title</Label>
                                            <Input
                                                id="jobTitle"
                                                value={profileData.jobTitle}
                                                onChange={(e) => setProfileData({ ...profileData, jobTitle: e.target.value })}
                                                placeholder="Software Engineer"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="company">Company</Label>
                                            <Input
                                                id="company"
                                                value={profileData.company}
                                                onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                                                placeholder="Company Name"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            value={profileData.location}
                                            onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                            placeholder="City, Country"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="skills">Skills</Label>
                                        <Input
                                            id="skills"
                                            value={profileData.skills}
                                            onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                                            placeholder="JavaScript, React, Node.js (comma-separated)"
                                        />
                                        <p className="text-xs text-gray-500">Separate skills with commas</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="interests">Interests</Label>
                                        <Input
                                            id="interests"
                                            value={profileData.interests}
                                            onChange={(e) => setProfileData({ ...profileData, interests: e.target.value })}
                                            placeholder="AI, Web Development, Cloud Computing (comma-separated)"
                                        />
                                        <p className="text-xs text-gray-500">Separate interests with commas</p>
                                    </div>

                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                                        <Save className="w-4 h-4 mr-2" />
                                        {isLoading ? "Saving..." : "Save Changes"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Settings */}
                    <TabsContent value="security" className="space-y-6">
                        <Card className="rounded-2xl border-2 border-gray-200/50 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Lock className="w-5 h-5 mr-2 text-primary" />
                                    Password & Security
                                </CardTitle>
                                <CardDescription>
                                    Manage your password and security settings.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-start space-x-3">
                                        <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-blue-900">Account Status</h4>
                                            <div className="flex items-center space-x-2 mt-2">
                                                <Badge className={user.isEmailVerified ? "bg-green-100 text-green-800 border-green-200" : "bg-yellow-100 text-yellow-800 border-yellow-200"}>
                                                    {user.isEmailVerified ? "Email Verified" : "Pending Verification"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handlePasswordChange} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">Current Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="currentPassword"
                                                type={showCurrentPassword ? "text" : "password"}
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                placeholder="Enter current password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="newPassword"
                                                type={showNewPassword ? "text" : "password"}
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                placeholder="Enter new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            placeholder="Confirm new password"
                                        />
                                    </div>

                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                                        <Lock className="w-4 h-4 mr-2" />
                                        {isLoading ? "Updating..." : "Update Password"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Notification Settings */}
                    <TabsContent value="notifications" className="space-y-6">
                        <Card className="rounded-2xl border-2 border-gray-200/50 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Bell className="w-5 h-5 mr-2 text-primary" />
                                    Notification Preferences
                                </CardTitle>
                                <CardDescription>
                                    Choose what notifications you want to receive.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-start space-x-3">
                                            <Mail className="w-5 h-5 text-gray-600 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium text-gray-900">Email Notifications</h4>
                                                <p className="text-sm text-gray-600">Receive notifications via email</p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={notifications.emailNotifications}
                                            onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-start space-x-3">
                                            <Bell className="w-5 h-5 text-gray-600 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium text-gray-900">Event Notifications</h4>
                                                <p className="text-sm text-gray-600">Get notifications about events and reminders</p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={notifications.eventNotifications}
                                            onCheckedChange={(checked) => setNotifications({ ...notifications, eventNotifications: checked })}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-start space-x-3">
                                            <Shield className="w-5 h-5 text-gray-600 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium text-gray-900">Newsletter</h4>
                                                <p className="text-sm text-gray-600">Receive community newsletter and updates</p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={notifications.newsletter}
                                            onCheckedChange={(checked) => setNotifications({ ...notifications, newsletter: checked })}
                                        />
                                    </div>
                                </div>

                                <Button onClick={handleNotificationUpdate} className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {isLoading ? "Saving..." : "Save Preferences"}
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Email Subscription Settings */}
                    <TabsContent value="subscriptions" className="space-y-6">
                        <Card className="rounded-2xl border-2 border-gray-200/50 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Mail className="w-5 h-5 mr-2 text-primary" />
                                    Email Subscription Settings
                                </CardTitle>
                                <CardDescription>
                                    Manage your email subscription preferences and unsubscribe from promotional emails.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {subscriptionLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-gray-600">Loading subscription settings...</span>
                                        </div>
                                    </div>
                                ) : subscriptionStatus ? (
                                    <>
                                        {/* Main Subscription Toggle */}
                                        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                            <div className="flex items-start space-x-4">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <Mail className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 text-lg">Email Subscription</h4>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {subscriptionStatus.isSubscribed
                                                            ? "You're subscribed to receive promotional emails and updates"
                                                            : "You're unsubscribed from promotional emails"
                                                        }
                                                    </p>
                                                    <Badge
                                                        variant={subscriptionStatus.isSubscribed ? "default" : "secondary"}
                                                        className={`mt-2 ${subscriptionStatus.isSubscribed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                                                    >
                                                        {subscriptionStatus.isSubscribed ? 'Subscribed' : 'Unsubscribed'}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={handleSubscriptionToggle}
                                                disabled={subscriptionLoading}
                                                variant={subscriptionStatus.isSubscribed ? "destructive" : "default"}
                                                className={subscriptionStatus.isSubscribed ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}
                                            >
                                                {subscriptionLoading ? "Updating..." :
                                                    subscriptionStatus.isSubscribed ? "Unsubscribe" : "Subscribe"}
                                            </Button>
                                        </div>

                                        {/* Subscription Preferences */}
                                        {subscriptionStatus.isSubscribed && (
                                            <div className="space-y-4">
                                                <h5 className="font-medium text-gray-900 text-lg">Email Preferences</h5>

                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div className="flex items-start space-x-3">
                                                        <Bell className="w-5 h-5 text-gray-600 mt-0.5" />
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">Event Updates</h4>
                                                            <p className="text-sm text-gray-600">Get notified about new events and updates</p>
                                                        </div>
                                                    </div>
                                                    <Switch
                                                        checked={subscriptionStatus.preferences.eventUpdates}
                                                        onCheckedChange={(checked) => handleSubscriptionPreferenceChange('eventUpdates', checked)}
                                                        disabled={subscriptionLoading}
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div className="flex items-start space-x-3">
                                                        <Mail className="w-5 h-5 text-gray-600 mt-0.5" />
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">Newsletter</h4>
                                                            <p className="text-sm text-gray-600">Receive our community newsletter</p>
                                                        </div>
                                                    </div>
                                                    <Switch
                                                        checked={subscriptionStatus.preferences.newsletter}
                                                        onCheckedChange={(checked) => handleSubscriptionPreferenceChange('newsletter', checked)}
                                                        disabled={subscriptionLoading}
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div className="flex items-start space-x-3">
                                                        <Shield className="w-5 h-5 text-gray-600 mt-0.5" />
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">Promotional Emails</h4>
                                                            <p className="text-sm text-gray-600">Receive promotional offers and special announcements</p>
                                                        </div>
                                                    </div>
                                                    <Switch
                                                        checked={subscriptionStatus.preferences.promotional}
                                                        onCheckedChange={(checked) => handleSubscriptionPreferenceChange('promotional', checked)}
                                                        disabled={subscriptionLoading}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Info Box */}
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <div className="flex items-start space-x-3">
                                                <div className="p-1 bg-blue-100 rounded">
                                                    <Mail className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-blue-900">Important Note</h4>
                                                    <p className="text-sm text-blue-800 mt-1">
                                                        Even if you unsubscribe, you may still receive important account-related emails such as password resets,
                                                        security alerts, and event registration confirmations.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                                <Mail className="w-6 h-6 text-red-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load subscription settings</h3>
                                                <p className="text-gray-500 mb-4">There was an error loading your email subscription preferences.</p>
                                                <Button
                                                    onClick={loadSubscriptionStatus}
                                                    variant="outline"
                                                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                                                >
                                                    Try Again
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <Footer />
        </div>
    );
};

export default Settings;

