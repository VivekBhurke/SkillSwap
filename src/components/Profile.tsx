import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { EditProfileModal } from './EditProfileModal';
import {
  Star,
  Award,
  BookOpen,
  Users,
  Clock,
  MapPin,
  Calendar,
  Edit,
  Plus,
  TrendingUp,
  MessageCircle,
  Share2,
  Heart,
  CheckCircle,
  Globe,
  Phone,
  Mail
} from 'lucide-react';
import { motion } from 'motion/react';

const skillCategories = [
  { name: 'Programming', color: 'text-eco-blue-500' },
  { name: 'Design', color: 'text-eco-green-500' },
  { name: 'Marketing', color: 'text-eco-teal-500' },
  { name: 'Photography', color: 'text-eco-green-600' },
  { name: 'Writing', color: 'text-eco-blue-600' }
];

const achievements = [
  { name: 'First Teacher', description: 'Taught your first skill', icon: '🎓', earned: true },
  { name: 'Quick Learner', description: 'Completed 5 learning sessions', icon: '⚡', earned: true },
  { name: 'Community Helper', description: 'Helped 10 learners', icon: '🤝', earned: true },
  { name: 'Skill Master', description: 'Reached expert level in a skill', icon: '👑', earned: false },
  { name: 'Social Butterfly', description: 'Connected with 25 users', icon: '🦋', earned: false },
  { name: 'Mentor', description: 'Mentored 5 long-term students', icon: '🌟', earned: false }
];

const recentActivities = [
  {
    type: 'taught',
    skill: 'JavaScript Fundamentals',
    user: 'Sarah Chen',
    time: '2 hours ago',
    credits: 2
  },
  {
    type: 'learned',
    skill: 'Spanish Conversation',
    user: 'Carlos Rodriguez',
    time: '1 day ago',
    credits: -1
  },
  {
    type: 'review',
    skill: 'Web Design',
    rating: 5,
    time: '2 days ago'
  }
];

