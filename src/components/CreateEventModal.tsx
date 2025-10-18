import { useState } from "react";
import { X, Calendar, MapPin, Clock, Users, DollarSign, Upload, Plus, Trash2 } from "lucide-react";
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
import { eventsService } from "@/services/events";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated?: () => void;
}

interface EventFormData {
  // Basic Information
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  type: string;
  difficulty: string;
  
  // Date and Time
  startDate: string;
  endDate: string;
  timezone: string;
  duration: number;
  
  // Location
  location: {
    venue: string;
    address: string;
    city: string;
    state: string;
    country: string;
    onlineLink: string;
    meetingId: string;
    meetingPassword: string;
  };
  
  // Pricing and Capacity
  price: number;
  currency: string;
  maxAttendees: number;
  
  // Event Settings
  status: string;
  isFeatured: boolean;
  isPublic: boolean;
  registrationOpen: boolean;
  requiresApproval: boolean;
  registrationDeadline: string;
  
  // Content
  coverImage: string;
  tags: string[];
  topics: string[];
  prerequisites: string[];
  requirements: string[];
  whatYouWillLearn: string[];
  targetAudience: string[];
  
  // Speakers
  speakers: Array<{
    name: string;
    title: string;
    company: string;
    bio: string;
    avatar: string;
    socialLinks: {
      linkedin: string;
      twitter: string;
      website: string;
    };
  }>;
}

