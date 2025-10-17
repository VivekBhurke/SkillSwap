import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Clock, 
  Video, 
  Users,
  BookOpen,
  ChevronRight,
  Heart,
  Share2,
  Bookmark,
  X,
  TrendingUp,
  DollarSign,
  Coins
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookingModal } from './BookingModal';
import { AuthModal } from './AuthModal';
import { motion, AnimatePresence } from 'motion/react';

// Mock skills data with realistic information
const mockSkills = [
  {
    id: '1',
    name: 'Web Development with React',
    category: 'Programming',
    description: 'Learn modern web development with React, including hooks, state management, and best practices. Perfect for beginners who want to build their first web applications.',
    level: 'Beginner',
    creditsPerHour: 2,
    availability: ['Monday-Friday 6-9 PM EST'],
    provider: {
      id: '1',
      name: 'Sarah Chen',
      avatar: '👩‍💻',
      location: 'San Francisco, CA',
      rating: 4.9,
      reviewCount: 87,
      totalStudents: 156,
      responseTime: '< 1 hour'
    },
    tags: ['React', 'JavaScript', 'Frontend', 'Beginner-friendly'],
    duration: '1-2 hours per session',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
    featured: true
  },
  {
    id: '2',
    name: 'Guitar Lessons for Beginners',
    category: 'Music',
    description: 'Start your musical journey with acoustic guitar. Learn basic chords, strumming patterns, and play your first songs within a few weeks.',
    level: 'Beginner',
    creditsPerHour: 1,
    availability: ['Weekends 2-6 PM PST'],
    provider: {
      id: '2',
      name: 'Marcus Rodriguez',
      avatar: '🎸',
      location: 'Austin, TX',
      rating: 4.8,
      reviewCount: 92,
      totalStudents: 234,
      responseTime: '< 2 hours'
    },
    tags: ['Guitar', 'Music Theory', 'Acoustic', 'Beginner'],
    duration: '45-60 minutes per session',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop',
    featured: true
  },
  {
    id: '3',
    name: 'Digital Photography Basics',
    category: 'Photography',
    description: 'Master your camera settings, composition, and basic editing. Learn to take stunning photos whether you\'re using a DSLR or smartphone.',
    level: 'Intermediate',
    creditsPerHour: 2,
    availability: ['Tuesday & Thursday 7-9 PM EST'],
    provider: {
      id: '3',
      name: 'Emily Zhang',
      avatar: '📸',
      location: 'New York, NY',
      rating: 4.9,
      reviewCount: 156,
      totalStudents: 298,
      responseTime: '< 30 minutes'
    },
    tags: ['Photography', 'Editing', 'Composition', 'DSLR'],
    duration: '1.5-2 hours per session',
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=250&fit=crop',
    featured: true
  },
  {
    id: '4',
    name: 'Spanish Conversation Practice',
    category: 'Language',
    description: 'Improve your Spanish speaking skills through natural conversation. Perfect for intermediate learners who want to gain confidence.',
    level: 'Intermediate',
    creditsPerHour: 1,
    availability: ['Daily 5-8 PM EST'],
    provider: {
      id: '4',
      name: 'Carlos Mendez',
      avatar: '🇪🇸',
      location: 'Miami, FL',
      rating: 4.7,
      reviewCount: 73,
      totalStudents: 189,
      responseTime: '< 1 hour'
    },
    tags: ['Spanish', 'Conversation', 'Intermediate', 'Cultural Exchange'],
    duration: '30-45 minutes per session',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop',
    featured: true
  },
  {
    id: '5',
    name: 'Yoga & Mindfulness',
    category: 'Fitness',
    description: 'Connect body and mind through gentle yoga flows and meditation practices. Suitable for all levels and ages.',
    level: 'Beginner',
    creditsPerHour: 1,
    availability: ['Monday, Wednesday, Friday 6-8 AM PST'],
    provider: {
      id: '5',
      name: 'Maya Patel',
      avatar: '🧘‍♀️',
      location: 'Los Angeles, CA',
      rating: 4.9,
      reviewCount: 124,
      totalStudents: 267,
      responseTime: '< 2 hours'
    },
    tags: ['Yoga', 'Meditation', 'Wellness', 'Beginner'],
    duration: '45-60 minutes per session',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop',
    featured: false
  },
  {
    id: '6',
    name: 'Cooking Italian Cuisine',
    category: 'Cooking',
    description: 'Learn to cook authentic Italian dishes from scratch. From fresh pasta to traditional sauces and desserts.',
    level: 'Beginner',
    creditsPerHour: 2,
    availability: ['Weekends 1-4 PM EST'],
    provider: {
      id: '6',
      name: 'Giuseppe Romano',
      avatar: '👨‍🍳',
      location: 'Boston, MA',
      rating: 4.8,
      reviewCount: 89,
      totalStudents: 145,
      responseTime: '< 3 hours'
    },
    tags: ['Cooking', 'Italian', 'Pasta', 'Traditional'],
    duration: '2-3 hours per session',
    image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=400&h=250&fit=crop',
    featured: false
  }
];

