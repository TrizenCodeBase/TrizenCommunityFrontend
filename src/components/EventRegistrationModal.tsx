import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { eventsService } from "@/services/events";
import { toast } from "sonner";

interface EventRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventId: number;
    eventTitle: string;
}

const EventRegistrationModal = ({ isOpen, onClose, eventId, eventTitle }: EventRegistrationModalProps) => {
    const { user, isAuthenticated } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        phoneNumber: "",
        comments: "",
    });

    if (!isOpen) return null;

    if (!isAuthenticated) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl mx-4 p-6">
                    <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-bold mb-4">Login Required</h2>
                    <p className="text-gray-600 mb-4">Please login to register for this event.</p>
                    <Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700">
                        Close
                    </Button>
                </div>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Call backend API
            await eventsService.registerForEvent(eventId.toString(), {
                userName: user?.name,
                userEmail: user?.email,
                phoneNumber: formData.phoneNumber,
                comments: formData.comments,
            });

            // Show success message
            toast.success("Registration Successful! 🎉", {
                description: "Check your email for confirmation and event details.",
                duration: 5000,
            });

            // Reset form
            setFormData({
                phoneNumber: "",
                comments: "",
            });

            onClose();
        } catch (error: any) {
            console.error("Registration error:", error);
            toast.error("Registration Failed", {
                description: error.message || "Please try again later.",
                duration: 4000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto p-4">
            <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl my-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 z-10"
                    disabled={isSubmitting}
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2">Event Registration</h2>
                    <p className="text-sm text-gray-600 mb-6">{eventTitle}</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* User Information */}
                        <div className="space-y-3">
                            <div>
                                <Label className="text-sm font-medium">Full Name</Label>
                                <Input
                                    value={user?.name || ""}
                                    disabled
                                    className="bg-gray-50 mt-1"
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Email Address</Label>
                                <Input
                                    value={user?.email || ""}
                                    disabled
                                    className="bg-gray-50 mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="phoneNumber" className="text-sm font-medium">
                                    Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                                </Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="comments" className="text-sm font-medium">
                                    Additional Comments <span className="text-gray-400 text-xs">(Optional)</span>
                                </Label>
                                <Textarea
                                    id="comments"
                                    name="comments"
                                    placeholder="Any questions or special requirements..."
                                    value={formData.comments}
                                    onChange={handleChange}
                                    rows={3}
                                    className="mt-1 resize-none"
                                />
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
                            <p className="text-xs text-blue-900">
                                <strong className="font-semibold">📧 Confirmation Email:</strong> You'll receive a confirmation email with your registration details. Our team will review your submission.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex space-x-3 pt-2">
                            <Button
                                type="button"
                                onClick={onClose}
                                variant="outline"
                                className="flex-1"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Registration"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EventRegistrationModal;