const CreateEventModal = ({ isOpen, onClose, onEventCreated }: CreateEventModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  
  const [formData, setFormData] = useState<EventFormData>({
    // Basic Information
    title: "",
    description: "",
    shortDescription: "",
    category: "",
    type: "Online",
    difficulty: "All Levels",
    
    // Date and Time
    startDate: "",
    endDate: "",
    timezone: "UTC",
    duration: 60,
    
    // Location
    location: {
      venue: "",
      address: "",
      city: "",
      state: "",
      country: "",
      onlineLink: "",
      meetingId: "",
      meetingPassword: "",
    },
    
    // Pricing and Capacity
    price: 0,
    currency: "USD",
    maxAttendees: 50,
    
    // Event Settings
    status: "Draft",
    isFeatured: false,
    isPublic: true,
    registrationOpen: true,
    requiresApproval: false,
    registrationDeadline: "",
    
    // Content
    coverImage: "",
    tags: [],
    topics: [],
    prerequisites: [],
    requirements: [],
    whatYouWillLearn: [],
    targetAudience: [],
    
    // Speakers
    speakers: [],
  });

  const [newTag, setNewTag] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [newPrerequisite, setNewPrerequisite] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [newLearning, setNewLearning] = useState("");
  const [newAudience, setNewAudience] = useState("");

  const categories = ["Workshop", "Conference", "Meetup", "Webinar", "Training", "Hackathon", "Networking", "Other"];
  const types = ["Online", "In-Person", "Hybrid"];
  const difficulties = ["Beginner", "Intermediate", "Advanced", "All Levels"];
  const currencies = ["USD", "EUR", "GBP", "INR", "CAD", "AUD"];
  const statuses = ["Draft", "Published", "Cancelled", "Completed", "Postponed"];

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof EventFormData],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addArrayItem = (field: keyof EventFormData, value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()]
      }));
      setter("");
    }
  };

  const removeArrayItem = (field: keyof EventFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const addSpeaker = () => {
    setFormData(prev => ({
      ...prev,
      speakers: [...prev.speakers, {
        name: "",
        title: "",
        company: "",
        bio: "",
        avatar: "",
        socialLinks: {
          linkedin: "",
          twitter: "",
          website: "",
        }
      }]
    }));
  };

  const updateSpeaker = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      speakers: prev.speakers.map((speaker, i) => 
        i === index 
          ? field.includes('.')
            ? { ...speaker, [field.split('.')[0]]: { ...speaker[field.split('.')[0] as keyof typeof speaker], [field.split('.')[1]]: value } }
            : { ...speaker, [field]: value }
          : speaker
      )
    }));
  };

  const removeSpeaker = (index: number) => {
    setFormData(prev => ({
      ...prev,
      speakers: prev.speakers.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error("End date must be after start date");
      return;
    }

    if (new Date(formData.startDate) < new Date()) {
      toast.error("Start date cannot be in the past");
      return;
    }

    setIsLoading(true);
    try {
      await eventsService.createEvent(formData);
      toast.success("Event created successfully!");
      onEventCreated?.();
      onClose();
    } catch (error: any) {
      console.error('Create event error:', error);
      toast.error(error.message || "Failed to create event");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 mx-6 mt-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="speakers">Speakers</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Event Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleInputChange("title", e.target.value)}
                          placeholder="Enter event title"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                          <SelectTrigger>
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Describe your event in detail"
                        rows={4}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shortDescription">Short Description</Label>
                      <Textarea
                        id="shortDescription"
                        value={formData.shortDescription}
                        onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                        placeholder="Brief description for event cards"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Event Type *</Label>
                        <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {types.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty Level</Label>
                        <Select value={formData.difficulty} onValueChange={(value) => handleInputChange("difficulty", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {difficulties.map((difficulty) => (
                              <SelectItem key={difficulty} value={difficulty}>
                                {difficulty}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Date & Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date & Time *</Label>
                        <Input
                          id="startDate"
                          type="datetime-local"
                          value={formData.startDate}
                          onChange={(e) => handleInputChange("startDate", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date & Time *</Label>
                        <Input
                          id="endDate"
                          type="datetime-local"
                          value={formData.endDate}
                          onChange={(e) => handleInputChange("endDate", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={formData.duration}
                          onChange={(e) => handleInputChange("duration", parseInt(e.target.value) || 0)}
                          min="1"
                        />
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
                      <MapPin className="w-5 h-5 mr-2" />
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.type !== "Online" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="venue">Venue</Label>
                          <Input
                            id="venue"
                            value={formData.location.venue}
                            onChange={(e) => handleInputChange("location.venue", e.target.value)}
                            placeholder="Event venue name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={formData.location.address}
                            onChange={(e) => handleInputChange("location.address", e.target.value)}
                            placeholder="Street address"
                          />
                        </div>
                      </div>
                    )}

                    {formData.type !== "Online" && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={formData.location.city}
                            onChange={(e) => handleInputChange("location.city", e.target.value)}
                            placeholder="City"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State/Province</Label>
                          <Input
                            id="state"
                            value={formData.location.state}
                            onChange={(e) => handleInputChange("location.state", e.target.value)}
                            placeholder="State or Province"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={formData.location.country}
                            onChange={(e) => handleInputChange("location.country", e.target.value)}
                            placeholder="Country"
                          />
                        </div>
                      </div>
                    )}

                    {(formData.type === "Online" || formData.type === "Hybrid") && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="onlineLink">Online Meeting Link</Label>
                          <Input
                            id="onlineLink"
                            value={formData.location.onlineLink}
                            onChange={(e) => handleInputChange("location.onlineLink", e.target.value)}
                            placeholder="https://zoom.us/j/..."
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="meetingId">Meeting ID</Label>
                            <Input
                              id="meetingId"
                              value={formData.location.meetingId}
                              onChange={(e) => handleInputChange("location.meetingId", e.target.value)}
                              placeholder="Meeting ID"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="meetingPassword">Meeting Password</Label>
                            <Input
                              id="meetingPassword"
                              value={formData.location.meetingPassword}
                              onChange={(e) => handleInputChange("location.meetingPassword", e.target.value)}
                              placeholder="Meeting password"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Capacity & Pricing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="maxAttendees">Max Attendees *</Label>
                        <Input
                          id="maxAttendees"
                          type="number"
                          value={formData.maxAttendees}
                          onChange={(e) => handleInputChange("maxAttendees", parseInt(e.target.value) || 0)}
                          min="1"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem key={currency} value={currency}>
                                {currency}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Event Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Featured Event</Label>
                        <p className="text-sm text-gray-500">Show this event prominently</p>
                      </div>
                      <Switch
                        checked={formData.isFeatured}
                        onCheckedChange={(checked) => handleInputChange("isFeatured", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Public Event</Label>
                        <p className="text-sm text-gray-500">Visible to all users</p>
                      </div>
                      <Switch
                        checked={formData.isPublic}
                        onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Registration Open</Label>
                        <p className="text-sm text-gray-500">Allow users to register</p>
                      </div>
                      <Switch
                        checked={formData.registrationOpen}
                        onCheckedChange={(checked) => handleInputChange("registrationOpen", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Requires Approval</Label>
                        <p className="text-sm text-gray-500">Manual approval for registrations</p>
                      </div>
                      <Switch
                        checked={formData.requiresApproval}
                        onCheckedChange={(checked) => handleInputChange("requiresApproval", checked)}
                      />
                    </div>
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
                    <div className="space-y-2">
                      <Label htmlFor="coverImage">Cover Image URL</Label>
                      <Input
                        id="coverImage"
                        value={formData.coverImage}
                        onChange={(e) => handleInputChange("coverImage", e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addArrayItem("tags", newTag, setNewTag);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => addArrayItem("tags", newTag, setNewTag)}
                          size="sm"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeArrayItem("tags", index)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Topics</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newTopic}
                          onChange={(e) => setNewTopic(e.target.value)}
                          placeholder="Add a topic"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addArrayItem("topics", newTopic, setNewTopic);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => addArrayItem("topics", newTopic, setNewTopic)}
                          size="sm"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.topics.map((topic, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            {topic}
                            <button
                              type="button"
                              onClick={() => removeArrayItem("topics", index)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>What You'll Learn</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newLearning}
                          onChange={(e) => setNewLearning(e.target.value)}
                          placeholder="Add learning outcome"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addArrayItem("whatYouWillLearn", newLearning, setNewLearning);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => addArrayItem("whatYouWillLearn", newLearning, setNewLearning)}
                          size="sm"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-1">
                        {formData.whatYouWillLearn.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <span className="flex-1">{item}</span>
                            <button
                              type="button"
                              onClick={() => removeArrayItem("whatYouWillLearn", index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
                    <div className="flex items-center justify-between">
                      <CardTitle>Speakers</CardTitle>
                      <Button type="button" onClick={addSpeaker} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Speaker
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.speakers.map((speaker, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Speaker {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSpeaker(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Name</Label>
                            <Input
                              value={speaker.name}
                              onChange={(e) => updateSpeaker(index, "name", e.target.value)}
                              placeholder="Speaker name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                              value={speaker.title}
                              onChange={(e) => updateSpeaker(index, "title", e.target.value)}
                              placeholder="Job title"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Company</Label>
                            <Input
                              value={speaker.company}
                              onChange={(e) => updateSpeaker(index, "company", e.target.value)}
                              placeholder="Company name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Avatar URL</Label>
                            <Input
                              value={speaker.avatar}
                              onChange={(e) => updateSpeaker(index, "avatar", e.target.value)}
                              placeholder="https://example.com/avatar.jpg"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Bio</Label>
                          <Textarea
                            value={speaker.bio}
                            onChange={(e) => updateSpeaker(index, "bio", e.target.value)}
                            placeholder="Speaker bio"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>LinkedIn</Label>
                            <Input
                              value={speaker.socialLinks.linkedin}
                              onChange={(e) => updateSpeaker(index, "socialLinks.linkedin", e.target.value)}
                              placeholder="LinkedIn profile URL"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Twitter</Label>
                            <Input
                              value={speaker.socialLinks.twitter}
                              onChange={(e) => updateSpeaker(index, "socialLinks.twitter", e.target.value)}
                              placeholder="Twitter profile URL"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Website</Label>
                            <Input
                              value={speaker.socialLinks.website}
                              onChange={(e) => updateSpeaker(index, "socialLinks.website", e.target.value)}
                              placeholder="Personal website URL"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {formData.speakers.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No speakers added yet</p>
                        <p className="text-sm">Click "Add Speaker" to get started</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </Tabs>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
