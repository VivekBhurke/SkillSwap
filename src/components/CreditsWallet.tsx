import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Gift, 
  Award, 
  Clock,
  Users,
  Star,
  Trophy,
  Target,
  Calendar,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  ShoppingCart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AuthModal } from './AuthModal';
import { BuyCreditsDialog } from './BuyCreditsDialog';
import { motion, AnimatePresence } from 'motion/react';

// Mock transaction data for demonstration
const mockTransactions = [
  {
    id: '1',
    type: 'earned',
    amount: 2,
    description: 'Taught JavaScript Fundamentals to Sarah Chen',
    date: '2024-08-25T14:30:00Z',
    skill: 'JavaScript',
    participant: 'Sarah Chen'
  },
  {
    id: '2',
    type: 'spent',
    amount: 1,
    description: 'Learned Spanish Conversation from Carlos Rodriguez',
    date: '2024-08-24T16:00:00Z',
    skill: 'Spanish',
    participant: 'Carlos Rodriguez'
  },
  {
    id: '3',
    type: 'earned',
    amount: 1,
    description: 'Taught Guitar Basics to Emily Zhang',
    date: '2024-08-23T18:45:00Z',
    skill: 'Guitar',
    participant: 'Emily Zhang'
  },
  {
    id: '4',
    type: 'spent',
    amount: 2,
    description: 'Learned Photography Composition from Maya Patel',
    date: '2024-08-22T10:15:00Z',
    skill: 'Photography',
    participant: 'Maya Patel'
  },
  {
    id: '5',
    type: 'purchased',
    amount: 10,
    description: 'Purchased credit bundle',
    date: '2024-08-20T09:00:00Z'
  }
];

