import { useState, useEffect } from "react";
import { X, Calendar, MapPin, Clock, Users, DollarSign, Upload, Plus, Trash2, Image as ImageIcon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { eventsService, Event, CreateEventData } from "@/services/events";
import { useAuth } from "@/contexts/AuthContext";

interface EditEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: Event | null;
    onEventUpdated?: () => void;
}

interface EventFormData extends CreateEventData {
    // Add any frontend-specific fields if necessary
}

const EditEventModal = ({ isOpen, onClose, event, onEventUpdated }: EditEventModalProps) => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("basic");

    const isAdmin = user?.isAdmin || false;

    const [formData, setFormData] = useState<EventFormData>({
        title: "",
        description: "",
        shortDescription: "",
        category: "Workshop",
        type: "Online",
        difficulty: "All Levels",
        startDate: "",
        endDate: "",
        timezone: "UTC",
        duration: 60,
        location: {
            venue: "", address: "", city: "", state: "", country: "",
            onlineLink: "", meetingId: "", meetingPassword: "",
        },
        price: 0,
        currency: "USD",
        maxAttendees: 50,
        status: "Published",
        isFeatured: false,
        isPublic: true,
        registrationOpen: true,
        requiresApproval: false,
        registrationDeadline: "",
        coverImage: "",
        tags: [], topics: [], prerequisites: [], requirements: [],
        whatYouWillLearn: [], targetAudience: [], speakers: [],
    });

    const [newTag, setNewTag] = useState("");
    const [newTopic, setNewTopic] = useState("");
    const [newPrerequisite, setNewPrerequisite] = useState("");
    const [newRequirement, setNewRequirement] = useState("");
    const [newWhatYouWillLearn, setNewWhatYouWillLearn] = useState("");
    const [newTargetAudience, setNewTargetAudience] = useState("");

    // Initialize form data when event changes
    useEffect(() => {
        if (event) {
            setFormData({
                title: event.title || "",
                description: event.description || "",
                shortDescription: event.shortDescription || "",
                category: event.category || "Workshop",
                type: event.type || "Online",
                difficulty: event.difficulty || "All Levels",
                startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : "",
                endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
                timezone: event.timezone || "UTC",
                duration: event.duration || 60,
                location: {
                    venue: event.location?.venue || "",
                    address: event.location?.address || "",
                    city: event.location?.city || "",
                    state: event.location?.state || "",
                    country: event.location?.country || "",
                    onlineLink: event.location?.onlineLink || "",
                    meetingId: event.location?.meetingId || "",
                    meetingPassword: event.location?.meetingPassword || "",
                },
                price: event.price || 0,
                currency: event.currency || "USD",
                maxAttendees: event.maxAttendees || 50,
                status: event.status || "Published",
                isFeatured: event.isFeatured || false,
                isPublic: event.isPublic || true,
                registrationOpen: event.registrationOpen || true,
                requiresApproval: event.requiresApproval || false,
                registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline).toISOString().slice(0, 16) : "",
                coverImage: event.coverImage || "",
                tags: event.tags || [],
                topics: event.topics || [],
                prerequisites: event.prerequisites || [],
                requirements: event.requirements || [],
                whatYouWillLearn: event.whatYouWillLearn || [],
                targetAudience: event.targetAudience || [],
                speakers: event.speakers || [],
            });
        }
    }, [event]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: keyof EventFormData, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            location: { ...prev.location, [name]: value }
        }));
    };

    const handleCheckboxChange = (name: keyof EventFormData, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const addToList = (listName: keyof EventFormData, newItem: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
        if (newItem.trim() && Array.isArray(formData[listName])) {
            setFormData(prev => ({
                ...prev,
                [listName]: [...(prev[listName] as string[]), newItem.trim()]
            }));
            setter("");
        }
    };

    const removeFromList = (listName: keyof EventFormData, index: number) => {
        if (Array.isArray(formData[listName])) {
            setFormData(prev => ({
                ...prev,
                [listName]: (prev[listName] as string[]).filter((_, i) => i !== index)
            }));
        }
    };

    const addSpeaker = () => {
        setFormData(prev => ({
            ...prev,
            speakers: [...(prev.speakers || []), { name: "", title: "", company: "", bio: "", image: "", socialLinks: {} }]
        }));
    };

    const updateSpeaker = (index: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            speakers: (prev.speakers || []).map((speaker, i) =>
                i === index ? { ...speaker, [field]: value } : speaker
            )
        }));
    };

    const removeSpeaker = (index: number) => {
        setFormData(prev => ({
            ...prev,
            speakers: (prev.speakers || []).filter((_, i) => i !== index)
        }));
    };

    const handleImageUrlChange = (url: string) => {
        setFormData(prev => ({
            ...prev,
            coverImage: url
        }));
    };

    const handleSpeakerImageUpload = (event: React.ChangeEvent<HTMLInputElement>, speakerIndex: number) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                updateSpeaker(speakerIndex, "image", result);
            };
            reader.readAsDataURL(file);
        }
    };

    const getDisplayImageUrl = (imageUrl: string) => {
        if (!imageUrl) return '';
        if (imageUrl.startsWith('data:image/')) {
            return `📷 Uploaded Image (${Math.round(imageUrl.length / 1024)}KB)`;
        }
        return imageUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAdmin) {
            toast.error("Only administrators can edit events");
            return;
        }

        if (!event) {
            toast.error("No event selected for editing");
            return;
        }

        // Validation
        const errors: string[] = [];

        if (!formData.title || formData.title.trim().length < 5) {
            errors.push('Title must be at least 5 characters');
        }
        if (formData.title && formData.title.trim().length > 100) {
            errors.push('Title cannot exceed 100 characters');
        }

        if (!formData.description || formData.description.trim().length < 20) {
            errors.push('Description must be at least 20 characters');
        }
        if (formData.description && formData.description.trim().length > 2000) {
            errors.push('Description cannot exceed 2000 characters');
        }

        if (!formData.category) {
            errors.push('Category is required');
        }

        if (!formData.type) {
            errors.push('Event type is required');
        }

        if (!formData.startDate) {
            errors.push('Start date is required');
        }

        if (!formData.endDate) {
            errors.push('End date is required');
        }

        if (!formData.maxAttendees || formData.maxAttendees < 1) {
            errors.push('Maximum attendees must be at least 1');
        }

        if (formData.price && formData.price < 0) {
            errors.push('Price cannot be negative');
        }

        if (errors.length > 0) {
            toast.error(errors.join(', '));
            return;
        }

        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
            toast.error("End date must be after start date");
            return;
        }

        setIsLoading(true);
        try {
            const eventData: CreateEventData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                category: formData.category,
                type: formData.type,
                startDate: formData.startDate,
                endDate: formData.endDate,
                maxAttendees: formData.maxAttendees,
                price: formData.price || 0,
                ...(formData.shortDescription && { shortDescription: formData.shortDescription.trim() }),
                ...(formData.difficulty && { difficulty: formData.difficulty }),
                ...(formData.timezone && { timezone: formData.timezone }),
                ...(formData.duration && { duration: formData.duration }),
                ...(formData.location && Object.keys(formData.location).some(key => formData.location[key]) && { location: formData.location }),
                ...(formData.currency && { currency: formData.currency }),
                ...(formData.status && { status: formData.status }),
                ...(formData.isFeatured !== undefined && { isFeatured: formData.isFeatured }),
                ...(formData.isPublic !== undefined && { isPublic: formData.isPublic }),
                ...(formData.registrationOpen !== undefined && { registrationOpen: formData.registrationOpen }),
                ...(formData.requiresApproval !== undefined && { requiresApproval: formData.requiresApproval }),
                ...(formData.registrationDeadline && { registrationDeadline: formData.registrationDeadline }),
                ...(formData.coverImage && { coverImage: formData.coverImage }),
                ...(formData.tags.length > 0 && { tags: formData.tags }),
                ...(formData.topics.length > 0 && { topics: formData.topics }),
                ...(formData.prerequisites.length > 0 && { prerequisites: formData.prerequisites }),
                ...(formData.requirements.length > 0 && { requirements: formData.requirements }),
                ...(formData.whatYouWillLearn.length > 0 && { whatYouWillLearn: formData.whatYouWillLearn }),
                ...(formData.targetAudience.length > 0 && { targetAudience: formData.targetAudience }),
                ...(formData.speakers.length > 0 && { speakers: formData.speakers })
            };

            console.log('Updating event data:', eventData);
            const updatedEvent = await eventsService.updateEvent(event._id, eventData);
            console.log('Event updated successfully:', updatedEvent);
            toast.success("Event updated successfully!");
            onEventUpdated?.();
            onClose();
        } catch (error: any) {
            console.error('Update event error:', error);
            let errorMessage = "Failed to update event";
            if (error.message) {
                errorMessage = error.message;
            }
            if (error.message && error.message.includes('Validation failed')) {
                errorMessage = "Please check all required fields and try again";
            }
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !event) return null;
    if (!isAdmin) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-gray-900">Edit Event</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                        <div className="px-4 sm:px-6 mt-4 flex-shrink-0">
                            <TabsList className="grid w-full grid-cols-4 h-auto">
                                <TabsTrigger value="basic" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Basic Info</TabsTrigger>
                                <TabsTrigger value="details" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Details</TabsTrigger>
                                <TabsTrigger value="content" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Content</TabsTrigger>
                                <TabsTrigger value="speakers" className="text-xs sm:text-sm px-2 sm:px-3 py-2">Speakers</TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                            {/* Basic Information Tab */}
                            <TabsContent value="basic" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Settings className="w-5 h-5 mr-2 text-primary" /> Basic Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Event Title <span className="text-red-500">*</span></Label>
                                            <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Annual Tech Conference 2024" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                                            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="A detailed description of the event..." rows={5} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="shortDescription">Short Description</Label>
                                            <Textarea id="shortDescription" name="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="A brief summary for listings..." rows={2} />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                                                <Select name="category" value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {['Workshop', 'Conference', 'Meetup', 'Webinar', 'Training', 'Hackathon', 'Networking', 'Other'].map(cat => (
                                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="type">Event Type <span className="text-red-500">*</span></Label>
                                                <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {['Online', 'In-Person', 'Hybrid'].map(type => (
                                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="difficulty">Difficulty Level</Label>
                                                <Select name="difficulty" value={formData.difficulty} onValueChange={(value) => handleSelectChange('difficulty', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Difficulty" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {['Beginner', 'Intermediate', 'Advanced', 'All Levels'].map(diff => (
                                                            <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="status">Event Status</Label>
                                                <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {['Draft', 'Published', 'Cancelled', 'Completed', 'Postponed'].map(status => (
                                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Details Tab */}
                            <TabsContent value="details" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Calendar className="w-5 h-5 mr-2 text-primary" /> Date & Time
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="startDate">Start Date & Time <span className="text-red-500">*</span></Label>
                                            <Input type="datetime-local" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="endDate">End Date & Time <span className="text-red-500">*</span></Label>
                                            <Input type="datetime-local" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="timezone">Timezone</Label>
                                            <Input id="timezone" name="timezone" value={formData.timezone} onChange={handleChange} placeholder="e.g., UTC, Asia/Kolkata" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="duration">Duration (minutes)</Label>
                                            <Input type="number" id="duration" name="duration" value={formData.duration} onChange={handleChange} min="1" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <MapPin className="w-5 h-5 mr-2 text-primary" /> Location
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {formData.type !== 'Online' && (
                                            <>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="venue">Venue Name</Label>
                                                        <Input id="venue" name="venue" value={formData.location.venue} onChange={handleLocationChange} placeholder="e.g., Convention Center" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="address">Address</Label>
                                                        <Input id="address" name="address" value={formData.location.address} onChange={handleLocationChange} placeholder="e.g., 123 Main St" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="city">City</Label>
                                                        <Input id="city" name="city" value={formData.location.city} onChange={handleLocationChange} placeholder="e.g., Hyderabad" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="state">State</Label>
                                                        <Input id="state" name="state" value={formData.location.state} onChange={handleLocationChange} placeholder="e.g., Telangana" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="country">Country</Label>
                                                        <Input id="country" name="country" value={formData.location.country} onChange={handleLocationChange} placeholder="e.g., India" />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {(formData.type === 'Online' || formData.type === 'Hybrid') && (
                                            <div className="space-y-2">
                                                <Label htmlFor="onlineLink">Online Meeting Link</Label>
                                                <Input id="onlineLink" name="onlineLink" value={formData.location.onlineLink} onChange={handleLocationChange} placeholder="e.g., https://zoom.us/j/..." />
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Users className="w-5 h-5 mr-2 text-primary" /> Capacity & Pricing
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="maxAttendees">Max Attendees <span className="text-red-500">*</span></Label>
                                            <Input type="number" id="maxAttendees" name="maxAttendees" value={formData.maxAttendees} onChange={handleChange} min="1" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="price">Price</Label>
                                            <Input type="number" id="price" name="price" value={formData.price} onChange={handleChange} min="0" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="currency">Currency</Label>
                                            <Select name="currency" value={formData.currency} onValueChange={(value) => handleSelectChange('currency', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Currency" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'].map(curr => (
                                                        <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Settings className="w-5 h-5 mr-2 text-primary" /> Event Settings
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="isPublic">Public Event</Label>
                                            <Switch id="isPublic" checked={formData.isPublic} onCheckedChange={(checked) => handleCheckboxChange('isPublic', checked)} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="isFeatured">Featured Event</Label>
                                            <Switch id="isFeatured" checked={formData.isFeatured} onCheckedChange={(checked) => handleCheckboxChange('isFeatured', checked)} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="registrationOpen">Registration Open</Label>
                                            <Switch id="registrationOpen" checked={formData.registrationOpen} onCheckedChange={(checked) => handleCheckboxChange('registrationOpen', checked)} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="requiresApproval">Requires Approval</Label>
                                            <Switch id="requiresApproval" checked={formData.requiresApproval} onCheckedChange={(checked) => handleCheckboxChange('requiresApproval', checked)} />
                                        </div>
                                        {formData.registrationOpen && (
                                            <div className="space-y-2">
                                                <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                                                <Input type="datetime-local" id="registrationDeadline" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleChange} />
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Content Tab */}
                            <TabsContent value="content" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Event Content</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-4">
                                            <Label>Cover Image</Label>

                                            {formData.coverImage && (
                                                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                                                    <img
                                                        src={formData.coverImage}
                                                        alt="Event cover preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleImageUrlChange("")}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}

                                            <div className="space-y-3">
                                                <div className="flex-1">
                                                    <Input
                                                        placeholder="Paste image URL"
                                                        value={formData.coverImage}
                                                        onChange={(e) => handleImageUrlChange(e.target.value)}
                                                    />
                                                </div>

                                                <p className="text-sm text-gray-500">
                                                    Paste an image URL. Recommended size: 800x400px
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Tags</Label>
                                            <div className="flex gap-2 mb-2">
                                                <Input
                                                    placeholder="Add a tag"
                                                    value={newTag}
                                                    onChange={(e) => setNewTag(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && addToList('tags', newTag, setNewTag)}
                                                />
                                                <Button type="button" onClick={() => addToList('tags', newTag, setNewTag)}>Add</Button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.tags.map((tag, index) => (
                                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                        {tag}
                                                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeFromList('tags', index)} />
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Topics</Label>
                                            <div className="flex gap-2 mb-2">
                                                <Input
                                                    placeholder="Add a topic"
                                                    value={newTopic}
                                                    onChange={(e) => setNewTopic(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && addToList('topics', newTopic, setNewTopic)}
                                                />
                                                <Button type="button" onClick={() => addToList('topics', newTopic, setNewTopic)}>Add</Button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.topics.map((topic, index) => (
                                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                        {topic}
                                                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeFromList('topics', index)} />
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Prerequisites</Label>
                                            <div className="flex gap-2 mb-2">
                                                <Input
                                                    placeholder="Add a prerequisite"
                                                    value={newPrerequisite}
                                                    onChange={(e) => setNewPrerequisite(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && addToList('prerequisites', newPrerequisite, setNewPrerequisite)}
                                                />
                                                <Button type="button" onClick={() => addToList('prerequisites', newPrerequisite, setNewPrerequisite)}>Add</Button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.prerequisites.map((item, index) => (
                                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                        {item}
                                                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeFromList('prerequisites', index)} />
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Requirements</Label>
                                            <div className="flex gap-2 mb-2">
                                                <Input
                                                    placeholder="Add a requirement"
                                                    value={newRequirement}
                                                    onChange={(e) => setNewRequirement(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && addToList('requirements', newRequirement, setNewRequirement)}
                                                />
                                                <Button type="button" onClick={() => addToList('requirements', newRequirement, setNewRequirement)}>Add</Button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.requirements.map((item, index) => (
                                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                        {item}
                                                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeFromList('requirements', index)} />
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>What You Will Learn</Label>
                                            <div className="flex gap-2 mb-2">
                                                <Input
                                                    placeholder="Add a learning outcome"
                                                    value={newWhatYouWillLearn}
                                                    onChange={(e) => setNewWhatYouWillLearn(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && addToList('whatYouWillLearn', newWhatYouWillLearn, setNewWhatYouWillLearn)}
                                                />
                                                <Button type="button" onClick={() => addToList('whatYouWillLearn', newWhatYouWillLearn, setNewWhatYouWillLearn)}>Add</Button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.whatYouWillLearn.map((item, index) => (
                                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                        {item}
                                                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeFromList('whatYouWillLearn', index)} />
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Target Audience</Label>
                                            <div className="flex gap-2 mb-2">
                                                <Input
                                                    placeholder="Add target audience"
                                                    value={newTargetAudience}
                                                    onChange={(e) => setNewTargetAudience(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && addToList('targetAudience', newTargetAudience, setNewTargetAudience)}
                                                />
                                                <Button type="button" onClick={() => addToList('targetAudience', newTargetAudience, setNewTargetAudience)}>Add</Button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.targetAudience.map((item, index) => (
                                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                        {item}
                                                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeFromList('targetAudience', index)} />
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Speakers Tab */}
                            <TabsContent value="speakers" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Users className="w-5 h-5 mr-2 text-primary" /> Speakers
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {formData.speakers.map((speaker, index) => (
                                            <div key={index} className="border p-4 rounded-lg space-y-3 relative">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeSpeaker(index)}
                                                    className="absolute top-2 right-2 text-red-500 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor={`speaker-name-${index}`}>Name</Label>
                                                        <Input
                                                            id={`speaker-name-${index}`}
                                                            value={speaker.name}
                                                            onChange={(e) => updateSpeaker(index, 'name', e.target.value)}
                                                            placeholder="Speaker Name"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor={`speaker-title-${index}`}>Title</Label>
                                                        <Input
                                                            id={`speaker-title-${index}`}
                                                            value={speaker.title}
                                                            onChange={(e) => updateSpeaker(index, 'title', e.target.value)}
                                                            placeholder="Job Title"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor={`speaker-company-${index}`}>Company</Label>
                                                    <Input
                                                        id={`speaker-company-${index}`}
                                                        value={speaker.company}
                                                        onChange={(e) => updateSpeaker(index, 'company', e.target.value)}
                                                        placeholder="Company Name"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor={`speaker-image-${index}`}>Speaker Image</Label>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center space-x-2">
                                                            <Input
                                                                id={`speaker-image-${index}`}
                                                                value={getDisplayImageUrl(speaker.image || '')}
                                                                onChange={(e) => {
                                                                    // Only allow manual URL entry if it's not a base64 image
                                                                    if (!e.target.value.startsWith('data:image/')) {
                                                                        updateSpeaker(index, 'image', e.target.value);
                                                                    }
                                                                }}
                                                                placeholder="https://example.com/speaker-image.jpg"
                                                                className="flex-1"
                                                                readOnly={speaker.image?.startsWith('data:image/')}
                                                            />
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => handleSpeakerImageUpload(e, index)}
                                                                className="hidden"
                                                                id={`speaker-upload-${index}`}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => document.getElementById(`speaker-upload-${index}`)?.click()}
                                                                className="flex items-center space-x-1"
                                                            >
                                                                <Upload className="w-4 h-4" />
                                                                <span>Upload</span>
                                                            </Button>
                                                            {speaker.image && (
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => updateSpeaker(index, "image", "")}
                                                                    className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                    <span>Clear</span>
                                                                </Button>
                                                            )}
                                                        </div>
                                                        {speaker.image && (
                                                            <div className="mt-2">
                                                                <img
                                                                    src={speaker.image}
                                                                    alt="Speaker preview"
                                                                    className="w-16 h-16 object-cover rounded-lg border"
                                                                    onError={(e) => {
                                                                        e.currentTarget.style.display = 'none';
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor={`speaker-bio-${index}`}>Bio</Label>
                                                    <Textarea
                                                        id={`speaker-bio-${index}`}
                                                        value={speaker.bio}
                                                        onChange={(e) => updateSpeaker(index, 'bio', e.target.value)}
                                                        placeholder="Speaker biography..."
                                                        rows={3}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        <Button type="button" onClick={addSpeaker} variant="outline" className="w-full">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Speaker
                                        </Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </div>
                    </Tabs>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 flex-shrink-0">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary-dark">
                            {isLoading ? "Updating..." : "Update Event"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEventModal;

