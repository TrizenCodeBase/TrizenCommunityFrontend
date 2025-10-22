import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Send, User, Building, MessageSquare, CheckCircle, Clock, Globe, Linkedin, Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Custom X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

// Custom WhatsApp icon component
const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
    </svg>
);

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        inquiryType: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSelectChange = (value: string) => {
        setFormData({
            ...formData,
            inquiryType: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Client-side validation
        if (!formData.name.trim()) {
            alert('Please enter your name');
            setIsSubmitting(false);
            return;
        }
        if (!formData.email.trim()) {
            alert('Please enter your email address');
            setIsSubmitting(false);
            return;
        }
        if (!formData.inquiryType) {
            alert('Please select an inquiry type');
            setIsSubmitting(false);
            return;
        }
        if (!formData.subject.trim()) {
            alert('Please enter a subject');
            setIsSubmitting(false);
            return;
        }
        if (!formData.message.trim()) {
            alert('Please enter your message');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('https://trizencommunitybackend.llp.trizenventures.com/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                setIsSubmitted(true);
                console.log('✅ Contact form submitted successfully:', result);
            } else {
                console.error('❌ Contact form submission failed:', result.message);
                if (result.errors && result.errors.length > 0) {
                    // Show specific validation errors
                    const errorMessages = result.errors.map((error: any) => error.msg).join(', ');
                    alert(`Validation failed: ${errorMessages}`);
                } else {
                    alert('Failed to send message. Please try again later.');
                }
            }
        } catch (error) {
            console.error('❌ Network error:', error);
            alert('Network error. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }

        // Reset form after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({
                name: '',
                email: '',
                company: '',
                inquiryType: '',
                subject: '',
                message: ''
            });
        }, 3000);
    };

    const contactMethods = [
        {
            icon: Mail,
            title: "Email",
            value: "support@trizenventures.com",
            link: "mailto:support@trizenventures.com",
            availability: "Response within 24 hours"
        },
        {
            icon: Phone,
            title: "Phone",
            value: "+918639648822",
            link: "tel:+918639648822",
            availability: "Mon-Fri, 9 AM - 6 PM IST"
        },
        {
            icon: MapPin,
            title: "Office",
            value: "123 Innovation Drive, San Francisco, CA 94103",
            link: "https://maps.google.com",
            availability: "Mon-Fri, 9 AM - 5 PM PST"
        }
    ];

    const socialLinks = [
        { name: "Facebook", icon: Facebook, link: "https://www.facebook.com/trizenventures/", color: "hover:bg-blue-700" },
        { name: "X", icon: XIcon, link: "https://x.com/TrizenVenture", color: "hover:bg-sky-500" },
        { name: "LinkedIn", icon: Linkedin, link: "https://www.linkedin.com/company/trizenventuresllp/", color: "hover:bg-blue-600" },
        { name: "Instagram", icon: Instagram, link: "https://www.instagram.com/trizenventures/", color: "hover:bg-pink-600" },
        { name: "WhatsApp", icon: WhatsAppIcon, link: "https://whatsapp.com/channel/0029Vb6cKIp4SpkNdvBufo0g", color: "hover:bg-green-600" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50">
            <Navbar />

            {/* Back to Home Link */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </button>
            </div>

            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                        Get in <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">Touch</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Form - Takes 2 columns */}
                    <div className="lg:col-span-2">
                        <Card className="rounded-2xl border border-gray-200 shadow-sm h-full">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-2xl font-bold text-gray-900">Send us a Message</CardTitle>
                                <p className="text-gray-600 text-sm">Fill out the form and our team will get back to you within 24 hours.</p>
                            </CardHeader>
                            <CardContent>
                                {isSubmitted ? (
                                    <div className="text-center py-12">
                                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                                        <p className="text-gray-600">Thank you for contacting us. We'll get back to you soon.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                                                    Full Name *
                                                </label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        type="text"
                                                        required
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        className="pl-10 border-gray-300 focus:border-blue-500"
                                                        placeholder="Enter your full name"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                                    Email Address *
                                                </label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        required
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        className="pl-10 border-gray-300 focus:border-blue-500"
                                                        placeholder="Enter your email"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="company" className="text-sm font-medium text-gray-700">
                                                Company
                                            </label>
                                            <div className="relative">
                                                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <Input
                                                    id="company"
                                                    name="company"
                                                    type="text"
                                                    value={formData.company}
                                                    onChange={handleInputChange}
                                                    className="pl-10 border-gray-300 focus:border-blue-500"
                                                    placeholder="Enter your company"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="inquiryType" className="text-sm font-medium text-gray-700">
                                                Inquiry Type *
                                            </label>
                                            <Select value={formData.inquiryType} onValueChange={handleSelectChange}>
                                                <SelectTrigger className="border-gray-300 focus:border-blue-500">
                                                    <SelectValue placeholder="Select inquiry type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="general">General Inquiry</SelectItem>
                                                    <SelectItem value="partnership">Partnership</SelectItem>
                                                    <SelectItem value="support">Technical Support</SelectItem>
                                                    <SelectItem value="sales">Sales</SelectItem>
                                                    <SelectItem value="media">Media & Press</SelectItem>
                                                    <SelectItem value="career">Career Opportunities</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                                                Subject *
                                            </label>
                                            <Input
                                                id="subject"
                                                name="subject"
                                                type="text"
                                                required
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                className="border-gray-300 focus:border-blue-500"
                                                placeholder="Enter subject"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="message" className="text-sm font-medium text-gray-700">
                                                Message *
                                            </label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                required
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                className="border-gray-300 focus:border-blue-500 min-h-[120px]"
                                                placeholder="Enter your message"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 font-semibold rounded-lg transition-colors duration-200"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Send Message
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Information Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Methods */}
                        <Card className="rounded-2xl border border-gray-200 shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl font-bold text-gray-900">Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {contactMethods.map((method, index) => (
                                    <a
                                        key={index}
                                        href={method.link}
                                        className="block group"
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-orange-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-blue-100 group-hover:to-orange-100 transition-colors duration-200">
                                                <method.icon className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 text-sm mb-0.5">{method.title}</h4>
                                                <p className="text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors duration-200 break-words">
                                                    {method.value}
                                                </p>
                                                <p className="text-gray-500 text-xs mt-1">{method.availability}</p>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Office Hours */}
                        <Card className="rounded-2xl border border-gray-200 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                                    Office Hours
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Monday - Friday</span>
                                    <span className="font-medium text-gray-900">9:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Saturday</span>
                                    <span className="font-medium text-gray-900">10:00 AM - 4:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Sunday</span>
                                    <span className="font-medium text-gray-900">Closed</span>
                                </div>
                                <div className="pt-2 mt-2 border-t border-gray-200">
                                    <p className="text-xs text-gray-500">Pacific Standard Time (PST)</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Media */}
                        <Card className="rounded-2xl border border-gray-200 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-bold text-gray-900">Follow Us</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-5 gap-2">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.link}
                                            className={`w-full aspect-square rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 ${social.color} hover:text-white transition-all duration-200 hover:scale-105 hover:shadow-md`}
                                            title={social.name}
                                        >
                                            <social.icon className="w-5 h-5" />
                                        </a>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Response Badge */}
                        <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl p-5 border border-blue-100">
                            <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm mb-1">Quick Response Guaranteed</h4>
                                    <p className="text-gray-600 text-xs leading-relaxed">
                                        We respond to all inquiries within 24 hours on business days. For urgent matters, please call us directly.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Contact;