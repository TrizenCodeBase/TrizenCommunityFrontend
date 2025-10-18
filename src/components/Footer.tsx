import { MessageSquare, Calendar, LayoutDashboard, Info, Mail, Heart, ArrowRight, Linkedin, Twitter, Facebook, Instagram, Globe, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const quickLinks = [
    { name: "MVP", href: "#mvp" },
    { name: "Find a chapter", href: "#find-chapter" },
    { name: "Start A Chapter", href: "#start-chapter" },
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms & Conditions", href: "#terms" },
    { name: "Contact Us", href: "#contact" },
    { name: "Code of Conduct", href: "#code-of-conduct" }
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/trizenventures/" },
    { name: "Twitter", icon: Twitter, href: "https://x.com/TrizenVenture" },
    { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/trizenventuresllp/" },
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/trizenventures/" }
  ];

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-16">

        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand Column with Logo and Tagline */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <img
                src="/trizen-banner.png"
                alt="TRIZEN Community"
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Collaborate, Learn, and Build through Solutions, Research, and Training.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-bold text-white mb-6 text-base tracking-wide">QUICK LINKS</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center"
                  >
                    <span className="mr-2">›</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Column */}
          <div>
            <h3 className="font-bold text-white mb-6 text-base tracking-wide">SOCIAL</h3>
            <p className="text-blue-400 text-sm mb-6 font-medium"></p>

            {/* Social Icons */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;