import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Mail, Lock, User, Briefcase, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth";

interface SignupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SignupModal = ({ isOpen, onClose }: SignupModalProps) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        role: "",
        interests: [] as string[],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");


    const roles = ["Student", "Professional", "Researcher", "Entrepreneur", "Other"];
    const interestOptions = ["Training", "Research", "Solutions", "Events", "Networking"];

    const handleInterestToggle = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const resetForm = () => {
        setFormData({
            fullName: "",
            email: "",
            password: "",
            role: "",
            interests: [],
        });
        setError("");
        setShowOTPVerification(false);
        setRegisteredUser(null);
    };

    const handleOTPVerificationSuccess = (user: any, token: string) => {
        // The apiService.verifyEmail already stores the token and user data
        // Show success message
        alert("Welcome to TRIZEN Community! 🎉\n\nYour email has been verified successfully.");

        // Close modal and reset form
        onClose();
        resetForm();

        // Refresh the page to update the app state with the new user
        window.location.reload();
    };

    const handleBackToSignup = () => {
        setShowOTPVerification(false);
        setRegisteredUser(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            console.log("🚀 Starting registration...");

            // Validate required fields
            if (!formData.fullName || !formData.email || !formData.password || !formData.role) {
                throw new Error("Please fill in all required fields");
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                throw new Error("Please enter a valid email address");
            }

            // Validate password length
            if (formData.password.length < 6) {
                throw new Error("Password must be at least 6 characters long");
            }

            // Generate a proper username from email (ensure it's 3+ characters)
            const emailPrefix = formData.email.split('@')[0];
            let username = emailPrefix.length >= 3 ? emailPrefix : emailPrefix + '123';

            // Ensure username is within 3-20 characters
            username = username.slice(0, 20).replace(/[^a-zA-Z0-9_]/g, '');
            if (username.length < 3) {
                username = username + '123';
            }

            const registrationData = {
                name: formData.fullName,
                email: formData.email,
                password: formData.password,
                username: username,
            };

            console.log("📤 Sending registration...");

            // Clear any existing auth data before registration
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');

            // Call the auth service to register the user
            const response = await authService.register(registrationData);

            console.log("✅ Registration response:", response);
            console.log("✅ Response type:", typeof response);
            console.log("✅ Response keys:", Object.keys(response));
            console.log("✅ Has token?", response.token ? "YES" : "NO");
            console.log("✅ Has user?", response.user ? "YES" : "NO");
            console.log("✅ Requires verification?", response.requiresVerification ? "YES" : "NO");
            console.log("✅ User object:", response.user);

            // Check if verification is required
            if (response && response.requiresVerification) {
                console.log("🔄 Redirecting to OTP page...");
                // Redirect to OTP verification page with user data
                navigate('/verify-otp', {
                    state: {
                        user: response.user,
                        email: response.user.email,
                        name: response.user.name
                    }
                });
                onClose(); // Close the signup modal
            } else {
                // Success - show success message and close modal
                alert("Welcome to TRIZEN Community! 🎉\n\nYour account has been created successfully.");
                onClose();
                resetForm();
            }
        } catch (error: any) {
            console.error("❌ Signup error:", error);
            setError(error.message || "Failed to create account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-orange-500 text-white p-6 rounded-t-2xl">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold">Join TRIZEN Community</h2>
                        <p className="text-white/90 text-sm mt-1">Start your innovation journey today</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}
                    {/* Full Name */}
                    <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700 flex items-center">
                            <User className="w-4 h-4 mr-2 text-blue-600" />
                            Full Name
                        </Label>
                        <Input
                            id="fullName"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            required
                            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-blue-600" />
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center">
                            <Lock className="w-4 h-4 mr-2 text-blue-600" />
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            minLength={8}
                            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500">Must be at least 8 characters</p>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center">
                            <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                            Your Role
                        </Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {roles.map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role })}
                                    className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${formData.role === role
                                        ? "border-blue-600 bg-blue-50 text-blue-700"
                                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Interests Selection */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center">
                            <Sparkles className="w-4 h-4 mr-2 text-orange-600" />
                            Your Interests <span className="text-xs text-gray-500 ml-2">(Select all that apply)</span>
                        </Label>
                        <div className="flex flex-wrap gap-3">
                            {interestOptions.map((interest) => (
                                <button
                                    key={interest}
                                    type="button"
                                    onClick={() => handleInterestToggle(interest)}
                                    className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all duration-200 ${formData.interests.includes(interest)
                                        ? "border-orange-500 bg-orange-50 text-orange-700"
                                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    {interest}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white font-semibold text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Creating Account..." : "Create Account & Join Community"}
                        </Button>
                    </div>

                    {/* Additional Info */}
                    <p className="text-xs text-center text-gray-500">
                        By signing up, you agree to our{" "}
                        <a href="#terms" className="text-blue-600 hover:underline">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#privacy" className="text-blue-600 hover:underline">
                            Privacy Policy
                        </a>
                    </p>
                </form>
            </div>

        </div>
    );
};

export default SignupModal;

