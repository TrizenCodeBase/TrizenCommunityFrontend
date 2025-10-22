import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { X, Plus, Upload, User, Mail, Phone, Building, Briefcase, Globe, Linkedin, Twitter } from 'lucide-react';

interface SpeakerFormData {
    name: string;
    email: string;
    phone: string;
    organization: string;
    position: string;
    expertise: string[];
    topics: string[];
    bio: string;
    shortDescription: string;
    profilePicture: string;
    portfolio: string;
    linkedin: string;
    twitter: string;
    website: string;
    previousSpeakingExperience: string;
    availability: string;
    specialRequirements: string;
    eventId?: string;
}

const expertiseOptions = [
    'Technology',
    'Business',
    'Marketing',
    'Finance',
    'Healthcare',
    'Education',
    'Design',
    'Data Science',
    'AI/ML',
    'Blockchain',
    'Sustainability',
    'Leadership',
    'Innovation',
    'Entrepreneurship',
    'Other'
];

const SpeakerApplicationForm: React.FC = () => {
    const [formData, setFormData] = useState<SpeakerFormData>({
        name: '',
        email: '',
        phone: '',
        organization: '',
        position: '',
        expertise: [],
        topics: [],
        bio: '',
        shortDescription: '',
        profilePicture: '',
        portfolio: '',
        linkedin: '',
        twitter: '',
        website: '',
        previousSpeakingExperience: '',
        availability: '',
        specialRequirements: '',
        eventId: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [newTopic, setNewTopic] = useState('');

    const handleInputChange = (field: keyof SpeakerFormData, value: string | string[]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleExpertiseChange = (expertise: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            expertise: checked
                ? [...prev.expertise, expertise]
                : prev.expertise.filter(e => e !== expertise)
        }));
    };

    const addTopic = () => {
        if (newTopic.trim() && !formData.topics.includes(newTopic.trim())) {
            setFormData(prev => ({
                ...prev,
                topics: [...prev.topics, newTopic.trim()]
            }));
            setNewTopic('');
        }
    };

    const removeTopic = (topic: string) => {
        setFormData(prev => ({
            ...prev,
            topics: prev.topics.filter(t => t !== topic)
        }));
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setFormData(prev => ({
                    ...prev,
                    profilePicture: result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Client-side validation
        if (!formData.name.trim()) {
            toast.error('Name is required');
            setIsSubmitting(false);
            return;
        }
        if (!formData.email.trim()) {
            toast.error('Email is required');
            setIsSubmitting(false);
            return;
        }
        if (!formData.organization.trim()) {
            toast.error('Organization is required');
            setIsSubmitting(false);
            return;
        }
        if (formData.expertise.length === 0) {
            toast.error('At least one expertise area is required');
            setIsSubmitting(false);
            return;
        }
        if (formData.bio.trim().length < 50) {
            toast.error('Bio must be at least 50 characters');
            setIsSubmitting(false);
            return;
        }

        try {
            // Clean up the data - remove empty strings for optional fields
            const cleanedData = {
                ...formData,
                phone: formData.phone.trim() || undefined,
                linkedin: formData.linkedin.trim() || undefined,
                twitter: formData.twitter.trim() || undefined,
                website: formData.website.trim() || undefined,
                position: formData.position.trim() || undefined,
                shortDescription: formData.shortDescription.trim() || undefined,
                profilePicture: formData.profilePicture.trim() || undefined,
                portfolio: formData.portfolio.trim() || undefined,
                previousSpeakingExperience: formData.previousSpeakingExperience.trim() || undefined,
                availability: formData.availability.trim() || undefined,
                specialRequirements: formData.specialRequirements.trim() || undefined,
                eventId: formData.eventId.trim() || undefined
            };

            console.log('📧 Submitting speaker application with cleaned data:', cleanedData);

            const response = await fetch('https://trizencommunitybackend.llp.trizenventures.com/api/speakers/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cleanedData),
            });

            console.log('📊 Response status:', response.status);

            const result = await response.json();
            console.log('📊 Full response:', result);

            if (result.success) {
                setIsSubmitted(true);
                toast.success('Speaker application submitted successfully!');
                console.log('✅ Speaker application submitted:', result);
            } else {
                console.error('❌ Speaker application failed:', result);
                if (result.errors && result.errors.length > 0) {
                    // Show specific validation errors
                    const errorMessages = result.errors.map((error: any) => error.msg).join(', ');
                    console.log('🔍 Validation errors:', result.errors);
                    toast.error(`Validation failed: ${errorMessages}`);
                } else {
                    console.log('🔍 Error message:', result.message);
                    toast.error(result.message || 'Failed to submit application. Please try again.');
                }
            }
        } catch (error) {
            console.error('❌ Network error:', error);
            toast.error('Network error. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <CardTitle className="text-2xl text-green-600">Application Submitted!</CardTitle>
                    <CardDescription>
                        Thank you for your interest in speaking at Trizen Ventures events. We will review your application and get back to you soon.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-gray-600 mb-4">
                        Our team will review your application within 3-5 business days. You'll receive an email with our decision.
                    </p>
                    <Button
                        onClick={() => {
                            setIsSubmitted(false);
                            setFormData({
                                name: '',
                                email: '',
                                phone: '',
                                organization: '',
                                position: '',
                                expertise: [],
                                topics: [],
                                bio: '',
                                shortDescription: '',
                                profilePicture: '',
                                portfolio: '',
                                linkedin: '',
                                twitter: '',
                                website: '',
                                previousSpeakingExperience: '',
                                availability: '',
                                specialRequirements: '',
                                eventId: ''
                            });
                        }}
                        variant="outline"
                    >
                        Submit Another Application
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="w-6 h-6" />
                    Become a Speaker
                </CardTitle>
                <CardDescription>
                    Share your expertise with our community. Fill out the form below to apply as a speaker for our events.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email Address *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="your.email@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                            <div>
                                <Label htmlFor="organization">Organization *</Label>
                                <Input
                                    id="organization"
                                    value={formData.organization}
                                    onChange={(e) => handleInputChange('organization', e.target.value)}
                                    placeholder="Your company or organization"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="position">Position/Title</Label>
                                <Input
                                    id="position"
                                    value={formData.position}
                                    onChange={(e) => handleInputChange('position', e.target.value)}
                                    placeholder="Your job title"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Expertise Areas */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Expertise Areas *</h3>
                        <p className="text-sm text-gray-600">Select all areas where you have expertise:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {expertiseOptions.map((expertise) => (
                                <div key={expertise} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={expertise}
                                        checked={formData.expertise.includes(expertise)}
                                        onCheckedChange={(checked) => handleExpertiseChange(expertise, checked as boolean)}
                                    />
                                    <Label htmlFor={expertise} className="text-sm">{expertise}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Speaking Topics */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Speaking Topics</h3>
                        <p className="text-sm text-gray-600">Add topics you'd like to speak about:</p>
                        <div className="flex gap-2">
                            <Input
                                value={newTopic}
                                onChange={(e) => setNewTopic(e.target.value)}
                                placeholder="Enter a speaking topic"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                            />
                            <Button type="button" onClick={addTopic} variant="outline" size="sm">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        {formData.topics.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.topics.map((topic) => (
                                    <Badge key={topic} variant="secondary" className="flex items-center gap-1">
                                        {topic}
                                        <button
                                            type="button"
                                            onClick={() => removeTopic(topic)}
                                            className="ml-1 hover:text-red-500"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bio and Description */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">About You</h3>
                        <div>
                            <Label htmlFor="bio">Bio *</Label>
                            <Textarea
                                id="bio"
                                value={formData.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                placeholder="Tell us about yourself, your experience, and what makes you a great speaker..."
                                rows={4}
                                required
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                {formData.bio.length}/50 characters minimum
                                {formData.bio.length < 50 && (
                                    <span className="text-red-500 ml-2">
                                        ({50 - formData.bio.length} more characters needed)
                                    </span>
                                )}
                            </p>
                        </div>
                        <div>
                            <Label htmlFor="shortDescription">Short Description</Label>
                            <Textarea
                                id="shortDescription"
                                value={formData.shortDescription}
                                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                                placeholder="A brief one-liner about yourself (optional)"
                                rows={2}
                            />
                        </div>
                    </div>

                    {/* Profile Picture */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Profile Picture</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                {formData.profilePicture ? (
                                    <img
                                        src={formData.profilePicture}
                                        alt="Profile preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-8 h-8 text-gray-400" />
                                )}
                            </div>
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="profilePicture"
                                />
                                <Label htmlFor="profilePicture" className="cursor-pointer">
                                    <Button type="button" variant="outline" size="sm" asChild>
                                        <span>
                                            <Upload className="w-4 h-4 mr-2" />
                                            Upload Photo
                                        </span>
                                    </Button>
                                </Label>
                                <p className="text-sm text-gray-500 mt-1">Optional: Upload a professional photo</p>
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Social Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="linkedin">LinkedIn</Label>
                                <div className="flex items-center gap-2">
                                    <Linkedin className="w-4 h-4 text-gray-400" />
                                    <Input
                                        id="linkedin"
                                        value={formData.linkedin}
                                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                                        placeholder="https://linkedin.com/in/yourprofile"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="twitter">Twitter/X</Label>
                                <div className="flex items-center gap-2">
                                    <Twitter className="w-4 h-4 text-gray-400" />
                                    <Input
                                        id="twitter"
                                        value={formData.twitter}
                                        onChange={(e) => handleInputChange('twitter', e.target.value)}
                                        placeholder="https://twitter.com/yourhandle"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="website">Website</Label>
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-gray-400" />
                                    <Input
                                        id="website"
                                        value={formData.website}
                                        onChange={(e) => handleInputChange('website', e.target.value)}
                                        placeholder="https://yourwebsite.com"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Speaking Experience */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Speaking Experience</h3>
                        <div>
                            <Label htmlFor="previousSpeakingExperience">Previous Speaking Experience</Label>
                            <Textarea
                                id="previousSpeakingExperience"
                                value={formData.previousSpeakingExperience}
                                onChange={(e) => handleInputChange('previousSpeakingExperience', e.target.value)}
                                placeholder="Tell us about your previous speaking engagements, conferences, workshops, etc."
                                rows={3}
                            />
                        </div>
                        <div>
                            <Label htmlFor="availability">Availability</Label>
                            <Input
                                id="availability"
                                value={formData.availability}
                                onChange={(e) => handleInputChange('availability', e.target.value)}
                                placeholder="When are you available to speak? (e.g., Weekends, Evenings, Specific dates)"
                            />
                        </div>
                        <div>
                            <Label htmlFor="specialRequirements">Special Requirements</Label>
                            <Textarea
                                id="specialRequirements"
                                value={formData.specialRequirements}
                                onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                                placeholder="Any special requirements or accommodations needed?"
                                rows={2}
                            />
                        </div>
                    </div>

                    {/* Portfolio */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Portfolio</h3>
                        <div>
                            <Label htmlFor="portfolio">Portfolio/Work Samples</Label>
                            <Input
                                id="portfolio"
                                value={formData.portfolio}
                                onChange={(e) => handleInputChange('portfolio', e.target.value)}
                                placeholder="Link to your portfolio, presentations, or work samples"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4 pt-6 border-t">
                        <Button
                            type="submit"
                            disabled={isSubmitting || formData.expertise.length === 0}
                            className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default SpeakerApplicationForm;
