import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Unsubscribe = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [result, setResult] = useState<{
        success: boolean;
        message: string;
        user?: {
            name: string;
            email: string;
        };
    } | null>(null);

    useEffect(() => {
        const handleUnsubscribe = async () => {
            if (!token) {
                setResult({
                    success: false,
                    message: 'Invalid unsubscribe link'
                });
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/subscriptions/unsubscribe/${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (data.success) {
                    setResult({
                        success: true,
                        message: data.message,
                        user: data.user
                    });
                    toast.success('Successfully unsubscribed from email updates');
                } else {
                    setResult({
                        success: false,
                        message: data.message || 'Failed to unsubscribe'
                    });
                    toast.error(data.message || 'Failed to unsubscribe');
                }
            } catch (error) {
                console.error('Unsubscribe error:', error);
                setResult({
                    success: false,
                    message: 'An error occurred while processing your request'
                });
                toast.error('An error occurred while processing your request');
            } finally {
                setIsLoading(false);
            }
        };

        handleUnsubscribe();
    }, [token]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50">
                <Navbar />
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50">
            <Navbar />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Button>
                </div>

                <Card className="rounded-2xl border-2 border-gray-200/50 shadow-lg">
                    <CardHeader className="text-center pb-4">
                        <div className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center bg-gray-100">
                            {result?.success ? (
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            ) : (
                                <XCircle className="w-8 h-8 text-red-600" />
                            )}
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            {result?.success ? 'Unsubscribed Successfully' : 'Unsubscribe Failed'}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="text-center space-y-6">
                        <div className="space-y-2">
                            <p className="text-gray-600 text-lg">
                                {result?.message}
                            </p>

                            {result?.success && result?.user && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <p className="text-sm text-green-800">
                                        <strong>{result.user.name}</strong> ({result.user.email}) has been unsubscribed from email updates.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                    <h3 className="font-semibold text-blue-900">What happens next?</h3>
                                </div>
                                <ul className="text-sm text-blue-800 space-y-1 text-left">
                                    <li>• You will no longer receive promotional emails</li>
                                    <li>• You may still receive important account-related emails</li>
                                    <li>• You can resubscribe anytime from your account settings</li>
                                </ul>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link to="/">
                                    <Button className="w-full sm:w-auto">
                                        Go to Homepage
                                    </Button>
                                </Link>

                                <Link to="/login">
                                    <Button variant="outline" className="w-full sm:w-auto">
                                        Sign In to Manage Settings
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {!result?.success && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-800">
                                    If you continue to receive emails, please contact our support team at{' '}
                                    <a href="mailto:support@trizenventures.com" className="underline">
                                        support@trizenventures.com
                                    </a>
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Footer />
        </div>
    );
};

export default Unsubscribe;
