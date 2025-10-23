import { useState, useEffect, useRef } from "react";
import { ArrowRight, Globe, Lightbulb, Award, User, Sparkles, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AuthModal from "./AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const PillarsSection = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const { isAuthenticated, user } = useAuth();

  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

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

    const elements = [sectionRef.current, headerRef.current, cardsRef.current, ctaRef.current];
    elements.forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const benefits = [
    {
      icon: Award,
      title: "Training",
      description: "Enhance your skills through comprehensive training programs, workshops, and mentorship opportunities designed for professional growth",
      gradient: "from-blue-500 to-blue-600",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop"
    },
    {
      icon: Globe,
      title: "Research",
      description: "Engage in groundbreaking research initiatives, access state-of-the-art facilities, and collaborate with leading experts in your field",
      gradient: "from-orange-500 to-orange-600",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop"
    },
    {
      icon: Lightbulb,
      title: "Solutions",
      description: "Develop innovative solutions to real-world problems through collaborative projects and cutting-edge technology implementations",
      gradient: "from-blue-500 to-blue-600",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop"
    }
  ];

  return (
    <>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultTab="signup" />
      <section
        ref={sectionRef}
        id="pillars-section"
        className="py-24 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden"
      >
        {/* Enhanced Professional Background with ASP Events-inspired design */}
        <div className="absolute inset-0">
          {/* Animated gradient orbs */}
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-blue-600/10 rounded-full blur-3xl animate-pulse" style={{
            animation: 'float 8s ease-in-out infinite',
            animationDelay: '0s'
          }}></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-orange-400/20 to-orange-600/10 rounded-full blur-3xl animate-pulse" style={{
            animation: 'float 10s ease-in-out infinite',
            animationDelay: '2s'
          }}></div>

          {/* Secondary floating elements */}
          <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-br from-blue-300/15 to-blue-500/8 rounded-full blur-2xl animate-pulse" style={{
            animation: 'float 7s ease-in-out infinite',
            animationDelay: '1s'
          }}></div>
          <div className="absolute bottom-1/3 right-1/3 w-56 h-56 bg-gradient-to-tl from-orange-300/15 to-orange-500/8 rounded-full blur-2xl animate-pulse" style={{
            animation: 'float 9s ease-in-out infinite',
            animationDelay: '3s'
          }}></div>
        </div>

        {/* Enhanced overlay with subtle patterns */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/90 to-white/70"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(249, 115, 22, 0.05) 0%, transparent 50%)
          `,
          backgroundSize: '400px 400px'
        }}></div>

        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
          {/* Enhanced Section Header with ASP Events-inspired design */}
          <div
            ref={headerRef}
            id="pillars-header"
            className={`text-center mb-20 transition-all duration-1000 ${visibleElements.has('pillars-header')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
              }`}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Join <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent animate-gradient">TRIZEN</span> Community
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Connect with innovators, researchers, and learners worldwide. Be part of a collaborative ecosystem that drives innovation and creates lasting impact.
            </p>

          </div>

          {/* Enhanced Professional Benefits Cards with ASP Events-inspired design */}
          <div
            ref={cardsRef}
            id="pillars-cards"
            className={`grid md:grid-cols-3 gap-10 mb-24 transition-all duration-1000 delay-200 ${visibleElements.has('pillars-cards')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
              }`}
          >
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="rounded-2xl overflow-hidden group transition-all duration-500 shadow-xl hover:shadow-2xl cursor-pointer hover:-translate-y-3 bg-white/95 backdrop-blur-xl border border-gray-200/50 hover:border-blue-300/50"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.90) 100%)',
                  backdropFilter: 'blur(20px)',
                  animationDelay: `${index * 200}ms`,
                  animation: visibleElements.has('pillars-cards') ? 'fadeInUp 0.8s ease-out forwards' : 'none'
                }}
              >
                {/* Enhanced Professional Image */}
                <div className="relative h-96 overflow-hidden">
                  <img
                    src={benefit.image}
                    alt={benefit.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />

                  {/* Enhanced Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Enhanced Color Gradients */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-2/5"
                    style={{
                      background: `linear-gradient(to top, ${benefit.gradient.includes('blue-500')
                        ? 'rgba(37, 99, 235, 0.95)'
                        : benefit.gradient.includes('orange-500')
                          ? 'rgba(249, 115, 22, 0.95)'
                          : 'rgba(59, 130, 246, 0.95)'
                        } 0%, ${benefit.gradient.includes('blue-500')
                          ? 'rgba(37, 99, 235, 0.7)'
                          : benefit.gradient.includes('orange-500')
                            ? 'rgba(249, 115, 22, 0.7)'
                            : 'rgba(249, 115, 22, 0.7)'
                        } 60%, transparent 100%)`
                    }}
                  ></div>

                  {/* Enhanced Content with better typography */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-30">
                    <h3 className="text-2xl font-bold mb-3 leading-tight group-hover:text-white transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-base leading-relaxed opacity-95 group-hover:opacity-100 transition-opacity duration-300">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Professional Call to Action with scroll animations */}
          <div
            ref={ctaRef}
            id="pillars-cta"
            className={`text-center transition-all duration-1000 delay-400 ${visibleElements.has('pillars-cta')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
              }`}
          >
            <div className="inline-flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg"
                    >
                      Go to Dashboard
                      <User className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/events">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      Browse Events
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg"
                  >
                    Join Community Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => window.location.href = '/community'}
                    className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400 font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PillarsSection;
