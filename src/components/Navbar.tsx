import { Calendar, Info, Mail, Search, Menu, X, FileText, User, LogOut, Settings, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import NotificationCenter from "./NotificationCenter";
import { eventsService } from "@/services/events";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isResourcesModalOpen, setIsResourcesModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Debug search modal state
  console.log('Search modal state:', isSearchModalOpen);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: "Events", href: "/events", icon: Calendar },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  // Search functionality
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Search through navigation links
      const navResults = navLinks.filter(link =>
        link.name.toLowerCase().includes(query.toLowerCase())
      ).map(link => ({
        type: 'navigation',
        title: link.name,
        description: `Navigate to ${link.name} page`,
        href: link.href,
        icon: link.icon
      }));

      // Search through events
      let eventResults = [];
      try {
        const eventsResponse = await eventsService.getEvents({ search: query, limit: 5 });
        eventResults = eventsResponse.events.map(event => ({
          type: 'event',
          title: event.title,
          description: `${event.category} • ${new Date(event.startDate).toLocaleDateString()}`,
          href: `/events/${event._id}`,
          icon: Calendar
        }));
      } catch (error) {
        console.log('Events search failed, continuing with navigation results only');
      }

      // Combine results
      const results = [...navResults, ...eventResults];
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleSearchResultClick = (result: any) => {
    if (result.href) {
      navigate(result.href);
      setIsSearchModalOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  return (
    <>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultTab="login" />

      {/* Resources Coming Soon Modal */}
      {isResourcesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsResourcesModalOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Resources</h3>
              <button
                onClick={() => setIsResourcesModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon!</h4>
              <p className="text-gray-600">
                We're working hard to bring you valuable resources. Stay tuned for updates!
              </p>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => setIsResourcesModalOpen(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20" style={{ zIndex: 9999 }}>
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsSearchModalOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Search</h3>
                <button
                  onClick={() => setIsSearchModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Search Input */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for pages, events, or content..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  className="pl-10 pr-4 h-12 text-lg border-gray-300 focus:border-primary"
                  autoFocus
                />
              </form>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2 text-gray-600">Searching...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="p-4 space-y-2">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchResultClick(result)}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                    >
                      <div className="flex items-center space-x-3">
                        <result.icon className={`w-5 h-5 ${result.type === 'event' ? 'text-blue-500' : 'text-gray-400'}`} />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{result.title}</h4>
                          <p className="text-sm text-gray-600">{result.description}</p>
                          {result.type === 'event' && (
                            <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                              Event
                            </span>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <Search className="w-12 h-12 mb-2 opacity-50" />
                  <p>No results found for "{searchQuery}"</p>
                  <p className="text-sm">Try searching for "Events", "About", or "Contact"</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <Search className="w-12 h-12 mb-2 opacity-50" />
                  <p>Start typing to search...</p>
                  <p className="text-sm">Search for pages, events, or content</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-gray-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Enhanced Logo */}
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <div className="h-12 w-auto px-3 py-1.5 rounded-lg transition-all duration-300 group-hover:bg-gray-50/50 group-hover:shadow-sm">
                  <img
                    src="/trizen-banner.png"
                    alt="TRIZEN Logo"
                    className="h-full w-auto object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
            </Link>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {/* Events Link */}
              <Link
                to="/events"
                className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${location.pathname === "/events"
                  ? "text-blue-600 bg-blue-50 border border-blue-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
              >
                Events
              </Link>

              {/* Resources Link with Tooltip - Positioned after Events */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setIsResourcesModalOpen(true)}
                      className="px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    >
                      Resources
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Coming Soon</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Other Navigation Links */}
              {navLinks.slice(1).map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${isActive
                      ? "text-blue-600 bg-blue-50 border border-blue-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Enhanced Right Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  console.log('Search button clicked');
                  setIsSearchModalOpen(true);
                }}
                className="rounded-lg hover:bg-gray-100 transition-colors duration-200 w-9 h-9"
              >
                <Search className="w-4 h-4" />
              </Button>

              {/* Notification Center */}
              {isAuthenticated && (
                <NotificationCenter />
              )}

              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-blue-600 text-white text-sm">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition-colors duration-200 text-sm"
                >
                  Login / Signup
                </Button>
              )}
            </div>

            {/* Enhanced Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-xl hover:bg-primary/10 transition-all duration-300"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Enhanced Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-6 space-y-2 animate-slide-up border-t border-gray-200/50 mt-2">
              {/* Events Link */}
              <Link
                to="/events"
                className={`px-4 py-3 rounded-lg transition-all duration-200 font-medium ${location.pathname === "/events"
                  ? "text-blue-600 bg-blue-50 border border-blue-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </Link>

              {/* Resources Link for Mobile - Positioned after Events */}
              <button
                onClick={() => {
                  setIsResourcesModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                Resources
              </button>

              {/* Other Navigation Links */}
              {navLinks.slice(1).map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`px-4 py-3 rounded-lg transition-all duration-200 font-medium ${isActive
                      ? "text-blue-600 bg-blue-50 border border-blue-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* Mobile Search Button */}
              <button
                onClick={() => {
                  setIsSearchModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 flex items-center"
              >
                <Search className="w-4 h-4 mr-3" />
                Search
              </button>

              <div className="flex flex-col space-y-3 px-4 pt-6 border-t border-gray-200/50">
                {/* Mobile Notification Center */}
                {isAuthenticated && (
                  <div className="px-3 py-2">
                    <NotificationCenter />
                  </div>
                )}

                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Link
                        to="/profile"
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Log out
                      </button>
                    </div>
                  </>
                ) : (
                  <Button
                    size="default"
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                  >
                    Login / Signup
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;