import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  Moon, 
  Sun,
  Trash2,
  Download,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

export function Settings() {
  const { currentUser, userProfile, updateUserProfile, signOut } = useApp();
  const [activeTab, setActiveTab] = useState('account');
  const [isSaving, setIsSaving] = useState(false);
  
  // Account Settings State
  const [name, setName] = useState(userProfile?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Profile Settings State
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [location, setLocation] = useState(userProfile?.location || '');
  const [website, setWebsite] = useState(userProfile?.website || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  
  // Notification Settings State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // Privacy Settings State
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [allowMessages, setAllowMessages] = useState(true);
  
  // Preferences State
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState(userProfile?.timezone || 'UTC');
  const [theme, setTheme] = useState('light');
  
  // Security Settings State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  const handleSaveAccount = async () => {
    setIsSaving(true);
    try {
      await updateUserProfile({ name });
      
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          toast.error('Passwords do not match');
          setIsSaving(false);
          return;
        }
        if (newPassword.length < 6) {
          toast.error('Password must be at least 6 characters');
          setIsSaving(false);
          return;
        }
        // In a real app, you'd validate current password and update password here
        toast.success('Password updated successfully');
      }
      
      toast.success('Account settings saved successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error('Failed to save account settings');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateUserProfile({ 
        bio, 
        location, 
        website, 
        phone 
      });
      toast.success('Profile settings saved successfully');
    } catch (error) {
      toast.error('Failed to save profile settings');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      // In a real app, save notification preferences to backend
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Notification preferences saved');
    } catch (error) {
      toast.error('Failed to save notification preferences');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSavePrivacy = async () => {
    setIsSaving(true);
    try {
      // In a real app, save privacy settings to backend
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Privacy settings saved');
    } catch (error) {
      toast.error('Failed to save privacy settings');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      await updateUserProfile({ timezone });
      // In a real app, save other preferences to backend
      toast.success('Preferences saved successfully');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDownloadData = async () => {
    try {
      const data = {
        user: currentUser,
        profile: userProfile,
        exportDate: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `skillswap-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Your data has been downloaded');
    } catch (error) {
      toast.error('Failed to download data');
    }
  };
  
  const handleDeleteAccount = async () => {
    try {
      // In a real app, this would delete the account from the backend
      localStorage.removeItem('skillswap_user');
      if (currentUser) {
        localStorage.removeItem(`skillswap_profile_${currentUser.id}`);
      }
      toast.success('Account deleted successfully');
      await signOut();
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-eco-green-600 to-eco-teal-600 bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 lg:grid-cols-6 gap-2 h-auto bg-eco-neutral-100 p-2 rounded-xl">
            <TabsTrigger value="account" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-eco-green-600" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Update your account details and change your password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      className="bg-eco-neutral-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed. Contact support if you need to update it.
                    </p>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h3 className="font-medium">Change Password</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveAccount}
                    disabled={isSaving}
                    className="gradient-eco text-white"
                  >
                    {isSaving ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="mr-2"
                        >
                          ⏳
                        </motion.div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </TabsContent>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-eco-green-600" />
                  Public Profile
                </CardTitle>
                <CardDescription>
                  Manage your public profile information visible to other users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell others about yourself and your skills..."
                      rows={4}
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {bio.length}/500 characters
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., San Francisco, CA"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g., +1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="gradient-eco text-white"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-eco-green-600" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to be notified about activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-eco-green-200 rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-eco-green-200 rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications in your browser
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-eco-green-200 rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="session-reminders">Session Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get reminded before upcoming skill swap sessions
                      </p>
                    </div>
                    <Switch
                      id="session-reminders"
                      checked={sessionReminders}
                      onCheckedChange={setSessionReminders}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-eco-green-200 rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="weekly-digest">Weekly Digest</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive a weekly summary of your activity
                      </p>
                    </div>
                    <Switch
                      id="weekly-digest"
                      checked={weeklyDigest}
                      onCheckedChange={setWeeklyDigest}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-eco-green-200 rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-emails">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about new features and offers
                      </p>
                    </div>
                    <Switch
                      id="marketing-emails"
                      checked={marketingEmails}
                      onCheckedChange={setMarketingEmails}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveNotifications}
                    disabled={isSaving}
                    className="gradient-eco text-white"
                  >
                    {isSaving ? 'Saving...' : 'Save Preferences'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-eco-green-600" />
                  Privacy & Visibility
                </CardTitle>
                <CardDescription>
                  Control who can see your information and contact you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-visibility">Profile Visibility</Label>
                    <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span>Public - Anyone can see your profile</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="members">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Members Only - Only SkillSwap members</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center gap-2">
                            <EyeOff className="w-4 h-4" />
                            <span>Private - Only you can see your profile</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between p-4 border border-eco-green-200 rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-email">Show Email Address</Label>
                      <p className="text-sm text-muted-foreground">
                        Display your email on your public profile
                      </p>
                    </div>
                    <Switch
                      id="show-email"
                      checked={showEmail}
                      onCheckedChange={setShowEmail}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-eco-green-200 rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-phone">Show Phone Number</Label>
                      <p className="text-sm text-muted-foreground">
                        Display your phone number on your public profile
                      </p>
                    </div>
                    <Switch
                      id="show-phone"
                      checked={showPhone}
                      onCheckedChange={setShowPhone}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-eco-green-200 rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="allow-messages">Allow Messages</Label>
                      <p className="text-sm text-muted-foreground">
                        Let other users send you messages
                      </p>
                    </div>
                    <Switch
                      id="allow-messages"
                      checked={allowMessages}
                      onCheckedChange={setAllowMessages}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleSavePrivacy}
                    disabled={isSaving}
                    className="gradient-eco text-white"
                  >
                    {isSaving ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-eco-green-600" />
                  General Preferences
                </CardTitle>
                <CardDescription>
                  Customize your SkillSwap experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="pt">Português</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <div className="flex gap-4">
                      <Button
                        variant={theme === 'light' ? 'default' : 'outline'}
                        className={theme === 'light' ? 'gradient-eco text-white' : ''}
                        onClick={() => setTheme('light')}
                      >
                        <Sun className="w-4 h-4 mr-2" />
                        Light
                      </Button>
                      <Button
                        variant={theme === 'dark' ? 'default' : 'outline'}
                        className={theme === 'dark' ? 'gradient-eco text-white' : ''}
                        onClick={() => setTheme('dark')}
                      >
                        <Moon className="w-4 h-4 mr-2" />
                        Dark
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Dark theme is coming soon!
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleSavePreferences}
                    disabled={isSaving}
                    className="gradient-eco text-white"
                  >
                    {isSaving ? 'Saving...' : 'Save Preferences'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-eco-green-600" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account security and authentication
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-eco-green-200 rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="2fa">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                      {twoFactorEnabled && (
                        <Badge variant="secondary" className="mt-2">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Enabled
                        </Badge>
                      )}
                    </div>
                    <Switch
                      id="2fa"
                      checked={twoFactorEnabled}
                      onCheckedChange={(checked) => {
                        setTwoFactorEnabled(checked);
                        toast.success(checked ? '2FA enabled' : '2FA disabled');
                      }}
                    />
                  </div>

                  <div className="p-4 border border-eco-green-200 rounded-lg">
                    <div className="space-y-0.5 mb-3">
                      <Label>Active Sessions</Label>
                      <p className="text-sm text-muted-foreground">
                        You're currently signed in on these devices
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-eco-neutral-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-eco-green-100 rounded-full flex items-center justify-center">
                            💻
                          </div>
                          <div>
                            <p className="text-sm font-medium">Current Device</p>
                            <p className="text-xs text-muted-foreground">Last active: Now</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-eco-green-100 text-eco-green-700">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-5 h-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Irreversible actions that affect your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-eco-green-200 rounded-lg">
                    <div className="space-y-0.5 mb-3">
                      <Label>Download Your Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Download a copy of all your SkillSwap data
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleDownloadData}
                      className="w-full sm:w-auto"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Data
                    </Button>
                  </div>

                  <div className="p-4 border border-destructive rounded-lg bg-destructive/5">
                    <div className="space-y-0.5 mb-3">
                      <Label className="text-destructive">Delete Account</Label>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="destructive"
                          className="w-full sm:w-auto"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove all your data from our servers, including:
                            <ul className="list-disc list-inside mt-2 space-y-1">
                              <li>Your profile and personal information</li>
                              <li>All your skills and bookings</li>
                              <li>Your credit balance and transaction history</li>
                              <li>All messages and connections</li>
                            </ul>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Yes, Delete My Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
