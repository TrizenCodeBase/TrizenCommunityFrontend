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
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
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

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsSubmitting(false);
        setIsSubmitted(true);

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
        { name: "Instagram", icon: Instagram, link: "https://www.instagram.com/trizenventures/", color: "hover:bg-pink-600" }
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
                                <div className="grid grid-cols-4 gap-2">
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