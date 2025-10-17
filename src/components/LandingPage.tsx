import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AuthModal } from './AuthModal';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Star, 
  Users, 
  Clock, 
  Zap, 
  Shield, 
  Globe, 
  TrendingUp,
  MessageCircle,
  Award,
  ArrowRight,
  Play,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const stats = [
  { icon: Users, label: 'Active Users', value: '10,000+', color: 'text-eco-green-500' },
  { icon: Clock, label: 'Skills Shared', value: '50,000+', color: 'text-eco-blue-500' },
  { icon: Star, label: 'Success Rate', value: '95%', color: 'text-eco-teal-500' },
  { icon: Globe, label: 'Countries', value: '40+', color: 'text-eco-green-600' }
];

const features = [
  {
    icon: Zap,
    title: 'Instant Skill Exchange',
    description: 'Trade your expertise for others\' skills using time as currency. One hour equals one credit.',
    color: 'text-eco-green-500'
  },
  {
    icon: Shield,
    title: 'Secure & Trusted',
    description: 'Our verification system and rating mechanism ensure quality and safety for all users.',
    color: 'text-eco-blue-500'
  },
  {
    icon: MessageCircle,
    title: 'Real-time Communication',
    description: 'Connect instantly with skill partners through our integrated messaging system.',
    color: 'text-eco-teal-500'
  },
  {
    icon: Award,
    title: 'Gamified Learning',
    description: 'Earn badges, climb leaderboards, and unlock achievements as you share and learn.',
    color: 'text-eco-green-600'
  }
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Web Developer',
    content: 'I learned Spanish conversation by teaching JavaScript. The time-based credit system is genius!',
    rating: 5,
    avatar: '👩‍💻'
  },
  {
    name: 'Marcus Johnson',
    role: 'Graphic Designer',
    content: 'Amazing platform! I\'ve improved my photography skills while helping others with design.',
    rating: 5,
    avatar: '🎨'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Marketing Specialist',
    content: 'The community is incredible. I\'ve learned cooking and yoga by sharing my marketing expertise.',
    rating: 5,
    avatar: '📈'
  }
];

function AnimatedCounter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (inView) {
      let startTime: number;
      const startValue = 0;
      
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        setCount(Math.floor(progress * (end - startValue) + startValue));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [inView, end, duration]);

  return <span ref={ref}>{count}</span>;
}

export function LandingPage() {
  const { setCurrentPage } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleQuickDemo = () => {
    setAuthMode('signin');
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-eco-subtle opacity-50" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <Badge variant="secondary" className="bg-eco-green-100 text-eco-green-700 border-eco-green-200">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Now with AI-powered matching
                  </Badge>
                </motion.div>
                
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-eco-green-600 via-eco-teal-600 to-eco-blue-600 bg-clip-text text-transparent">
                    Trade Skills,
                  </span>
                  <br />
                  <span className="text-foreground">Build Community</span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Join thousands of learners and teachers in the world's most innovative skill-sharing platform. 
                  Learn anything, teach anything, using time as currency.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  size="lg"
                  onClick={() => handleAuth('signup')}
                  className="gradient-eco text-white hover:shadow-lg hover:shadow-eco-green-500/25 transition-all duration-200 ease-out group"
                >
                  Start Learning Today
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleQuickDemo}
                  className="border-eco-green-200 hover:bg-eco-green-50 transition-all duration-200 ease-out"
                >
                  <Play className="mr-2 w-4 h-4" />
                  Try Demo
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-eco-green-500" />
                    <span>Free to start</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-eco-green-500" />
                    <span>No subscription fees</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-eco-green-500" />
                  <span>Earn while you learn</span>
                </div>
              </motion.div>

              {/* Quick Start Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="p-4 bg-eco-green-50/50 border border-eco-green-200/50 rounded-lg"
              >
                <p className="text-sm text-eco-green-800 font-medium mb-2">
                  🚀 Quick Start Demo
                </p>
                <p className="text-sm text-eco-green-700">
                  Try the platform instantly with <code className="bg-eco-green-100 px-1 rounded">demo@skillswap.com</code> and password <code className="bg-eco-green-100 px-1 rounded">demo123</code>
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-4 -right-4 w-24 h-24 gradient-eco rounded-full opacity-20 blur-xl"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-4 -left-4 w-32 h-32 bg-eco-blue-500 rounded-full opacity-10 blur-xl"
                />
                
                <Card className="glass-effect border-eco-green-200/50 shadow-2xl overflow-hidden">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-2 gap-6">
                      {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                          <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            className="text-center space-y-2"
                          >
                            <div className={`w-12 h-12 bg-eco-green-500/20 rounded-xl flex items-center justify-center mx-auto animate-float`}>
                              <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div className="text-2xl font-bold">
                              <AnimatedCounter end={parseInt(stat.value.replace(/[^\d]/g, '')) || 95} />
                              {stat.value.includes('+') && '+'}
                              {stat.value.includes('%') && '%'}
                            </div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-10 w-16 h-16 bg-eco-green-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-10 w-20 h-20 bg-eco-blue-500/10 rounded-full blur-xl"
        />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-eco-neutral-50/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Why Choose <span className="bg-gradient-to-r from-eco-green-600 to-eco-teal-600 bg-clip-text text-transparent">SkillSwap</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of learning with our innovative time-based skill exchange platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-200 ease-out border-eco-green-200/50 hover:border-eco-green-300/50">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className={`w-16 h-16 bg-eco-green-500/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-8 h-8 ${feature.color}`} />
                      </div>
                      <h3 className="text-lg font-semibold">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 gradient-eco-subtle">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              What Our <span className="bg-gradient-to-r from-eco-green-600 to-eco-teal-600 bg-clip-text text-transparent">Community</span> Says
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied learners and teachers who've transformed their skills
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <Card className="glass-effect border-eco-green-200/50 shadow-xl">
              <CardContent className="p-8">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="text-center space-y-6"
                >
                  <div className="flex justify-center space-x-1 mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current text-yellow-500" />
                    ))}
                  </div>
                  
                  <blockquote className="text-xl lg:text-2xl font-medium text-foreground leading-relaxed">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>
                  
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-eco-green-500 to-eco-teal-500 rounded-full flex items-center justify-center text-2xl">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-foreground">
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {testimonials[currentTestimonial].role}
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <div className="flex justify-center space-x-2 mt-8">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ease-out ${
                        index === currentTestimonial
                          ? 'bg-eco-green-500 scale-125'
                          : 'bg-eco-green-200 hover:bg-eco-green-300'
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-eco-green-600 via-eco-teal-600 to-eco-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <h2 className="text-3xl lg:text-5xl font-bold">
              Ready to Start Your Skill Journey?
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Join our growing community of learners and teachers. Start sharing your skills and learning new ones today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => handleAuth('signup')}
                className="bg-white text-eco-green-600 hover:bg-eco-neutral-100 hover:shadow-lg transition-all duration-200 ease-out group"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={handleQuickDemo}
                className="border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200 ease-out"
              >
                Try Demo
              </Button>
            </div>
            
            <div className="flex justify-center items-center space-x-8 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Growing daily</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Secure platform</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Verified skills</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </div>
  );
}