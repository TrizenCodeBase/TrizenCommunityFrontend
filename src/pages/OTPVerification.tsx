import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Mail, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { authService } from "@/services/auth";

interface LocationState {
    user: {
        name: string;
        email: string;
        id: string;
    };
    email: string;
    name: string;
}

const OTPVerification: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;

    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

    // Redirect if no user data
    useEffect(() => {
        if (!state?.user && !state?.email) {
            navigate("/");
        }
    }, [state, navigate]);

    // Countdown timer
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setOtp(value);
        setError("");
    };

    const handleVerifyOTP = async () => {
        if (otp.length !== 6) {
            setError("Please enter a valid 6-digit code");
            return;
        }

        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            const email = state?.user?.email || state?.email;
            const name = state?.user?.name || state?.name;

            if (!email) {
                throw new Error("Email not found");
            }

            const result = await authService.verifyEmail({
                email,
                otp
            });

            console.log("✅ OTP Verification successful:", result);
            console.log("✅ Token received:", result.token);

            // Store user data in localStorage
            if (result.token) {
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
            }

            setSuccess("Email verified successfully! Welcome to TRIZEN Community! 🎉");

            // Redirect to dashboard after a short delay
            setTimeout(() => {
                navigate("/dashboard");
                // Reload to update auth state
                window.location.reload();
            }, 2000);

        } catch (error: any) {
            console.error("OTP verification error:", error);
            setError(error.message || "Invalid verification code. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setIsResending(true);
        setError("");
        setSuccess("");

        try {
            const email = state?.user?.email || state?.email;
            const name = state?.user?.name || state?.name;

            if (!email) {
                throw new Error("Email not found");
            }

            await authService.resendOTP({
                email,
                type: 'email_verification'
            });

            setSuccess("Verification code sent! Please check your email.");
            setTimeLeft(600); // Reset timer
            setOtp(""); // Clear current OTP

        } catch (error: any) {
            console.error("Resend OTP error:", error);
            setError(error.message || "Failed to resend verification code. Please try again.");
        } finally {
            setIsResending(false);
        }
    };

    const handleBackToSignup = () => {
        navigate("/");
    };

    const userEmail = state?.user?.email || state?.email;
    const userName = state?.user?.name || state?.name;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={handleBackToSignup}
                    className="mb-6 text-gray-600 hover:text-gray-800"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Button>

                {/* Main Card */}
                <Card className="shadow-2xl border-0">
                    <CardHeader className="text-center pb-6">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center mb-4">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            Verify Your Email
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            We've sent a 6-digit verification code to
                        </CardDescription>
                        <div className="font-semibold text-blue-600 mt-2">
                            {userEmail}
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Success Message */}
                        {success && (
                            <Alert className="border-green-200 bg-green-50">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-700">
                                    {success}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Error Message */}
                        {error && (
                            <Alert className="border-red-200 bg-red-50">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-red-700">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* OTP Input */}
                        <div className="space-y-2">
                            <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
                                Enter Verification Code
                            </Label>
                            <Input
                                id="otp"
                                type="text"
                                value={otp}
                                onChange={handleOTPChange}
                                placeholder="000000"
                                className="text-center text-2xl font-mono tracking-widest h-14 border-2 focus:border-blue-500"
                                maxLength={6}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Timer */}
                        {timeLeft > 0 && (
                            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>Code expires in {formatTime(timeLeft)}</span>
                            </div>
                        )}

                        {/* Verify Button */}
                        <Button
                            onClick={handleVerifyOTP}
                            disabled={otp.length !== 6 || isLoading || timeLeft === 0}
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white font-semibold"
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Verifying...</span>
                                </div>
                            ) : (
                                "Verify Email"
                            )}
                        </Button>

                        {/* Resend OTP */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-3">
                                Didn't receive the code?
                            </p>
                            <Button
                                variant="outline"
                                onClick={handleResendOTP}
                                disabled={isResending || timeLeft > 0}
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                                {isResending ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                        <span>Sending...</span>
                                    </div>
                                ) : (
                                    "Resend Code"
                                )}
                            </Button>
                        </div>

                        {/* Help Text */}
                        <div className="text-center text-xs text-gray-500 space-y-1">
                            <p>Check your spam folder if you don't see the email.</p>
                            <p>Contact support if you continue to have issues.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OTPVerification;
