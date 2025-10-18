import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Mail, Lock, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/auth";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultTab?: "login" | "signup";
}

const AuthModal = ({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
    const [showResendOption, setShowResendOption] = useState(false);
    const { login } = useAuth(); // Only use login from AuthContext

    // Reset activeTab when modal opens with new defaultTab
    useEffect(() => {
        if (isOpen) {
            setActiveTab(defaultTab);
            setError(null);
            setShowResendOption(false);
            setUnverifiedEmail(null);
        }
    }, [isOpen, defaultTab]);
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [signupData, setSignupData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        interests: [] as string[],
    });

    const roles = ["Student", "Professional", "Researcher", "Entrepreneur", "Other"];
    const interestOptions = ["Training", "Research", "Solutions", "Events", "Networking"];

    const handleInterestToggle = (interest: string) => {
        setSignupData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setShowResendOption(false);

        try {
            await login(loginData.email, loginData.password);
            onClose();
            setLoginData({ email: "", password: "" });
        } catch (error: any) {
            const errorMessage = error.message || "Login failed. Please try again.";
            setError(errorMessage);

            // Check if error is about email verification
            if (errorMessage.toLowerCase().includes('verify your email') ||
                errorMessage.toLowerCase().includes('not verified')) {
                setShowResendOption(true);
                setUnverifiedEmail(loginData.email);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendVerification = async () => {
        if (!unverifiedEmail) return;

        setIsSubmitting(true);
        setError(null);

        try {
            await authService.resendOTP({
                email: unverifiedEmail,
                type: 'email_verification'
            });

            // Redirect to OTP verification page
            onClose();
            navigate('/verify-otp', {
                state: {
                    email: unverifiedEmail,
                    name: 'User' // We don't have the name from login error
                }
            });
        } catch (error: any) {
            setError(error.message || "Failed to resend verification code. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate password match
        if (signupData.password !== signupData.confirmPassword) {
            setError("Passwords do not match. Please try again.");
            return;
        }

        // Validate password length
        if (signupData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            console.log("🚀 Starting registration from AuthModal...");

            // Clear any existing auth data
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');

            // Generate username from email
            const emailPrefix = signupData.email.split('@')[0];
            let username = emailPrefix.length >= 3 ? emailPrefix : emailPrefix + '123';
            username = username.slice(0, 20).replace(/[^a-zA-Z0-9_]/g, '');
            if (username.length < 3) {
                username = username + '123';
            }

            // Register using authService (NOT AuthContext register)
            const response = await authService.register({
                name: signupData.fullName,
                email: signupData.email,
                password: signupData.password,
                username: username,
            });

            console.log("✅ Registration successful:", response);
            console.log("✅ Requires verification:", response.requiresVerification);

            // Check if verification is required
            if (response.requiresVerification) {
                console.log("🔄 Redirecting to OTP verification page...");
                // Close modal FIRST
                onClose();
                // Then redirect to OTP page with user data
                navigate('/verify-otp', {
                    state: {
                        user: response.user,
                        email: response.user.email,
                        name: response.user.name
                    }
                });
            } else {
                // If no verification required (shouldn't happen), close modal
                onClose();
                setSignupData({
                    fullName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    role: "",
                    interests: [],
                });
            }
        } catch (error: any) {
            console.error("❌ Registration error:", error);
            setError(error.message || "Registration failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
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
                        <h2 className="text-2xl font-bold">
                            {activeTab === "login" ? "Welcome Back" : "Join TRIZEN Community"}
                        </h2>
                        <p className="text-white/90 text-sm mt-1">
                            {activeTab === "login"
                                ? "Sign in to access your account"
                                : "Start your innovation journey today"}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 bg-gray-50">
                    <button
                        onClick={() => setActiveTab("login")}
                        className={`flex-1 px-6 py-4 text-base font-semibold transition-all ${activeTab === "login"
                            ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setActiveTab("signup")}
                        className={`flex-1 px-6 py-4 text-base font-semibold transition-all ${activeTab === "signup"
                            ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm font-medium">{error}</p>
                            {showResendOption && (
                                <button
                                    onClick={handleResendVerification}
                                    disabled={isSubmitting}
                                    className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Sending...
                                        </span>
                                    ) : (
                                        '📧 Resend Verification Code'
                                    )}
                                </button>
                            )}
                        </div>
                    )}

                    {activeTab === "login" ? (
                        // Login Form
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="login-email" className="text-sm font-semibold text-gray-700 flex items-center">
                                    <Mail className="w-4 h-4 mr-2 text-blue-600" />
                                    Email Address
                                </Label>
                                <Input
                                    id="login-email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                    required
                                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="login-password" className="text-sm font-semibold text-gray-700 flex items-center">
                                    <Lock className="w-4 h-4 mr-2 text-blue-600" />
                                    Password
                                </Label>
                                <Input
                                    id="login-password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    required
                                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2 rounded" />
                                    <span className="text-gray-600">Remember me</span>
                                </label>
                                <a href="#forgot" className="text-blue-600 hover:underline">
                                    Forgot password?
                                </a>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white font-semibold text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Signing In...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>

                            <p className="text-center text-sm text-gray-600">
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("signup")}
                                    className="text-blue-600 hover:underline font-semibold"
                                >
                                    Sign up here
                                </button>
                            </p>
                        </form>
                    ) : (
                        // Signup Form
                        <form onSubmit={handleSignup} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="signup-name" className="text-sm font-semibold text-gray-700 flex items-center">
                                    <User className="w-4 h-4 mr-2 text-blue-600" />
                                    Full Name
                                </Label>
                                <Input
                                    id="signup-name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={signupData.fullName}
                                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                                    required
                                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="signup-email" className="text-sm font-semibold text-gray-700 flex items-center">
                                    <Mail className="w-4 h-4 mr-2 text-blue-600" />
                                    Email Address
                                </Label>
                                <Input
                                    id="signup-email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    value={signupData.email}
                                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                    required
                                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="signup-password" className="text-sm font-semibold text-gray-700 flex items-center">
                                    <Lock className="w-4 h-4 mr-2 text-blue-600" />
                                    Password
                                </Label>
                                <Input
                                    id="signup-password"
                                    type="password"
                                    placeholder="Create a strong password"
                                    value={signupData.password}
                                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                    required
                                    minLength={8}
                                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500">Must be at least 8 characters</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="signup-confirm-password" className="text-sm font-semibold text-gray-700 flex items-center">
                                    <Lock className="w-4 h-4 mr-2 text-blue-600" />
                                    Confirm Password
                                </Label>
                                <Input
                                    id="signup-confirm-password"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={signupData.confirmPassword}
                                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                                    required
                                    minLength={8}
                                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                                {signupData.confirmPassword && signupData.password !== signupData.confirmPassword && (
                                    <p className="text-xs text-red-500">Passwords do not match</p>
                                )}
                                {signupData.confirmPassword && signupData.password === signupData.confirmPassword && (
                                    <p className="text-xs text-green-500">Passwords match ✓</p>
                                )}
                            </div>

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
                                            onClick={() => setSignupData({ ...signupData, role })}
                                            className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${signupData.role === role
                                                ? "border-blue-600 bg-blue-50 text-blue-700"
                                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                                                }`}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700">
                                    Your Interests <span className="text-xs text-gray-500 ml-2">(Select all that apply)</span>
                                </Label>
                                <div className="flex flex-wrap gap-3">
                                    {interestOptions.map((interest) => (
                                        <button
                                            key={interest}
                                            type="button"
                                            onClick={() => handleInterestToggle(interest)}
                                            className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all duration-200 ${signupData.interests.includes(interest)
                                                ? "border-orange-500 bg-orange-50 text-orange-700"
                                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                                                }`}
                                        >
                                            {interest}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white font-semibold text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Creating Account...
                                    </>
                                ) : (
                                    "Create Account & Join Community"
                                )}
                            </Button>

                            <p className="text-center text-sm text-gray-600">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("login")}
                                    className="text-blue-600 hover:underline font-semibold"
                                >
                                    Sign in here
                                </button>
                            </p>

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
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;

