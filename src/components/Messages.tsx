import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Star,
  Clock,
  CheckCheck,
  Smile,
  Paperclip,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const conversations = [
  {
    id: '1',
    user: {
      name: 'Sarah Chen',
      avatar: '👩‍💻',
      status: 'online',
      skill: 'JavaScript'
    },
    lastMessage: "Thanks for the great session! When can we schedule the next one?",
    timestamp: '2 min ago',
    unread: 2,
    type: 'learning'
  },
  {
    id: '2',
    user: {
      name: 'Marcus Johnson',
      avatar: '🎨',
      status: 'away',
      skill: 'Graphic Design'
    },
    lastMessage: "I'll share some design resources with you",
    timestamp: '1 hour ago',
    unread: 0,
    type: 'teaching'
  },
  {
    id: '3',
    user: {
      name: 'Emily Rodriguez',
      avatar: '📈',
      status: 'offline',
      skill: 'Marketing'
    },
    lastMessage: "The marketing strategy looks great!",
    timestamp: '3 hours ago',
    unread: 1,
    type: 'learning'
  },
  {
    id: '4',
    user: {
      name: 'David Kim',
      avatar: '📷',
      status: 'online',
      skill: 'Photography'
    },
    lastMessage: "Let's meet tomorrow for the photo session",
    timestamp: '1 day ago',
    unread: 0,
    type: 'teaching'
  }
];

const messages = [
  {
    id: '1',
    sender: 'Sarah Chen',
    content: "Hi! I'm really excited to learn JavaScript from you. I've been following your tutorials and they're amazing!",
    timestamp: '2:30 PM',
    type: 'received'
  },
  {
    id: '2',
    sender: 'You',
    content: "Thank you so much! I'm excited to help you learn. What's your current experience level with programming?",
    timestamp: '2:32 PM',
    type: 'sent'
  },
  {
    id: '3',
    sender: 'Sarah Chen',
    content: "I have some basic HTML and CSS knowledge, but JavaScript is completely new to me. I'd love to start with the fundamentals.",
    timestamp: '2:35 PM',
    type: 'received'
  },
  {
    id: '4',
    sender: 'You',
    content: "Perfect! That's exactly where we should start. I'll prepare a beginner-friendly lesson on variables and functions. How about we schedule our first session for tomorrow?",
    timestamp: '2:38 PM',
    type: 'sent'
  },
  {
    id: '5',
    sender: 'Sarah Chen',
    content: "That sounds perfect! What time works best for you?",
    timestamp: '2:40 PM',
    type: 'received'
  },
  {
    id: '6',
    sender: 'You',
    content: "How about 3 PM? We can do a 1-hour session to start.",
    timestamp: '2:42 PM',
    type: 'sent',
    status: 'read'
  },
  {
    id: '7',
    sender: 'Sarah Chen',
    content: "Thanks for the great session! When can we schedule the next one?",
    timestamp: '2:45 PM',
    type: 'received'
  }
];

export function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.user.skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message sending logic here
      setNewMessage('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-eco-green-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Messages</h1>
          <p className="text-muted-foreground">Connect with your skill exchange partners</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[700px]">
          {/* Conversations List */}
          <Card className="border-eco-green-200/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <Badge variant="secondary" className="bg-eco-green-100 text-eco-green-700">
                  {conversations.reduce((acc, conv) => acc + conv.unread, 0)} new
                </Badge>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-eco-neutral-50 border-eco-green-200/50"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-1 p-4">
                  {filteredConversations.map((conversation, index) => (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ease-out hover:bg-eco-green-50 ${
                        selectedConversation.id === conversation.id
                          ? 'bg-eco-green-100 border border-eco-green-200'
                          : 'hover:bg-eco-neutral-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-eco-green-500 to-eco-teal-500 rounded-full flex items-center justify-center text-xl">
                            {conversation.user.avatar}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(conversation.user.status)} rounded-full border-2 border-white`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium truncate">{conversation.user.name}</h4>
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${
                                  conversation.type === 'teaching' 
                                    ? 'bg-eco-green-100 text-eco-green-700' 
                                    : 'bg-eco-blue-100 text-eco-blue-700'
                                }`}
                              >
                                {conversation.type === 'teaching' ? '🎓' : '📖'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                              {conversation.unread > 0 && (
                                <div className="w-5 h-5 bg-eco-green-500 text-white text-xs rounded-full flex items-center justify-center">
                                  {conversation.unread}
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{conversation.user.skill}</p>
                          <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-full border-eco-green-200/50">
              {/* Chat Header */}
              <CardHeader className="border-b border-eco-green-200/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-eco-green-500 to-eco-teal-500 rounded-full flex items-center justify-center text-xl">
                        {selectedConversation.user.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(selectedConversation.user.status)} rounded-full border-2 border-white`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedConversation.user.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{selectedConversation.user.skill}</span>
                        <span>•</span>
                        <span className="capitalize">{selectedConversation.user.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="p-2">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="p-0">
                <ScrollArea className="h-[480px]">
                  <div className="p-4 space-y-4">
                    <AnimatePresence>
                      {messages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * index }}
                          className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${message.type === 'sent' ? 'ml-4' : 'mr-4'}`}>
                            <div className={`p-3 rounded-2xl ${
                              message.type === 'sent'
                                ? 'bg-eco-green-500 text-white'
                                : 'bg-eco-neutral-100 text-foreground'
                            }`}>
                              <p className="text-sm leading-relaxed">{message.content}</p>
                            </div>
                            <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                              message.type === 'sent' ? 'justify-end' : 'justify-start'
                            }`}>
                              <span>{message.timestamp}</span>
                              {message.type === 'sent' && (
                                <CheckCheck className={`w-3 h-3 ${
                                  message.status === 'read' ? 'text-eco-green-500' : 'text-muted-foreground'
                                }`} />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>

                <Separator />

                {/* Message Input */}
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="p-2">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="pr-10 bg-eco-neutral-50 border-eco-green-200/50"
                      />
                      <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1">
                        <Smile className="w-4 h-4" />
                      </Button>
                    </div>
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={handleSendMessage}
                        className="gradient-eco text-white p-2"
                        disabled={!newMessage.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}