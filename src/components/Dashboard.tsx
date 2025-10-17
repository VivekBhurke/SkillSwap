import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Clock, 
  Plus, 
  Calendar, 
  Star, 
  TrendingUp, 
  BookOpen, 
  Users,
  Edit3,
  ChevronRight,
  Zap,
  Award,
  Target,
  MessageCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AuthModal } from './AuthModal';
import { motion } from 'motion/react';

export function Dashboard() {
  const { currentUser, userProfile, setCurrentPage, bookings = [] } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (!currentUser) {
    return (
      <div className="min-h-screen gradient-eco-subtle flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="max-w-md mx-auto border-eco-green-200/50 shadow-xl">
            <CardContent className="p-8 text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 gradient-eco rounded-2xl flex items-center justify-center mx-auto mb-6"
              >
                <Users className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Welcome to SkillSwap</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Join the community to start trading skills with others and unlock your learning potential
              </p>
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="gradient-eco text-white hover:shadow-lg transition-all duration-200 ease-out"
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode="signin"
        />
      </div>
    );
  }

  // Mock data for demonstration
  const userSkills = userProfile?.skills || [];
  const userInterests = userProfile?.interests || [];
  const upcomingSessions = bookings.slice(0, 3) || [];

  const stats = [
    {
      title: 'Total Credits',
      value: userProfile?.credits || 0,
      icon: Zap,
      color: 'text-eco-green-600',
      bgColor: 'bg-eco-green-100',
      change: '+5 this week'
    },
    {
      title: 'Skills Offered',
      value: userSkills.length,
      icon: BookOpen,
      color: 'text-eco-blue-600',
      bgColor: 'bg-eco-blue-100',
      change: userSkills.length > 0 ? 'Active' : 'Get started'
    },
    {
      title: 'Sessions This Month',
      value: userProfile?.totalSessions || 0,
      icon: Users,
      color: 'text-eco-teal-600',
      bgColor: 'bg-eco-teal-100',
      change: 'Growing'
    },
    {
      title: 'Community Rating',
      value: userProfile?.rating ? userProfile.rating.toFixed(1) : '4.9',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: 'Excellent'
    }
  ];

  const quickActions = [
    {
      title: 'Discover Skills',
      description: 'Find amazing skills to learn',
      icon: Target,
      color: 'text-eco-green-600',
      bgColor: 'bg-eco-green-100',
      action: () => setCurrentPage('discover')
    },
    {
      title: 'View Messages',
      description: 'Check your conversations',
      icon: MessageCircle,
      color: 'text-eco-blue-600',
      bgColor: 'bg-eco-blue-100',
      action: () => setCurrentPage('messages')
    },
    {
      title: 'Manage Credits',
      description: 'View your credit history',
      icon: Clock,
      color: 'text-eco-teal-600',
      bgColor: 'bg-eco-teal-100',
      action: () => setCurrentPage('wallet')
    }
  ];

  const recentActivities = [
    {
      type: 'skill_shared',
      title: 'You taught JavaScript Fundamentals',
      description: 'Great session with Sarah! You earned 2 credits.',
      time: '2 hours ago',
      icon: BookOpen,
      color: 'text-eco-green-600'
    },
    {
      type: 'skill_learned',
      title: 'You learned Spanish Conversation',
      description: 'Completed 1-hour session with Carlos.',
      time: '1 day ago',
      icon: TrendingUp,
      color: 'text-eco-blue-600'
    },
    {
      type: 'achievement',
      title: 'Achievement Unlocked!',
      description: 'You earned the "First Teacher" badge.',
      time: '2 days ago',
      icon: Award,
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden"
        >
          <Card className="border-0 bg-gradient-to-r from-eco-green-500 via-eco-teal-500 to-eco-blue-500 text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                      Welcome back, {userProfile?.name?.split(' ')[0] || currentUser.name?.split(' ')[0] || 'Friend'}! 👋
                    </h1>
                    <p className="text-white/90 text-lg">
                      You have <span className="font-bold text-white">{userProfile?.credits || 0} credits</span> ready to use
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      Level {userProfile?.totalSessions ? Math.floor(userProfile.totalSessions / 5) + 1 : 1} Trader
                    </Badge>
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      ⭐ {userProfile?.rating || '4.9'} Rating
                    </Badge>
                  </div>
                </div>
                
                <div className="hidden lg:block">
                  <motion.div
                    animate={{ float: true }}
                    className="relative"
                  >
                    <div className="w-32 h-32 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 flex items-center justify-center">
                      <Users className="w-16 h-16 text-white" />
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-4 right-20 w-16 h-16 bg-white/10 rounded-full blur-xl"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute bottom-4 left-20 w-12 h-12 bg-white/10 rounded-full blur-xl"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Card className="border-eco-green-200/50 hover:shadow-lg transition-all duration-200 ease-out">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {stat.change}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* My Skills */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="border-eco-green-200/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-eco-green-500" />
                      My Skills
                    </CardTitle>
                    <CardDescription>
                      Skills you can teach to others
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => setCurrentPage('profile')}
                    className="gradient-eco text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {userSkills.length > 0 ? (
                  userSkills.map((skill, index) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-4 bg-eco-green-50 rounded-lg border border-eco-green-200/50"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{skill}</h4>
                          <Badge variant="outline" className="text-xs bg-eco-green-100 text-eco-green-700">
                            {userProfile?.experience || 'Intermediate'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Ready to teach • {userProfile?.hourlyRate || 1} credit/hour
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    </motion.div>
                    <h3 className="font-semibold text-lg mb-2">Share Your Expertise</h3>
                    <p className="text-muted-foreground mb-6">
                      Add skills you can teach to start earning credits
                    </p>
                    <Button 
                      onClick={() => setCurrentPage('profile')}
                      className="gradient-eco text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Skill
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="border-eco-blue-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-eco-blue-500" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Fast access to key features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ x: 4 }}
                      className="cursor-pointer"
                      onClick={action.action}
                    >
                      <div className="flex items-center gap-3 p-3 hover:bg-eco-neutral-50 rounded-lg transition-colors">
                        <div className={`w-10 h-10 rounded-lg ${action.bgColor} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${action.color}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{action.title}</h4>
                          <p className="text-xs text-muted-foreground">{action.description}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Learning Interests & Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Learning Interests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Card className="border-eco-teal-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-eco-teal-500" />
                  Learning Interests
                </CardTitle>
                <CardDescription>
                  Skills you want to learn
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userInterests.length > 0 ? (
                  <div className="space-y-3">
                    {userInterests.map((interest, index) => (
                      <motion.div
                        key={interest}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center justify-between p-3 bg-eco-teal-50 rounded-lg border border-eco-teal-200/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-eco-teal-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">📚</span>
                          </div>
                          <span className="font-medium">{interest}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </motion.div>
                    ))}
                    <Button 
                      variant="outline" 
                      className="w-full border-eco-teal-200 hover:bg-eco-teal-50"
                      onClick={() => setCurrentPage('discover')}
                    >
                      Find Teachers
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h4 className="font-medium mb-2">What do you want to learn?</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add learning interests to get personalized recommendations
                    </p>
                    <Button 
                      onClick={() => setCurrentPage('profile')}
                      variant="outline"
                      className="border-eco-teal-200 hover:bg-eco-teal-50"
                    >
                      Add Interests
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Card className="border-eco-green-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-eco-green-500" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your latest skill exchanges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-start gap-3 p-3 hover:bg-eco-neutral-50 rounded-lg transition-colors"
                      >
                        <div className="w-8 h-8 bg-eco-green-100 rounded-lg flex items-center justify-center mt-1">
                          <Icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{activity.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}