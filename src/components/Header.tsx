import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Bell, Menu, Search, Sparkles, User, LogOut, Settings, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Header() {
  const { 
    currentPage, 
    setCurrentPage, 
    currentUser, 
    signOut, 
    userProfile 
  } = useApp();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'discover', label: 'Discover', icon: '🔍' },
    { id: 'wallet', label: 'Wallet', icon: '💳' },
    { id: 'messages', label: 'Messages', icon: '💬' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  const isActive = (pageId: string) => currentPage === pageId;

  return (
    <motion.header 
      className={`sticky top-0 z-50 transition-all duration-200 ease-out ${
        isScrolled 
          ? 'glass-effect shadow-lg border-b border-eco-green-200/50' 
          : 'bg-background/80 backdrop-blur-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setCurrentPage('home')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <div className="w-10 h-10 gradient-eco rounded-xl flex items-center justify-center shadow-lg animate-glow">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-eco-blue-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-eco-green-600 to-eco-teal-600 bg-clip-text text-transparent">
                SkillSwap
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">Learn • Share • Grow</p>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            className="hidden md:flex items-center flex-1 max-w-md mx-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className={`relative w-full transition-all duration-200 ease-out ${
              isSearchFocused ? 'transform scale-105' : ''
            }`}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search skills, users, or topics..."
                className="w-full pl-10 pr-4 py-2.5 bg-eco-neutral-50 border border-eco-green-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-green-500/20 focus:border-eco-green-500 transition-all duration-200 ease-out placeholder:text-eco-neutral-500"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-eco-green-200/50 p-4 z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-eco-green-100 text-eco-green-700 px-2 py-1 rounded-full">Popular</span>
                        <span>JavaScript, Python, Design</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-eco-blue-100 text-eco-blue-700 px-2 py-1 rounded-full">Recent</span>
                        <span>Web Development, Photography</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Navigation & User Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`relative px-4 py-2 rounded-lg transition-all duration-200 ease-out ${
                    isActive(item.id)
                      ? 'bg-eco-green-100 text-eco-green-700 shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-eco-neutral-100'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <span className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </span>
                  {isActive(item.id) && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 w-6 h-0.5 bg-eco-green-500 rounded-full"
                      layoutId="activeTab"
                      initial={false}
                      style={{ x: '-50%' }}
                    />
                  )}
                </motion.button>
              ))}
            </nav>

            {/* Notifications */}
            {currentUser && (
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button variant="ghost" size="sm" className="relative p-2">
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <motion.span
                      className="absolute -top-1 -right-1 w-5 h-5 bg-eco-green-500 text-white text-xs rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {notifications}
                    </motion.span>
                  )}
                </Button>
              </motion.div>
            )}

            {/* User Menu */}
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                      <Avatar className="h-10 w-10 border-2 border-eco-green-200">
                        <AvatarFallback className="bg-gradient-to-br from-eco-green-500 to-eco-teal-500 text-white">
                          {currentUser.email?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-eco-green-500 rounded-full border-2 border-background animate-pulse" />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-64 animate-slide-down"
                  align="end"
                  sideOffset={5}
                >
                  <div className="flex items-center space-x-3 p-3 border-b border-eco-green-100">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-eco-green-500 to-eco-teal-500 text-white">
                        {currentUser.email?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {userProfile?.name || 'User'}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {currentUser.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          ⭐ {userProfile?.credits || 0} credits
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenuItem 
                    onClick={() => setCurrentPage('profile')}
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => setCurrentPage('messages')}
                    className="cursor-pointer"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Messages
                    <Badge variant="secondary" className="ml-auto text-xs">2</Badge>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={signOut}
                    className="cursor-pointer text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  onClick={() => setCurrentPage('home')}
                  className="gradient-eco text-white hover:shadow-lg transition-all duration-200 ease-out"
                >
                  Sign In
                </Button>
              </motion.div>
            )}

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}