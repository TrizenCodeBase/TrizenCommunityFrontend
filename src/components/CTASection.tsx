import { ArrowRight, Mail, Users, Sparkles, Globe, Star, User, Facebook, Linkedin, Instagram, CheckCircle, AlertCircle, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { subscriptionService } from "@/services/subscriptions";

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

const CTASection = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const { isAuthenticated, user } = useAuth();

  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const newsletterRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = [sectionRef.current, headerRef.current, newsletterRef.current, socialRef.current];
    elements.forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/trizenventures/" },
    { name: "X", icon: XIcon, href: "https://x.com/TrizenVenture" },
    { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/trizenventuresllp/" },
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/trizenventures/" },
    { name: "WhatsApp", icon: WhatsAppIcon, href: "https://whatsapp.com/channel/0029Vb6cKIp4SpkNdvBufo0g" }
  ];

  // Reset subscription status after 5 seconds
  useEffect(() => {
    if (subscriptionStatus === 'success' || subscriptionStatus === 'error') {
      const timer = setTimeout(() => {
        setSubscriptionStatus('idle');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [subscriptionStatus]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubscribing(true);
    setSubscriptionStatus('idle');

    try {
      // Test connection first with a simple fetch
      console.log('🧪 Testing backend connection...');
      try {
        const testResponse = await fetch('https://trizencommunitybackend.llp.trizenventures.com/api/subscriptions/guest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'test@example.com' })
        });
        console.log('🧪 Direct fetch test status:', testResponse.status);
        if (!testResponse.ok) {
          throw new Error(`Server returned ${testResponse.status}`);
        }
      } catch (testError) {
        console.error('🧪 Connection test failed:', testError);
        throw new Error('Cannot connect to server. Please check your internet connection.');
      }
      // Use guest subscription for everyone since it's working reliably
      console.log('🔍 Subscribing email:', email, isAuthenticated ? '(authenticated user)' : '(guest user)');
      try {
        const result = await subscriptionService.subscribeGuest(email);
        console.log('📡 Subscription result:', result);

        if (result && result.success) {
          console.log('✅ Subscription successful:', result.message);
          setSubscriptionStatus('success');
          setEmail("");
          alert(`Success: ${result.message}`);
        } else {
          console.log('❌ Subscription failed:', result?.message);
          setSubscriptionStatus('error');
          alert(`Error: ${result?.message || "Failed to subscribe"}`);
        }
      } catch (subscriptionError) {
        console.error('❌ Subscription service error:', subscriptionError);
        setSubscriptionStatus('error');
        alert(`Error: ${subscriptionError instanceof Error ? subscriptionError.message : "Failed to subscribe. Please try again."}`);
      }
    } catch (error) {
      console.error('❌ Subscription error:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      setSubscriptionStatus('error');
      alert(`Error: ${error instanceof Error ? error.message : "Failed to subscribe. Please try again."}`);
    } finally {
      setIsSubscribing(false);
    }
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
                disabled={isSubscribing}
                className="flex-1 h-11 px-4 bg-white border-0 text-gray-900 placeholder:text-gray-500 disabled:opacity-50"
              />
              <Button
                type="submit"
                disabled={isSubscribing}
                className="h-11 px-6 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200 whitespace-nowrap disabled:opacity-50"
              >
                {isSubscribing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Subscribing...
                  </>
                ) : subscriptionStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Subscribed!
                  </>
                ) : (
                  'Subscribe'
                )}
              </Button>
            </form>

            {/* Status Messages */}
            {subscriptionStatus === 'success' && (
              <div className="mt-3 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                <div className="flex items-center text-green-100 text-sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isAuthenticated
                    ? "Successfully subscribed to email updates!"
                    : "Thanks for subscribing! We'll send updates to your email."
                  }
                </div>
              </div>
            )}

            {subscriptionStatus === 'error' && (
              <div className="mt-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <div className="flex items-center text-red-100 text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Failed to subscribe. Please try again.
                </div>
              </div>
            )}
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