export function Profile() {
  const { currentUser, userProfile } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    // Calculate profile completion
    let completion = 0;
    if (userProfile?.name) completion += 15;
    if (userProfile?.bio && userProfile.bio.length > 50) completion += 20;
    if (userProfile?.title) completion += 10;
    if (userProfile?.location) completion += 10;
    if (userProfile?.skills && userProfile.skills.length > 0) completion += 20;
    if (userProfile?.interests && userProfile.interests.length > 0) completion += 10;
    if (userProfile?.experience) completion += 10;
    if (userProfile?.availability) completion += 5;
    setProfileCompletion(Math.min(completion, 100));
  }, [userProfile]);

  const stats = [
    { label: 'Skills Taught', value: '24', icon: BookOpen, color: 'text-eco-green-500' },
    { label: 'Skills Learned', value: '18', icon: TrendingUp, color: 'text-eco-blue-500' },
    { label: 'Teaching Hours', value: '156', icon: Clock, color: 'text-eco-teal-500' },
    { label: 'Students Helped', value: '42', icon: Users, color: 'text-eco-green-600' }
  ];

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Profile Header */}
        <Card className="relative overflow-hidden border-eco-green-200/50">
          <div className="absolute inset-0 gradient-eco-subtle opacity-50" />
          <CardContent className="relative p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                    <AvatarFallback className="bg-gradient-to-br from-eco-green-500 to-eco-teal-500 text-white text-4xl">
                      {userProfile?.name?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-eco-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </motion.div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold">
                      {userProfile?.name || 'Complete your profile'}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                      {userProfile?.title || 'Add your professional title'}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                      {userProfile?.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{userProfile.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Joined March 2024</span>
                      </div>
                      {userProfile?.website && (
                        <div className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          <a 
                            href={userProfile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-eco-green-600 hover:underline"
                          >
                            Website
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {userProfile?.bio || 'Add a bio to tell others about yourself and your skills. Share your experience, interests, and what makes you passionate about learning and teaching.'}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current text-yellow-500" />
                      <span className="font-medium">4.9</span>
                      <span className="text-muted-foreground text-sm">(127 reviews)</span>
                    </div>
                    <Badge variant="secondary" className="bg-eco-green-100 text-eco-green-700">
                      ⭐ {userProfile?.credits || 0} credits
                    </Badge>
                    <Badge variant="secondary" className="bg-eco-blue-100 text-eco-blue-700">
                      🏆 Level 3 Trader
                    </Badge>
                    {userProfile?.hourlyRate && (
                      <Badge variant="secondary" className="bg-eco-teal-100 text-eco-teal-700">
                        💰 {userProfile.hourlyRate} credits/hour
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button 
                  onClick={handleEditProfile}
                  className="gradient-eco text-white hover:shadow-lg transition-all duration-200 ease-out"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </div>

            {/* Profile Completion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-4 bg-white/50 rounded-lg border border-eco-green-200/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Profile Completion</span>
                <span className="text-sm text-muted-foreground">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="h-2" />
              {profileCompletion < 100 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Complete your profile to get more skill exchange opportunities
                </p>
              )}
            </motion.div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -4 }}
              >
                <Card className="hover:shadow-lg transition-all duration-200 ease-out border-eco-green-200/50">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 bg-eco-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:flex">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Skills</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Achievements</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Skills Overview */}
              <Card className="border-eco-green-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-eco-green-500" />
                    Your Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userProfile?.skills && userProfile.skills.length > 0 ? (
                    <div className="space-y-4">
                      {userProfile.skills.slice(0, 5).map((skill, index) => (
                        <div key={skill} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 bg-eco-green-500 rounded-full`} />
                            <span className="font-medium">{skill}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < 4 ? 'fill-current text-yellow-500' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {12 - index * 2} sessions
                            </span>
                          </div>
                        </div>
                      ))}
                      {userProfile.skills.length > 5 && (
                        <p className="text-sm text-muted-foreground">
                          +{userProfile.skills.length - 5} more skills
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No skills added yet</p>
                      <Button onClick={handleEditProfile} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Skills
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Learning Interests */}
              <Card className="border-eco-blue-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-eco-blue-500" />
                    Learning Interests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userProfile?.interests && userProfile.interests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {userProfile.interests.map((interest) => (
                        <Badge key={interest} variant="secondary" className="bg-eco-blue-100 text-eco-blue-700">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No learning interests added yet</p>
                      <Button onClick={handleEditProfile} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Interests
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Your Skills & Interests</h3>
              <Button onClick={handleEditProfile} className="gradient-eco text-white">
                <Edit className="w-4 h-4 mr-2" />
                Edit Skills
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-eco-green-200/50">
                <CardHeader>
                  <CardTitle className="text-eco-green-600">Teaching Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  {userProfile?.skills && userProfile.skills.length > 0 ? (
                    <div className="space-y-4">
                      {userProfile.skills.map((skill, index) => (
                        <div key={skill} className="p-4 border border-eco-green-200/50 rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{skill}</h4>
                            <Badge variant="secondary" className="bg-eco-green-100 text-eco-green-700">
                              {userProfile.experience || 'Intermediate'}
                            </Badge>
                          </div>
                          <Progress value={75 + index * 5} className="h-2" />
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{15 - index} students taught</span>
                            <span>4.{9 - index} rating</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No skills added yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-eco-blue-200/50">
                <CardHeader>
                  <CardTitle className="text-eco-blue-600">Learning Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  {userProfile?.interests && userProfile.interests.length > 0 ? (
                    <div className="space-y-4">
                      {userProfile.interests.map((interest, index) => (
                        <div key={interest} className="p-4 border border-eco-blue-200/50 rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{interest}</h4>
                            <Badge variant="secondary" className="bg-eco-blue-100 text-eco-blue-700">
                              Beginner
                            </Badge>
                          </div>
                          <Progress value={30 + index * 10} className="h-2" />
                          <div className="text-sm text-muted-foreground">
                            {30 + index * 10}% progress
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No learning interests added yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-6">Achievements & Badges</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className={`border-2 transition-all duration-200 ease-out ${
                      achievement.earned
                        ? 'border-eco-green-200 bg-eco-green-50/50'
                        : 'border-gray-200 bg-gray-50/50 opacity-60'
                    }`}>
                      <CardContent className="p-6 text-center space-y-3">
                        <div className={`text-4xl ${achievement.earned ? 'grayscale-0' : 'grayscale'}`}>
                          {achievement.icon}
                        </div>
                        <h4 className="font-semibold">{achievement.name}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        {achievement.earned && (
                          <Badge className="bg-eco-green-500 text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Earned
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="border-eco-green-200/50">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border border-eco-green-200/30 rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'taught' ? 'bg-eco-green-100 text-eco-green-600' :
                      activity.type === 'learned' ? 'bg-eco-blue-100 text-eco-blue-600' :
                      'bg-eco-teal-100 text-eco-teal-600'
                    }`}>
                      {activity.type === 'taught' ? '🎓' :
                       activity.type === 'learned' ? '📖' : '⭐'}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        {activity.type === 'taught' && `Taught ${activity.skill} to ${activity.user}`}
                        {activity.type === 'learned' && `Learned ${activity.skill} from ${activity.user}`}
                        {activity.type === 'review' && `Received 5-star review for ${activity.skill}`}
                      </div>
                      <div className="text-sm text-muted-foreground">{activity.time}</div>
                    </div>
                    {activity.credits && (
                      <Badge variant={activity.credits > 0 ? 'default' : 'secondary'} className={
                        activity.credits > 0 ? 'bg-eco-green-500 text-white' : 'bg-eco-blue-100 text-eco-blue-700'
                      }>
                        {activity.credits > 0 ? '+' : ''}{activity.credits} credits
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </div>
  );
}