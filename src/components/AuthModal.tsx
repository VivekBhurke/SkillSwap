import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from './ui/dialog';
import { Separator } from './ui/separator';
import { Eye, EyeOff, Loader2, Mail, Lock, User, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
}

export function AuthModal({ isOpen, onClose, mode: initialMode }: AuthModalProps) {
  const { signIn, signUp, isLoading } = useApp();
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or mode changes
  React.useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', email: '', password: '' });
      setErrors({});
      setShowPassword(false);
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (mode === 'signup' && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (mode === 'signin') {
        await signIn(formData.email, formData.password);
        toast.success('Welcome back!');
        onClose();
      } else {
        await signUp(formData.email, formData.password, formData.name);
        toast.success('Account created successfully!');
        onClose();
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setErrors({ general: error.message || 'Something went wrong' });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Clear general error when user makes changes
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  const fillDemoCredentials = () => {
    setFormData({
      name: 'Demo User',
      email: 'demo@skillswap.com',
      password: 'demo123'
    });
    setErrors({});
  };

  const generateTestEmail = () => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    return `test.${randomId}.${timestamp}@example.com`;
  };

  const fillTestCredentials = () => {
    setFormData({
      name: 'Test User',
      email: generateTestEmail(),
      password: 'test123'
    });
    setErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="relative">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-bold text-center">
              {mode === 'signin' ? 'Welcome Back' : 'Join SkillSwap'}
            </DialogTitle>
            <DialogDescription className="text-center mt-2">
              {mode === 'signin' 
                ? 'Sign in to continue your skill exchange journey'
                : 'Start sharing and learning skills today'
              }
            </DialogDescription>
          </DialogHeader>

          {/* Demo/Test Credentials Notice */}
          <div className="mx-6 mt-4">
            {mode === 'signin' ? (
              <div className="p-3 bg-eco-green-50 border border-eco-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-eco-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm flex-1">
                    <p className="font-medium text-eco-green-800">Demo Ready!</p>
                    <p className="text-eco-green-700 mt-1">
                      Click below to auto-fill demo credentials and explore the platform.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={fillDemoCredentials}
                      className="mt-2 border-eco-green-300 text-eco-green-700 hover:bg-eco-green-100"
                    >
                      Use Demo Account
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-eco-blue-50 border border-eco-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-eco-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm flex-1">
                    <p className="font-medium text-eco-blue-800">Create Your Account</p>
                    <p className="text-eco-blue-700 mt-1">
                      Join with any email or use a test account to explore the platform.
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={fillTestCredentials}
                        className="border-eco-blue-300 text-eco-blue-700 hover:bg-eco-blue-100"
                      >
                        Generate Test Account
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={fillDemoCredentials}
                        className="border-eco-green-300 text-eco-green-700 hover:bg-eco-green-100"
                      >
                        Use Demo Instead
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{errors.general}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full gradient-eco text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>

          <div className="px-6 pb-6">
            <Separator className="mb-4" />
            <div className="text-center text-sm text-muted-foreground">
              {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setErrors({});
                  setFormData({ name: '', email: '', password: '' });
                }}
                className="ml-1 text-eco-green-600 hover:text-eco-green-700 font-medium"
                disabled={isLoading}
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}