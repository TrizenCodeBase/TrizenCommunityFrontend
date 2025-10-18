import { useState } from "react";
import { ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthModal from "./AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultTab="signup" />
      <section className="relative min-h-screen overflow-hidden">
        {/* Stunning HD Background Image - Innovation & Technology Theme */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}></div>

        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-blue-800/80 to-orange-900/75"></div>

        {/* Floating Geometric Elements */}
        <div className="absolute inset-0">
          {/* Large Floating Orbs */}
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

          {/* Medium Floating Elements */}
          <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-br from-orange-300/15 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/3 right-1/3 w-56 h-56 bg-gradient-to-tl from-blue-300/15 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>

        {/* Subtle Tech Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(255, 107, 53, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(0, 74, 173, 0.3) 0%, transparent 50%)
        `,
          backgroundSize: '200px 200px'
        }}></div>

        {/* Premium Glass Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 py-32">
          <div className="text-center space-y-12">

            {/* Main Heading with Premium Styling */}
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white drop-shadow-2xl">
                Join Our Global
                <br />
                <span className="text-orange-400 drop-shadow-2xl">Community of</span>
                <br />
                <span className="text-blue-300 drop-shadow-2xl">Innovators</span>
              </h1>

              <p className="text-xl text-slate-200 leading-relaxed max-w-3xl mx-auto font-normal drop-shadow-lg">
                Collaborate, Learn, and Build through Solutions, Research, and Training.
                Connect with like-minded professionals and accelerate your innovation journey.
              </p>
            </div>

            {/* Premium CTA Buttons with Glass Effect */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button
                      size="lg"
                      className="group bg-orange-500/90 hover:bg-orange-500 text-white font-semibold px-12 py-4 rounded-xl shadow-2xl hover:shadow-orange-500/50 backdrop-blur-sm border border-orange-400/30 transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                    >
                      Welcome back, {user?.name?.split(' ')[0]}!
                      <User className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/events">
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-transparent border-2 border-white/80 text-white hover:border-white hover:bg-transparent font-semibold px-12 py-4 rounded-xl shadow-xl hover:shadow-white/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                    >
                      Explore Events
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="group bg-orange-500/90 hover:bg-orange-500 text-white font-semibold px-12 py-4 rounded-xl shadow-2xl hover:shadow-orange-500/50 backdrop-blur-sm border border-orange-400/30 transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                  >
                    Join the Community
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      const eventsSection = document.getElementById('events');
                      eventsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="bg-transparent border-2 border-white/80 text-white hover:border-white hover:bg-transparent font-semibold px-12 py-4 rounded-xl shadow-xl hover:shadow-white/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                  >
                    Explore Events
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

export default HeroSection;