export function CreditsWallet() {
  const { currentUser, userProfile } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBuyCreditsDialog, setShowBuyCreditsDialog] = useState(false);

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
                <Wallet className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Your Credits Wallet</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Sign in to track your credits, transactions, and achievements
              </p>
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="gradient-eco text-white hover:shadow-lg transition-all duration-200 ease-out"
              >
                Access Wallet
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

  const userTransactions = mockTransactions;
  const currentCredits = userProfile?.credits || 0;
  
  const stats = {
    totalEarned: userTransactions
      .filter(t => t.type === 'earned')
      .reduce((sum, t) => sum + t.amount, 0),
    totalSpent: userTransactions
      .filter(t => t.type === 'spent')
      .reduce((sum, t) => sum + t.amount, 0),
    totalPurchased: userTransactions
      .filter(t => t.type === 'purchased')
      .reduce((sum, t) => sum + t.amount, 0),
    thisMonth: userTransactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        const now = new Date();
        return transactionDate.getMonth() === now.getMonth() && 
               transactionDate.getFullYear() === now.getFullYear();
      }).length
  };

  const badges = [
    {
      id: 'first-teacher',
      title: 'First Lesson',
      description: 'Taught your first skill session',
      icon: Award,
      earned: stats.totalEarned > 0,
      date: userTransactions.find(t => t.type === 'earned')?.date,
      color: 'yellow'
    },
    {
      id: 'early-adopter',
      title: 'Early Adopter',
      description: 'Joined SkillSwap community',
      icon: Trophy,
      earned: true,
      date: '2024-08-10',
      color: 'blue'
    },
    {
      id: 'five-hours',
      title: '5 Hours Taught',
      description: 'Completed 5 hours of teaching',
      icon: Clock,
      earned: stats.totalEarned >= 5,
      progress: stats.totalEarned,
      target: 5,
      color: 'green'
    },
    {
      id: 'top-mentor',
      title: 'Top Mentor',
      description: 'Highest rated teacher this month',
      icon: Star,
      earned: (userProfile?.rating || 0) >= 4.9 && stats.totalEarned > 0,
      progress: userProfile?.rating || 0,
      target: 4.9,
      color: 'yellow'
    },
    {
      id: 'community-builder',
      title: 'Community Builder',
      description: 'Helped 10 people learn new skills',
      icon: Users,
      earned: stats.totalEarned >= 10,
      progress: stats.totalEarned,
      target: 10,
      color: 'purple'
    },
    {
      id: 'skill-collector',
      title: 'Skill Collector',
      description: 'Learned 5 different skills',
      icon: Target,
      earned: stats.totalSpent >= 5,
      progress: stats.totalSpent,
      target: 5,
      color: 'teal'
    }
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned':
        return <ArrowUpRight className="w-5 h-5 text-eco-green-600" />;
      case 'spent':
        return <ArrowDownRight className="w-5 h-5 text-red-600" />;
      case 'purchased':
        return <ShoppingCart className="w-5 h-5 text-eco-blue-600" />;
      case 'gifted':
        return <Gift className="w-5 h-5 text-purple-600" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned':
        return 'text-eco-green-600';
      case 'spent':
        return 'text-red-600';
      case 'purchased':
        return 'text-eco-blue-600';
      case 'gifted':
        return 'text-purple-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getBadgeColors = (color: string, earned: boolean) => {
    const colors = {
      yellow: earned ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-gray-50 border-gray-200 text-gray-600',
      blue: earned ? 'bg-eco-blue-50 border-eco-blue-200 text-eco-blue-800' : 'bg-gray-50 border-gray-200 text-gray-600',
      green: earned ? 'bg-eco-green-50 border-eco-green-200 text-eco-green-800' : 'bg-gray-50 border-gray-200 text-gray-600',
      purple: earned ? 'bg-purple-50 border-purple-200 text-purple-800' : 'bg-gray-50 border-gray-200 text-gray-600',
      teal: earned ? 'bg-eco-teal-50 border-eco-teal-200 text-eco-teal-800' : 'bg-gray-50 border-gray-200 text-gray-600'
    };
    return colors[color] || colors.gray;
  };

  const filterTransactions = (type: string) => {
    if (type === 'all') return userTransactions;
    return userTransactions.filter(t => t.type === type);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl lg:text-5xl font-bold">
            Your{' '}
            <span className="bg-gradient-to-r from-eco-green-600 to-eco-teal-600 bg-clip-text text-transparent">
              Credits Wallet
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Manage your time credits and track your skill exchange journey
          </p>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-eco-green-500 via-eco-teal-500 to-eco-blue-500 text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-4">
                  <div>
                    <p className="text-white/80 text-lg mb-2">Current Balance</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-5xl font-bold">{currentCredits}</span>
                      <span className="text-white/90 text-xl">credits</span>
                    </div>
                    <p className="text-white/80 mt-2">
                      = {currentCredits} hours of learning time
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      💰 Worth ${currentCredits * 15} value
                    </Badge>
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      📈 +{stats.totalEarned} earned this month
                    </Badge>
                  </div>
                </div>
                
                <div className="text-right space-y-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 flex items-center justify-center ml-auto"
                  >
                    <Wallet className="w-8 h-8 text-white" />
                  </motion.div>
                  <Button 
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                    onClick={() => setShowBuyCreditsDialog(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Buy Credits
                  </Button>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-4 right-32 w-16 h-16 bg-white/10 rounded-full blur-xl"
              />
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute bottom-4 left-32 w-12 h-12 bg-white/10 rounded-full blur-xl"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            {
              title: 'Total Earned',
              value: stats.totalEarned,
              icon: TrendingUp,
              color: 'text-eco-green-600',
              bgColor: 'bg-eco-green-100',
              description: 'credits from teaching'
            },
            {
              title: 'Total Spent',
              value: stats.totalSpent,
              icon: TrendingDown,
              color: 'text-red-600',
              bgColor: 'bg-red-100',
              description: 'credits on learning'
            },
            {
              title: 'Purchased',
              value: stats.totalPurchased,
              icon: ShoppingCart,
              color: 'text-eco-blue-600',
              bgColor: 'bg-eco-blue-100',
              description: 'credits bought'
            },
            {
              title: 'This Month',
              value: stats.thisMonth,
              icon: Calendar,
              color: 'text-eco-teal-600',
              bgColor: 'bg-eco-teal-100',
              description: 'transactions'
            }
          ].map((stat, index) => {
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
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                        className="w-2 h-2 bg-eco-green-500 rounded-full"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Transaction History */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-2"
          >
            <Card className="border-eco-green-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-eco-green-500" />
                  Transaction History
                </CardTitle>
                <CardDescription>
                  Track all your credit transactions and skill exchanges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="earned">Earned</TabsTrigger>
                    <TabsTrigger value="spent">Spent</TabsTrigger>
                    <TabsTrigger value="purchased">Bought</TabsTrigger>
                  </TabsList>

                  {['all', 'earned', 'spent', 'purchased'].map((tabValue) => (
                    <TabsContent key={tabValue} value={tabValue} className="space-y-4">
                      <AnimatePresence>
                        {filterTransactions(tabValue).length > 0 ? (
                          filterTransactions(tabValue).map((transaction, index) => (
                            <motion.div
                              key={transaction.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ delay: 0.05 * index }}
                              className="flex items-center justify-between p-4 border border-eco-green-200/50 rounded-lg hover:bg-eco-neutral-50 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-eco-neutral-100 rounded-xl flex items-center justify-center">
                                  {getTransactionIcon(transaction.type)}
                                </div>
                                <div className="space-y-1">
                                  <p className="font-medium">{transaction.description}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(transaction.date).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                  {transaction.participant && (
                                    <p className="text-xs text-muted-foreground">
                                      with {transaction.participant}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`font-bold ${getTransactionColor(transaction.type)}`}>
                                  {transaction.type === 'earned' || transaction.type === 'purchased' ? '+' : '-'}
                                  {transaction.amount} credits
                                </p>
                                <Badge variant="outline" className="text-xs mt-1">
                                  {transaction.type}
                                </Badge>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                          >
                            <Wallet className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="font-semibold text-lg mb-2">
                              No {tabValue === 'all' ? '' : tabValue} transactions yet
                            </h3>
                            <p className="text-muted-foreground mb-6">
                              {tabValue === 'earned' && 'Start teaching skills to earn credits'}
                              {tabValue === 'spent' && 'Book sessions to start learning'}
                              {tabValue === 'purchased' && 'Buy credits to get started'}
                              {tabValue === 'all' && 'Start your skill exchange journey'}
                            </p>
                            <Button 
                              className="gradient-eco text-white"
                              onClick={() => tabValue === 'purchased' && setShowBuyCreditsDialog(true)}
                            >
                              {tabValue === 'purchased' ? 'Buy Credits' : 'Get Started'}
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Badges & Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Card className="border-eco-green-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-eco-green-500" />
                  Achievements
                </CardTitle>
                <CardDescription>
                  Your progress and badges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {badges.map((badge, index) => {
                  const Icon = badge.icon;
                  return (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className={`p-4 rounded-lg border transition-all duration-200 ${getBadgeColors(badge.color, badge.earned)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          badge.earned ? `bg-${badge.color}-100` : 'bg-gray-100'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            badge.earned ? 
                              badge.color === 'yellow' ? 'text-yellow-600' : 
                              badge.color === 'blue' ? 'text-eco-blue-600' :
                              badge.color === 'green' ? 'text-eco-green-600' :
                              badge.color === 'purple' ? 'text-purple-600' :
                              'text-eco-teal-600'
                              : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{badge.title}</h4>
                            {badge.earned && (
                              <Badge className="bg-eco-green-100 text-eco-green-700">
                                ✓ Earned
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm opacity-80">{badge.description}</p>
                          
                          {badge.earned && badge.date && (
                            <p className="text-xs opacity-60">
                              Earned on {new Date(badge.date).toLocaleDateString()}
                            </p>
                          )}
                          
                          {!badge.earned && badge.progress !== undefined && badge.target && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs opacity-60">
                                <span>Progress</span>
                                <span>{badge.progress}/{badge.target}</span>
                              </div>
                              <Progress 
                                value={(badge.progress / badge.target) * 100} 
                                className="h-2"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Buy Credits Dialog */}
      <BuyCreditsDialog
        isOpen={showBuyCreditsDialog}
        onClose={() => setShowBuyCreditsDialog(false)}
      />
    </div>
  );
}