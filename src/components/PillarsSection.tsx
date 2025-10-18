import { useState } from "react";
import { ArrowRight, Globe, Lightbulb, Award, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthModal from "./AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const PillarsSection = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

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
      <section className="py-20 bg-white border-t border-gray-200" id="about">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
          {/* Clean Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Join TRIZEN Community
            </h2>

            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Connect with innovators, researchers, and learners worldwide. Be part of a collaborative ecosystem that drives innovation and creates lasting impact.
            </p>
          </div>

          {/* Professional Benefits Cards with Gradient Images - Adobe Style */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {benefits.map((benefit, index) => (
              <div key={index} className="rounded-2xl overflow-hidden group transition-all duration-300 shadow-md hover:shadow-2xl cursor-pointer">
                {/* Image with Bottom Dark Gradient Overlay - Adobe Style */}
                <div className="relative h-96 overflow-hidden">
                  <img
                    src={benefit.image}
                    alt={benefit.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      // Fallback to gradient if image fails
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {/* Dark Gradient Overlay - 30% from bottom with strong opacity - Adobe Style */}
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

                  {/* White text content inside gradient at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-7 text-white z-10">
                    <h3 className="text-2xl font-bold mb-2 leading-tight">
                      {benefit.title}
                    </h3>
                    <p className="text-sm leading-relaxed font-normal">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Clean Call to Action */}
          <div className="text-center">
            <div className="inline-flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button
                      size="default"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
                    >
                      Go to Dashboard
                      <User className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/events">
                    <Button
                      variant="outline"
                      size="default"
                      className="border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium px-6 py-2 rounded-lg transition-colors duration-200"
                    >
                      Browse Events
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    size="default"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
                  >
                    Join Community Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <Button
                    variant="outline"
                    size="default"
                    className="border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium px-6 py-2 rounded-lg transition-colors duration-200"
                  >
                    Learn More
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
