import {
    Target,
    Users,
    Lightbulb,
    Globe,
    ArrowLeft,
    Linkedin,
    Twitter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
    const values = [
        {
            icon: Lightbulb,
            title: "Innovation",
            description: "We foster a culture of continuous innovation, encouraging creative thinking and breakthrough solutions that drive technological advancement."
        },
        {
            icon: Users,
            title: "Collaboration",
            description: "We believe in the power of collaboration, bringing together diverse minds to solve complex challenges and create meaningful impact."
        },
        {
            icon: Target,
            title: "Excellence",
            description: "We strive for excellence in everything we do, maintaining the highest standards of quality and delivering exceptional results."
        },
        {
            icon: Globe,
            title: "Global Impact",
            description: "We're committed to creating positive global impact through technology, connecting people and ideas across borders."
        }
    ];

    const team = [
        {
            name: "Dr. Sarah Chen",
            role: "CEO & Co-Founder",
            bio: "AI researcher with 15+ years of experience in machine learning and computer vision. Former Google AI researcher.",
            avatar: "/api/placeholder/120/120",
            linkedin: "#",
            twitter: "#"
        },
        {
            name: "Alex Rodriguez",
            role: "CTO & Co-Founder",
            bio: "Full-stack developer and blockchain expert. Led engineering teams at multiple successful startups.",
            avatar: "/api/placeholder/120/120",
            linkedin: "#",
            twitter: "#"
        },
        {
            name: "Priya Kapoor",
            role: "Head of Research",
            bio: "Data scientist and research lead with expertise in AI, machine learning, and statistical modeling.",
            avatar: "/api/placeholder/120/120",
            linkedin: "#",
            twitter: "#"
        },
        {
            name: "Michael Chen",
            role: "Head of Product",
            bio: "Product strategist with a passion for user-centered design and innovative technology solutions.",
            avatar: "/api/placeholder/120/120",
            linkedin: "#",
            twitter: "#"
        }
    ];

    const milestones = [
        {
            year: "2020",
            title: "Company Founded",
            description: "Trizen was founded with a vision to democratize access to cutting-edge technology and research."
        },
        {
            year: "2021",
            title: "First Major Partnership",
            description: "Established partnerships with leading universities and research institutions worldwide."
        },
        {
            year: "2022",
            title: "Global Expansion",
            description: "Expanded operations to 15 countries, building a diverse and inclusive community."
        },
        {
            year: "2023",
            title: "AI Innovation Award",
            description: "Received the prestigious AI Innovation Award for breakthrough research in machine learning."
        },
        {
            year: "2024",
            title: "Community Milestone",
            description: "Reached 10,000+ active community members across 25+ countries."
        },
        {
            year: "2025",
            title: "Future Vision",
            description: "Launching next-generation AI platform and expanding research initiatives globally."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50">
            <Navbar />

            {/* Back to Home Link */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center text-orange-600 hover:text-orange-700 transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </button>
            </div>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        About <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">Trizen</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Empowering innovators worldwide through collaborative learning, cutting-edge research, and impactful solutions.
                    </p>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="bg-white py-12 mb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12">
                        <Card className="p-8 rounded-2xl border-2 border-blue-200/50 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Target className="w-10 h-10 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    To democratize access to cutting-edge technology and research, empowering individuals and
                                    organizations worldwide to innovate, collaborate, and create meaningful impact through
                                    technology-driven solutions.
                                </p>
                            </div>
                        </Card>
                        <Card className="p-8 rounded-2xl border-2 border-orange-200/50 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Lightbulb className="w-10 h-10 text-orange-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    To be the leading global platform that connects innovators, researchers, and technology
                                    enthusiasts, fostering a collaborative ecosystem where breakthrough ideas become reality
                                    and drive positive change worldwide.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Values */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        These core values guide everything we do and shape our culture of innovation and excellence.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((value, index) => (
                        <Card key={index} className={`p-6 rounded-2xl border-2 shadow-lg text-center hover:shadow-xl transition-all hover:-translate-y-1 ${index % 2 === 0 ? 'border-blue-200/50' : 'border-orange-200/50'}`}>
                            <div className={`w-16 h-16 ${index % 2 === 0 ? 'bg-blue-100' : 'bg-orange-100'} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                                <value.icon className={`w-8 h-8 ${index % 2 === 0 ? 'text-blue-600' : 'text-orange-600'}`} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Team */}
            <div className="bg-white py-16 mb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Our diverse team of experts brings together decades of experience in technology, research, and innovation.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <Card key={index} className="p-6 rounded-2xl border-2 border-gray-200/50 shadow-lg text-center hover:shadow-xl transition-all hover:-translate-y-1">
                                <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-orange-100">
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                    <AvatarFallback className="bg-orange-500 text-white text-xl">
                                        {member.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                                <p className="text-orange-600 font-semibold mb-3">{member.role}</p>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.bio}</p>
                                <div className="flex justify-center space-x-3">
                                    <Button variant="outline" size="sm" className="border-gray-300 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50">
                                        <Linkedin className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" className="border-gray-300 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50">
                                        <Twitter className="w-4 h-4" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact CTA */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <Card className="p-12 rounded-2xl border-2 border-orange-200/50 shadow-lg text-center bg-gradient-to-br from-orange-50 to-orange-100/30">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to Join Our Mission?</h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Whether you're a researcher, developer, or innovator, we'd love to have you be part of our community.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg transition-colors duration-200"
                            onClick={() => window.location.href = '/contact'}
                        >
                            Get in Touch
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-lg transition-colors duration-200"
                            onClick={() => window.location.href = '/community'}
                        >
                            Join Community
                        </Button>
                    </div>
                </Card>
            </div>

            <Footer />
        </div>
    );
};

export default About;

