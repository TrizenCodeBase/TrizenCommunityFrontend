import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, Tag, Hash, Image, Link, Send, CheckCircle, Users, Eye, Globe, TrendingUp, Award, BookOpen, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const StartDiscussion = () => {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        content: '',
        tags: [] as string[],
        visibility: 'public'
    });
    const [tagInput, setTagInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const categories = [
        'Research',
        'Product',
        'Development',
        'Design',
        'Business',
        'AI & ML',
        'Blockchain',
        'Web3',
        'Data Science',
        'General'
    ];

    const popularTags = [
        'AI', 'Machine Learning', 'React', 'JavaScript', 'Python', 'Blockchain',
        'Web3', 'Startup', 'Innovation', 'Research', 'Design', 'Product'
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSelectChange = (value: string) => {
        setFormData({
            ...formData,
            category: value
        });
    };

    const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            e.preventDefault();
            setFormData({
                ...formData,
                tags: [...formData.tags, tagInput.trim()]
            });
            setTagInput('');
        }
    };

    const handleTagRemove = (tagToRemove: string) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter(tag => tag !== tagToRemove)
        });
    };

    const handlePopularTagClick = (tag: string) => {
        if (!formData.tags.includes(tag)) {
            setFormData({
                ...formData,
                tags: [...formData.tags, tag]
            });
        }
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
                title: '',
                category: '',
                content: '',
                tags: [],
                visibility: 'public'
            });
            setTagInput('');
        }, 3000);
    };

    const features = [
        {
            icon: Users,
            title: "Community Driven",
            description: "Connect with like-minded professionals and experts"
        },
        {
            icon: TrendingUp,
            title: "Stay Updated",
            description: "Get insights on the latest trends and technologies"
        },
        {
            icon: Award,
            title: "Build Reputation",
            description: "Share knowledge and build your professional reputation"
        }
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-50 to-orange-50 border border-blue-200 backdrop-blur-sm mb-6 shadow-lg shadow-blue-100">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-orange-500 flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-blue-600 font-semibold text-sm tracking-wide uppercase">Start Discussion</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        Start a <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">Discussion</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        Share your thoughts, ask questions, and connect with our community of innovators and professionals.
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Discussion Form */}
                    <div className="lg:col-span-2">
                        <Card className="rounded-2xl border-2 border-gray-200/50 shadow-lg">
                            <CardHeader className="pb-6">
                                <CardTitle className="text-2xl font-bold text-gray-900">Create Your Discussion</CardTitle>
                                <p className="text-gray-600">Share your thoughts with the community and start meaningful conversations.</p>
                            </CardHeader>
                            <CardContent>
                                {isSubmitted ? (
                                    <div className="text-center py-12">
                                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Discussion Created!</h3>
                                        <p className="text-gray-600">Your discussion has been posted and is now live in the community.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <label htmlFor="title" className="text-sm font-medium text-gray-700">
                                                Discussion Title *
                                            </label>
                                            <Input
                                                id="title"
                                                name="title"
                                                type="text"
                                                required
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                className="border-gray-300 focus:border-blue-500"
                                                placeholder="What's your discussion about?"
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label htmlFor="category" className="text-sm font-medium text-gray-700">
                                                    Category *
                                                </label>
                                                <Select value={formData.category} onValueChange={handleSelectChange}>
                                                    <SelectTrigger className="border-gray-300 focus:border-blue-500">
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map((category) => (
                                                            <SelectItem key={category} value={category}>
                                                                {category}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <label htmlFor="visibility" className="text-sm font-medium text-gray-700">
                                                    Visibility
                                                </label>
                                                <Select value={formData.visibility} onValueChange={(value) => setFormData({ ...formData, visibility: value })}>
                                                    <SelectTrigger className="border-gray-300 focus:border-blue-500">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="public">Public</SelectItem>
                                                        <SelectItem value="members">Members Only</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="content" className="text-sm font-medium text-gray-700">
                                                Discussion Content *
                                            </label>
                                            <Textarea
                                                id="content"
                                                name="content"
                                                required
                                                value={formData.content}
                                                onChange={handleInputChange}
                                                className="border-gray-300 focus:border-blue-500 min-h-[200px]"
                                                placeholder="Share your thoughts, ask questions, or start a conversation..."
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="tags" className="text-sm font-medium text-gray-700">
                                                Tags
                                            </label>
                                            <div className="space-y-3">
                                                <Input
                                                    value={tagInput}
                                                    onChange={(e) => setTagInput(e.target.value)}
                                                    onKeyDown={handleTagAdd}
                                                    className="border-gray-300 focus:border-blue-500"
                                                    placeholder="Add tags (press Enter to add)"
                                                />
                                                {formData.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {formData.tags.map((tag) => (
                                                            <Badge
                                                                key={tag}
                                                                variant="outline"
                                                                className="border-blue-500 text-blue-600 cursor-pointer hover:bg-blue-50"
                                                                onClick={() => handleTagRemove(tag)}
                                                            >
                                                                <Hash className="w-3 h-3 mr-1" />
                                                                {tag}
                                                                <span className="ml-1 text-gray-400">×</span>
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4">
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    {formData.visibility === 'public' ? 'Public' : 'Members Only'}
                                                </div>
                                                <div className="flex items-center">
                                                    <Users className="w-4 h-4 mr-1" />
                                                    Community Discussion
                                                </div>
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white px-8 py-3 text-lg font-semibold"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                        Posting Discussion...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-5 h-5 mr-2" />
                                                        Post Discussion
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Guidelines */}
                        <Card className="rounded-2xl border-2 border-gray-200/50 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                                    <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                                    Discussion Guidelines
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li className="flex items-start">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        Be respectful and constructive in your discussions
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        Use clear, descriptive titles for better discoverability
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        Add relevant tags to help others find your content
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        Provide context and examples when possible
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Popular Tags */}
                        <Card className="rounded-2xl border-2 border-gray-200/50 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-gray-900">Popular Tags</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {popularTags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="outline"
                                            className="border-gray-300 text-gray-600 hover:border-orange-500 hover:text-orange-600 cursor-pointer"
                                            onClick={() => handlePopularTagClick(tag)}
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Features */}
                        <Card className="rounded-2xl border-2 border-gray-200/50 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-gray-900">Why Start a Discussion?</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <feature.icon className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm mb-1">{feature.title}</h4>
                                            <p className="text-gray-600 text-xs">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Tips */}
                        <Card className="rounded-2xl border-2 border-gray-200/50 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                                    <Zap className="w-5 h-5 mr-2 text-orange-500" />
                                    Tips for Engagement
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>• Ask specific questions to encourage responses</li>
                                    <li>• Share your experiences and insights</li>
                                    <li>• Include relevant links and resources</li>
                                    <li>• Use formatting for better readability</li>
                                    <li>• Respond to comments to keep discussions active</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default StartDiscussion;

