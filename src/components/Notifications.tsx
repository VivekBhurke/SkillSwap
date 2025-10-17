import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import {
  Bell,
  Check,
  X,
  Star,
  MessageCircle,
  Calendar,
  Award,
  Users,
  BookOpen,
  CreditCard,
  Settings,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const notifications = [
  {
    id: '1',
    type: 'booking',
    title: 'New Session Request',
    message: 'Sarah Chen wants to book a JavaScript lesson with you',
    user: { name: 'Sarah Chen', avatar: '👩‍💻' },
    time: '2 minutes ago',
    read: false,
    action: 'booking_request'
  },
  {
    id: '2',
    type: 'review',
    title: 'New Review Received',
    message: 'Marcus left you a 5-star review for your design session',
    user: { name: 'Marcus Johnson', avatar: '🎨' },
    time: '1 hour ago',
    read: false,
    rating: 5,
    action: 'view_review'
  },
  {
    id: '3',
    type: 'message',
    title: 'New Message',
    message: 'Emily sent you a message about the marketing strategy',
    user: { name: 'Emily Rodriguez', avatar: '📈' },
    time: '3 hours ago',
    read: true,
    action: 'view_message'
  },
  {
    id: '4',
    type: 'achievement',
    title: 'Achievement Unlocked!',
    message: 'You earned the "Quick Learner" badge for completing 5 sessions',
    time: '5 hours ago',
    read: true,
    badge: '⚡',
    action: 'view_achievement'
  },
  {
    id: '5',
    type: 'reminder',
    title: 'Session Reminder',
    message: 'You have a photography session with David in 30 minutes',
    user: { name: 'David Kim', avatar: '📷' },
    time: '30 minutes',
    read: false,
    action: 'join_session'
  },
  {
    id: '6',
    type: 'credit',
    title: 'Credits Earned',
    message: 'You earned 2 credits from teaching JavaScript to Alex',
    time: '1 day ago',
    read: true,
    credits: 2,
    action: 'view_wallet'
  },
  {
    id: '7',
    type: 'skill_match',
    title: 'Perfect Match Found!',
    message: 'We found someone who can teach Python and wants to learn React',
    time: '2 days ago',
    read: true,
    action: 'view_match'
  }
];

const notificationIcons = {
  booking: Calendar,
  review: Star,
  message: MessageCircle,
  achievement: Award,
  reminder: Bell,
  credit: CreditCard,
  skill_match: Users
};

const notificationColors = {
  booking: 'text-eco-blue-500',
  review: 'text-yellow-500',
  message: 'text-eco-green-500',
  achievement: 'text-eco-teal-500',
  reminder: 'text-orange-500',
  credit: 'text-eco-green-600',
  skill_match: 'text-purple-500'
};

export function Notifications() {
  const [allNotifications, setAllNotifications] = useState(notifications);
  const [filter, setFilter] = useState('all');

  const filteredNotifications = allNotifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const unreadCount = allNotifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setAllNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setAllNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setAllNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleAction = (notification: any) => {
    switch (notification.action) {
      case 'booking_request':
        // Handle booking request
        break;
      case 'view_review':
        // Navigate to reviews
        break;
      case 'view_message':
        // Navigate to messages
        break;
      case 'view_achievement':
        // Navigate to achievements
        break;
      case 'join_session':
        // Navigate to session
        break;
      case 'view_wallet':
        // Navigate to wallet
        break;
      case 'view_match':
        // Navigate to skill discovery
        break;
    }
    markAsRead(notification.id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Notifications</h1>
              <p className="text-muted-foreground">Stay updated with your skill exchange activities</p>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="outline" onClick={markAllAsRead} className="text-sm">
                  <Check className="w-4 h-4 mr-2" />
                  Mark all as read
                </Button>
              )}
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'gradient-eco text-white' : ''}
            >
              All ({allNotifications.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('unread')}
              className={filter === 'unread' ? 'gradient-eco text-white' : ''}
            >
              Unread ({unreadCount})
            </Button>
            <Button
              variant={filter === 'read' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('read')}
              className={filter === 'read' ? 'gradient-eco text-white' : ''}
            >
              Read ({allNotifications.length - unreadCount})
            </Button>
          </div>
        </div>

        <Card className="border-eco-green-200/50">
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <AnimatePresence>
                {filteredNotifications.length > 0 ? (
                  <div className="divide-y divide-eco-green-200/30">
                    {filteredNotifications.map((notification, index) => {
                      const Icon = notificationIcons[notification.type as keyof typeof notificationIcons];
                      const color = notificationColors[notification.type as keyof typeof notificationColors];
                      
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: 0.05 * index }}
                          className={`p-6 cursor-pointer transition-all duration-200 ease-out hover:bg-eco-green-50/50 ${
                            !notification.read ? 'bg-eco-green-50/30 border-l-4 border-l-eco-green-500' : ''
                          }`}
                          onClick={() => handleAction(notification)}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 bg-eco-green-500/10 rounded-full flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`w-5 h-5 ${color}`} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                      {notification.title}
                                    </h3>
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-eco-green-500 rounded-full" />
                                    )}
                                  </div>
                                  
                                  <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                                    {notification.message}
                                  </p>
                                  
                                  <div className="flex items-center gap-4">
                                    {notification.user && (
                                      <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gradient-to-br from-eco-green-500 to-eco-teal-500 rounded-full flex items-center justify-center text-xs">
                                          {notification.user.avatar}
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                          {notification.user.name}
                                        </span>
                                      </div>
                                    )}
                                    
                                    {notification.rating && (
                                      <div className="flex items-center gap-1">
                                        {[...Array(notification.rating)].map((_, i) => (
                                          <Star key={i} className="w-3 h-3 fill-current text-yellow-500" />
                                        ))}
                                      </div>
                                    )}
                                    
                                    {notification.badge && (
                                      <Badge variant="secondary" className="text-xs">
                                        {notification.badge}
                                      </Badge>
                                    )}
                                    
                                    {notification.credits && (
                                      <Badge className="bg-eco-green-500 text-white text-xs">
                                        +{notification.credits} credits
                                      </Badge>
                                    )}
                                    
                                    <span className="text-xs text-muted-foreground">
                                      {notification.time}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  {!notification.read && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        markAsRead(notification.id);
                                      }}
                                      className="p-1 h-auto"
                                    >
                                      <Check className="w-4 h-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeNotification(notification.id);
                                    }}
                                    className="p-1 h-auto text-muted-foreground hover:text-destructive"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-eco-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bell className="w-8 h-8 text-eco-green-500" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No notifications found</h3>
                    <p className="text-muted-foreground">
                      {filter === 'unread' 
                        ? "You're all caught up! No unread notifications."
                        : filter === 'read'
                        ? "No read notifications to show."
                        : "You don't have any notifications yet."
                      }
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}