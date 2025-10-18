import { useState, useEffect } from "react";
import { X, Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth";

interface OTPVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
    name: string;
    onVerificationSuccess: (user: any, token: string) => void;
    onBackToSignup: () => void;
}

const OTPVerificationModal = ({
    isOpen,
    onClose,
    email,
    name,
    onVerificationSuccess,
    onBackToSignup
}: OTPVerificationModalProps) => {
    console.log('🔍 OTPVerificationModal rendered with isOpen:', isOpen, 'email:', email);
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            if (otp.length !== 6) {
                throw new Error("Please enter a valid 6-digit code");
            }

            const response = await authService.verifyEmail({ email, otp });

            setSuccess("Email verified successfully! Welcome to TRIZEN Community!");
            setTimeout(() => {
                onVerificationSuccess(response.user, response.token);
                onClose();
            }, 1500);
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

        try {
            await authService.resendOTP({ email, type: 'email_verification' });
            setTimeLeft(600); // Reset timer
            setSuccess("New verification code sent to your email!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (error: any) {
            console.error("Resend OTP error:", error);
            setError(error.message || "Failed to resend code. Please try again.");
        } finally {
            setIsResending(false);
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
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-orange-500 text-white p-6 rounded-t-2xl">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold">Verify Your Email</h2>
                        <p className="text-white/90 text-sm mt-1">Enter the 6-digit code sent to your email</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                            {success}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    {/* Email Info */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <Mail className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-gray-600">
                            We've sent a verification code to
                        </p>
                        <p className="font-semibold text-gray-900">{email}</p>
                    </div>

                    {/* OTP Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="otp" className="text-sm font-semibold text-gray-700">
                                Verification Code
                            </Label>
                            <Input
                                id="otp"
                                type="text"
                                placeholder="000000"
                                value={otp}
                                onChange={handleOTPChange}
                                maxLength={6}
                                className="h-14 text-center text-2xl font-mono tracking-widest border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                autoComplete="one-time-code"
                            />
                        </div>

                        {/* Timer */}
                        <div className="text-center">
                            {timeLeft > 0 ? (
                                <p className="text-sm text-gray-500">
                                    Code expires in <span className="font-semibold text-orange-600">{formatTime(timeLeft)}</span>
                                </p>
                            ) : (
                                <p className="text-sm text-red-600 font-semibold">
                                    Code has expired. Please request a new one.
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading || otp.length !== 6 || timeLeft === 0}
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white font-semibold text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Verifying..." : "Verify Email"}
                        </Button>

                        {/* Resend Button */}
                        <div className="text-center">
                            <p className="text-sm text-gray-500 mb-2">
                                Didn't receive the code?
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleResendOTP}
                                disabled={isResending || timeLeft > 540} // Can resend after 1 minute
                                className="text-blue-600 border-blue-600 hover:bg-blue-50"
                            >
                                {isResending ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    "Resend Code"
                                )}
                            </Button>
                        </div>

                        {/* Back to Signup */}
                        <div className="text-center pt-4 border-t border-gray-200">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onBackToSignup}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Signup
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OTPVerificationModal;
