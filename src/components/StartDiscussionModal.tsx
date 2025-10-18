import React, { useState } from 'react';
import { X, MessageSquare, Tag, Hash, Image, Link, Send, CheckCircle, Users, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface StartDiscussionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const StartDiscussionModal: React.FC<StartDiscussionModalProps> = ({ isOpen, onClose }) => {
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
            onClose();
        }, 3000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 mx-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Start a Discussion</h2>
                            <p className="text-gray-600 mt-1">Share your thoughts with the community</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {isSubmitted ? (
                        <div className="text-center py-12">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Discussion Created!</h3>
                            <p className="text-gray-600">Your discussion has been posted and is now live in the community.</p>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Form */}
                            <div className="lg:col-span-2">
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
                                                <SelectTrigger className="border-gray-300 focus:border-primary">
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
                                                <SelectTrigger className="border-gray-300 focus:border-primary">
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
                                                            <X className="w-3 h-3 ml-1" />
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
                                            className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white px-8"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Posting...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Post Discussion
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </div>

                            {/* Guidelines */}
                            <div className="space-y-6">
                                <Card className="bg-gradient-to-br from-blue-50 to-orange-50 border-blue-200">
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                            <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                                            Discussion Guidelines
                                        </h4>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li className="flex items-start">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                                Be respectful and constructive
                                            </li>
                                            <li className="flex items-start">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                                Use clear, descriptive titles
                                            </li>
                                            <li className="flex items-start">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                                Add relevant tags for discoverability
                                            </li>
                                            <li className="flex items-start">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                                Provide context and examples
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold text-gray-900 mb-3">Popular Categories</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['AI & ML', 'Research', 'Development', 'Product'].map((category) => (
                                                <Badge
                                                    key={category}
                                                    variant="outline"
                                                    className="border-gray-300 text-gray-600 hover:border-orange-500 hover:text-orange-600 cursor-pointer"
                                                    onClick={() => setFormData({ ...formData, category })}
                                                >
                                                    {category}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold text-gray-900 mb-3">Tips for Engagement</h4>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li>• Ask specific questions</li>
                                            <li>• Share your experiences</li>
                                            <li>• Include relevant links</li>
                                            <li>• Use formatting for clarity</li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StartDiscussionModal;
