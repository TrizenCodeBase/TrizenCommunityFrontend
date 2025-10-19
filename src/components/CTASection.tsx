import { ArrowRight, Mail, Users, Sparkles, Globe, Star, User, Facebook, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

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

const CTASection = () => {
  const [email, setEmail] = useState("");
  const { isAuthenticated, user } = useAuth();

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/trizenventures/" },
    { name: "X", icon: XIcon, href: "https://x.com/TrizenVenture" },
    { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/trizenventuresllp/" },
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/trizenventures/" }
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thanks for subscribing! We'll send updates to ${email}`);
    setEmail("");
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 to-orange-500 relative overflow-hidden" id="cta">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 1px, transparent 1px),
                          radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Tight, Centered Content */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Join Our Innovation Community
          </h2>
          <p className="text-base text-white/90 max-w-2xl mx-auto leading-relaxed">
            Connect with innovators worldwide. Access exclusive workshops, collaborate on research, and accelerate your growth.
          </p>
        </div>

        {/* Newsletter Signup - Compact & Professional */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-center mb-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white text-center mb-2">Stay Updated</h3>
            <p className="text-sm text-white/80 text-center mb-5">
              Get latest events and opportunities in your inbox
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 h-11 px-4 bg-white border-0 text-gray-900 placeholder:text-gray-500"
              />
              <Button
                type="submit"
                className="h-11 px-6 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200 whitespace-nowrap"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* CTA Buttons - Clean & Tight */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-10">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button
                  size="default"
                  className="bg-white hover:bg-gray-100 text-blue-600 font-semibold px-6 py-2.5 rounded-lg transition-colors duration-200"
                >
                  Welcome back, {user?.name?.split(' ')[0]}!
                  <User className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/events">
                <Button
                  variant="outline"
                  size="default"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/20 hover:border-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-200"
                >
                  Browse Events
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Button
                size="default"
                className="bg-white hover:bg-gray-100 text-blue-600 font-semibold px-6 py-2.5 rounded-lg transition-colors duration-200"
                onClick={() => {
                  // This would typically open a signup modal or navigate to signup
                  window.location.href = '/#signup';
                }}
              >
                Join Community
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="default"
                className="bg-transparent border-2 border-white text-white hover:bg-white/20 hover:border-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-200"
                onClick={() => {
                  const eventsSection = document.getElementById('events');
                  eventsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                Browse Events
              </Button>
            </>
          )}
        </div>

        {/* Social Links - Compact */}
        <div className="text-center">
          <p className="text-sm text-white/70 mb-4">Follow us</p>
          <div className="flex justify-center gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white transition-all duration-200 flex items-center justify-center"
                aria-label={social.name}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
