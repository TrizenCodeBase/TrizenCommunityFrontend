import { MessageSquare, Calendar, LayoutDashboard, Info, Mail, Heart, ArrowRight, Linkedin, Facebook, Instagram, Globe, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const Footer = () => {
  const footerSections = {
    about: {
      title: "About Trizen",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Team", href: "/team" },
        { name: "Contact", href: "/contact" }
      ]
    },
    solutions: {
      title: "Solutions",
      links: [
        { name: "Web Development", href: "/services/web-development" },
        { name: "Android Apps", href: "/services/android-apps" },
        { name: "AI/ML Services", href: "/services/ai-ml" },
        { name: "Consulting", href: "/services/consulting" }
      ]
    },
    products: {
      title: "Products",
      links: [
        { name: "Courses", href: "https://courses.trizenventures.com/" },
        { name: "Blog", href: "https://blogs.trizenventures.com/" },
        { name: "Community", href: "https://community.trizenventures.com/" },
        { name: "Academy", href: "https://academy.trizenventures.com/" }
      ]
    },
    resources: {
      title: "Resources",
      links: [
        { name: "Blog", href: "https://blogs.trizenventures.com/" },
        { name: "Portfolio", href: "/portfolio" },
        { name: "Case Studies", href: "/case-studies" },
        { name: "Community", href: "https://community.trizenventures.com/" }
      ]
    },
    support: {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Contact", href: "/contact" },
        { name: "FAQ", href: "/faq" },
        { name: "Report Bug", href: "/report-bug" }
      ]
    },
    account: {
      title: "Account",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "My Account", href: "/dashboard" },
        { name: "Create Account", href: "/signup" }
      ]
    }
  };

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/trizenventures/" },
    { name: "X", icon: XIcon, href: "https://x.com/TrizenVenture" },
    { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/trizenventuresllp/" },
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/trizenventures/" },
    { name: "WhatsApp", icon: WhatsAppIcon, href: "https://whatsapp.com/channel/0029Vb6cKIp4SpkNdvBufo0g" }
  ];

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-16">
        {/* Main Footer Content - Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* About Trizen */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{footerSections.about.title}</h3>
            <ul className="space-y-2">
              {footerSections.about.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{footerSections.solutions.title}</h3>
            <ul className="space-y-2">
              {footerSections.solutions.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{footerSections.products.title}</h3>
            <ul className="space-y-2">
              {footerSections.products.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    target={link.href.startsWith('http') ? '_blank' : '_self'}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{footerSections.resources.title}</h3>
            <ul className="space-y-2">
              {footerSections.resources.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    target={link.href.startsWith('http') ? '_blank' : '_self'}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{footerSections.support.title}</h3>
            <ul className="space-y-2">
              {footerSections.support.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{footerSections.account.title}</h3>
            <ul className="space-y-2">
              {footerSections.account.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="border-t border-slate-800 pt-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-gray-300 hover:text-white transition-all duration-200 flex items-center justify-center"
                    aria-label={social.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Trizen Ventures. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;