export function SkillDiscovery() {
  const { currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('rating');
  const [priceRange, setPriceRange] = useState([0, 5]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories', icon: '🎯' },
    { value: 'Programming', label: 'Programming', icon: '💻' },
    { value: 'Music', label: 'Music', icon: '🎵' },
    { value: 'Photography', label: 'Photography', icon: '📸' },
    { value: 'Language', label: 'Languages', icon: '🌍' },
    { value: 'Fitness', label: 'Fitness', icon: '💪' },
    { value: 'Cooking', label: 'Cooking', icon: '👨‍🍳' },
    { value: 'Art', label: 'Art & Design', icon: '🎨' },
    { value: 'Business', label: 'Business', icon: '💼' },
    { value: 'Writing', label: 'Writing', icon: '✍️' }
  ];

  const levels = [
    { value: 'all', label: 'All Levels' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' }
  ];

  // Get search suggestions based on current query
  const searchSuggestions = React.useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    
    const suggestions = new Set<string>();
    mockSkills.forEach(skill => {
      // Add matching skill names
      if (skill.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        suggestions.add(skill.name);
      }
      // Add matching tags
      skill.tags.forEach(tag => {
        if (tag.toLowerCase().includes(searchQuery.toLowerCase())) {
          suggestions.add(tag);
        }
      });
      // Add matching teacher names
      if (skill.provider.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        suggestions.add(skill.provider.name);
      }
    });
    return Array.from(suggestions).slice(0, 5);
  }, [searchQuery]);

  // Filter and sort skills
  const filteredSkills = mockSkills.filter(skill => {
    const matchesSearch = searchQuery === '' || 
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || skill.level === selectedLevel;
    const matchesPrice = skill.creditsPerHour >= priceRange[0] && skill.creditsPerHour <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.provider.rating - a.provider.rating;
      case 'price':
        return a.creditsPerHour - b.creditsPerHour;
      case 'newest':
        return a.id.localeCompare(b.id);
      default:
        return 0;
    }
  });

  const featuredSkills = filteredSkills.filter(skill => skill.featured);

  const handleBookSession = (skill) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    setSelectedSkill(skill);
    setShowBookingModal(true);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value && !recentSearches.includes(value)) {
      setRecentSearches([value, ...recentSearches.slice(0, 4)]);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setPriceRange([0, 5]);
  };

  const activeFiltersCount = [
    selectedCategory !== 'all',
    selectedLevel !== 'all',
    priceRange[0] !== 0 || priceRange[1] !== 5,
    searchQuery !== ''
  ].filter(Boolean).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h1 
            className="text-4xl lg:text-5xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Discover Amazing{' '}
            <span className="bg-gradient-to-r from-eco-green-600 to-eco-teal-600 bg-clip-text text-transparent">
              Skills
            </span>
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Connect with talented teachers and learn new skills using our time-based credit system
          </motion.p>
        </div>

        {/* Enhanced Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-eco-green-200/50 shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Enhanced Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search skills, teachers, tags, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="pl-12 pr-10 h-14 text-lg border-eco-green-200/50 focus:border-eco-green-500 focus:ring-2 focus:ring-eco-green-200"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-eco-green-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                  
                  {/* Search Suggestions Dropdown */}
                  <AnimatePresence>
                    {showSuggestions && (searchSuggestions.length > 0 || recentSearches.length > 0) && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 w-full mt-2 bg-white border border-eco-green-200 rounded-lg shadow-xl overflow-hidden"
                      >
                        {searchSuggestions.length > 0 && (
                          <div className="p-2">
                            <p className="px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
                              <TrendingUp className="w-3 h-3" />
                              Suggestions
                            </p>
                            {searchSuggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSearch(suggestion)}
                                className="w-full text-left px-3 py-2 hover:bg-eco-green-50 rounded transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                        {recentSearches.length > 0 && searchSuggestions.length === 0 && (
                          <div className="p-2">
                            <p className="px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              Recent Searches
                            </p>
                            {recentSearches.map((search, index) => (
                              <button
                                key={index}
                                onClick={() => setSearchQuery(search)}
                                className="w-full text-left px-3 py-2 hover:bg-eco-green-50 rounded transition-colors"
                              >
                                {search}
                              </button>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Active Filters Summary */}
                {activeFiltersCount > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">Active filters:</span>
                    {searchQuery && (
                      <Badge variant="secondary" className="bg-eco-green-100 text-eco-green-700">
                        Search: "{searchQuery}"
                        <button onClick={() => setSearchQuery('')} className="ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {selectedCategory !== 'all' && (
                      <Badge variant="secondary" className="bg-eco-green-100 text-eco-green-700">
                        {categories.find(c => c.value === selectedCategory)?.label}
                        <button onClick={() => setSelectedCategory('all')} className="ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {selectedLevel !== 'all' && (
                      <Badge variant="secondary" className="bg-eco-green-100 text-eco-green-700">
                        {selectedLevel}
                        <button onClick={() => setSelectedLevel('all')} className="ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {(priceRange[0] !== 0 || priceRange[1] !== 5) && (
                      <Badge variant="secondary" className="bg-eco-green-100 text-eco-green-700">
                        {priceRange[0]}-{priceRange[1]} credits/hr
                        <button onClick={() => setPriceRange([0, 5])} className="ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-eco-green-600 hover:text-eco-green-700 hover:bg-eco-green-50"
                    >
                      Clear all
                    </Button>
                  </div>
                )}

                {/* Quick Category Filter Pills */}
                <div className="flex flex-wrap gap-3">
                  {categories.slice(0, 6).map((category) => (
                    <Button
                      key={category.value}
                      variant={selectedCategory === category.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.value)}
                      className={selectedCategory === category.value ? 
                        "gradient-eco text-white" : 
                        "border-eco-green-200/50 hover:bg-eco-green-50"
                      }
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.label}
                    </Button>
                  ))}
                </div>

                {/* Main Filters Row */}
                <div className="grid md:grid-cols-4 gap-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="border-eco-green-200/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <span className="flex items-center gap-2">
                            <span>{category.icon}</span>
                            {category.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="border-eco-green-200/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="border-eco-green-200/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">⭐ Highest Rated</SelectItem>
                      <SelectItem value="price">💰 Lowest Price</SelectItem>
                      <SelectItem value="newest">🆕 Newest</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button 
                    variant="outline" 
                    className="border-eco-green-200/50 hover:bg-eco-green-50"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {showAdvancedFilters ? 'Hide' : 'More'} Filters
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2 bg-eco-green-500 text-white">{activeFiltersCount}</Badge>
                    )}
                  </Button>
                </div>

                {/* Advanced Filters Panel */}
                <AnimatePresence>
                  {showAdvancedFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-eco-green-200/50 pt-6 space-y-4"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Price Range Filter */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="font-medium flex items-center gap-2">
                              <Coins className="w-4 h-4 text-eco-green-600" />
                              Price Range
                            </label>
                            <span className="text-sm text-muted-foreground">
                              {priceRange[0]} - {priceRange[1]} credits/hr
                            </span>
                          </div>
                          <Slider
                            min={0}
                            max={5}
                            step={1}
                            value={priceRange}
                            onValueChange={setPriceRange}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>0 credits</span>
                            <span>5 credits</span>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="space-y-3">
                          <label className="font-medium flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-eco-green-600" />
                            Pricing Info
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <Card className="p-3 text-center border-eco-green-200/50">
                              <p className="text-xs text-muted-foreground">Budget</p>
                              <p className="font-semibold text-eco-green-600">1 credit</p>
                            </Card>
                            <Card className="p-3 text-center border-eco-green-200/50">
                              <p className="text-xs text-muted-foreground">Standard</p>
                              <p className="font-semibold text-eco-green-600">2 credits</p>
                            </Card>
                            <Card className="p-3 text-center border-eco-green-200/50">
                              <p className="text-xs text-muted-foreground">Premium</p>
                              <p className="font-semibold text-eco-green-600">3+ credits</p>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Featured Skills */}
        {featuredSkills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span>✨</span>
                Featured Skills
              </h2>
              <Badge variant="secondary" className="bg-eco-green-100 text-eco-green-700">
                Top Rated
              </Badge>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-200 ease-out border-eco-green-200/50 hover:border-eco-green-300/50">
                    <div className="relative h-48 overflow-hidden">
                      <ImageWithFallback 
                        src={skill.image}
                        alt={skill.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-white/90 text-gray-700 hover:bg-white/90">
                          {skill.category}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Button variant="ghost" size="sm" className="w-8 h-8 p-0 bg-white/90 hover:bg-white">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <Badge variant="outline" className="bg-white/90 text-gray-700 border-none">
                          {skill.level}
                        </Badge>
                        <Badge className="bg-eco-green-500 text-white shadow-lg">
                          <Coins className="w-3 h-3 mr-1" />
                          {skill.creditsPerHour} credit/hr
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-2 mb-1">{skill.name}</h3>
                        <p className="text-sm text-muted-foreground">by {skill.provider.name}</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-current text-yellow-500" />
                          <span className="font-medium">{skill.provider.rating}</span>
                          <span className="text-muted-foreground">({skill.provider.reviewCount})</span>
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-eco-green-600">
                          <Coins className="w-4 h-4" />
                          {skill.creditsPerHour}
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground bg-eco-green-50 p-2 rounded">
                        💡 {skill.duration} session ≈ {Math.ceil(skill.creditsPerHour * 1.5)} credits
                      </div>
                      
                      <Button 
                        className="w-full gradient-eco text-white hover:shadow-lg transition-all duration-200 ease-out"
                        onClick={() => handleBookSession(skill)}
                      >
                        Book Session
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              All Skills ({filteredSkills.length})
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">View:</span>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
          </div>

          <div className={viewMode === 'grid' ? 
            "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : 
            "space-y-4"
          }>
            <AnimatePresence>
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.05 * index }}
                  whileHover={{ y: -4 }}
                >
                  {viewMode === 'grid' ? (
                    <Card className="h-full hover:shadow-xl transition-all duration-200 ease-out border-eco-green-200/50 hover:border-eco-green-300/50">
                      <div className="relative h-48 overflow-hidden">
                        <ImageWithFallback 
                          src={skill.image}
                          alt={skill.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge variant="outline" className="bg-white/90 text-gray-700 border-none">
                            {skill.category}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-eco-green-500 text-white shadow-lg">
                            <Coins className="w-3 h-3 mr-1" />
                            {skill.creditsPerHour}/hr
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg line-clamp-2">{skill.name}</h3>
                          <p className="text-sm text-muted-foreground">by {skill.provider.name}</p>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {skill.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-current text-yellow-500" />
                            <span>{skill.provider.rating}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">{skill.level}</Badge>
                        </div>

                        <div className="text-xs text-muted-foreground bg-eco-green-50 p-2 rounded flex items-center justify-between">
                          <span>Typical session cost:</span>
                          <span className="font-semibold text-eco-green-600 flex items-center gap-1">
                            <Coins className="w-3 h-3" />
                            ≈ {Math.ceil(skill.creditsPerHour * 1.5)} credits
                          </span>
                        </div>
                        
                        <Button 
                          className="w-full gradient-eco text-white"
                          onClick={() => handleBookSession(skill)}
                        >
                          Book Session
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="hover:shadow-lg transition-all duration-200 ease-out border-eco-green-200/50">
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                            <ImageWithFallback 
                              src={skill.image}
                              alt={skill.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-xl">{skill.name}</h3>
                                  <Badge variant="outline" className="text-xs">{skill.level}</Badge>
                                </div>
                                <p className="text-muted-foreground">by {skill.provider.name}</p>
                              </div>
                              <div className="text-right space-y-1 flex-shrink-0">
                                <Badge className="bg-eco-green-500 text-white shadow-md">
                                  <Coins className="w-3 h-3 mr-1" />
                                  {skill.creditsPerHour} credits/hr
                                </Badge>
                                <p className="text-xs text-muted-foreground whitespace-nowrap">
                                  ≈ {Math.ceil(skill.creditsPerHour * 1.5)} per session
                                </p>
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground line-clamp-2">
                              {skill.description}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-current text-yellow-500" />
                                  <span>{skill.provider.rating} ({skill.provider.reviewCount})</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{skill.provider.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{skill.duration}</span>
                                </div>
                              </div>
                              
                              <Button 
                                className="gradient-eco text-white"
                                onClick={() => handleBookSession(skill)}
                              >
                                Book Session
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Empty State */}
        {filteredSkills.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-eco-green-200/50">
              <CardContent className="p-12 text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">No skills found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or explore different categories
                </p>
                <Button 
                  onClick={clearAllFilters}
                  className="gradient-eco text-white"
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* Booking Modal */}
      {selectedSkill && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedSkill(null);
          }}
          skill={selectedSkill}
          teacher={selectedSkill.provider}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode="signin"
      />
    </div>
  );
}
