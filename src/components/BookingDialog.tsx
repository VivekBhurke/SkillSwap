import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Loader2, Calendar, Clock, MapPin, Video, User } from 'lucide-react';
import { makeRequest } from '../utils/supabase/client';
import { useApp } from '../context/AppContext';
import { UserSkill, User as UserType } from '../types';

interface BookingDialogProps {
  skill: UserSkill;
  teacher: UserType;
  children: React.ReactNode;
}

export function BookingDialog({ skill, teacher, children }: BookingDialogProps) {
  const { currentUser, bookSession, setCurrentPage } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    duration: 1,
    isOnline: true,
    location: '',
    message: ''
  });

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('Please sign in to book a session');
      return;
    }

    if (currentUser.credits < bookingData.duration) {
      setError(`Insufficient credits. You need ${bookingData.duration} credits but only have ${currentUser.credits}.`);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const sessionDate = new Date(`${bookingData.date}T${bookingData.time}`);
      
      await bookSession({
        teacherId: teacher.id,
        studentId: currentUser.id,
        skillId: skill.id,
        skillName: skill.name,
        date: sessionDate.toISOString(),
        duration: bookingData.duration,
        credits: bookingData.duration,
        isOnline: bookingData.isOnline,
        location: bookingData.location,
        status: 'scheduled'
      });

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setCurrentPage('dashboard');
      }, 2000);

    } catch (error: any) {
      console.error('Booking error:', error);
      setError(error.message || 'Failed to book session');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Book a Session</DialogTitle>
          <DialogDescription>
            Schedule your learning session with {teacher.name}
          </DialogDescription>
        </DialogHeader>

        {/* Teacher and Skill Info */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={teacher.avatar} />
              <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-semibold">{skill.name}</h4>
              <p className="text-sm text-gray-600">with {teacher.name}</p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>⭐ {teacher.rating}</span>
                <span>•</span>
                <span>{teacher.reviewCount} reviews</span>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
              {skill.creditsPerHour} credit/hr
            </Badge>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <AlertDescription>
              Session booked successfully! Redirecting to your dashboard...
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="booking-date">Date</Label>
              <Input
                id="booking-date"
                type="date"
                value={bookingData.date}
                onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="booking-time">Time</Label>
              <Select
                value={bookingData.time}
                onValueChange={(value) => setBookingData(prev => ({ ...prev, time: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="booking-duration">Duration (hours)</Label>
            <Select
              value={bookingData.duration.toString()}
              onValueChange={(value) => setBookingData(prev => ({ ...prev, duration: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour (1 credit)</SelectItem>
                <SelectItem value="2">2 hours (2 credits)</SelectItem>
                <SelectItem value="3">3 hours (3 credits)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Session Type</Label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setBookingData(prev => ({ ...prev, isOnline: true }))}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  bookingData.isOnline
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Video className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Online</span>
              </button>
              <button
                type="button"
                onClick={() => setBookingData(prev => ({ ...prev, isOnline: false }))}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  !bookingData.isOnline
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <MapPin className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm font-medium">In-Person</span>
              </button>
            </div>
          </div>

          {!bookingData.isOnline && (
            <div className="space-y-2">
              <Label htmlFor="booking-location">Meeting Location</Label>
              <Input
                id="booking-location"
                value={bookingData.location}
                onChange={(e) => setBookingData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Coffee shop downtown, Library, etc."
                required={!bookingData.isOnline}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="booking-message">Message (optional)</Label>
            <Textarea
              id="booking-message"
              value={bookingData.message}
              onChange={(e) => setBookingData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Any specific topics you'd like to cover or questions you have..."
              rows={3}
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm">
              <span>Session cost:</span>
              <span className="font-semibold">{bookingData.duration} credits</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Your balance:</span>
              <span className={currentUser.credits >= bookingData.duration ? 'text-green-600' : 'text-red-600'}>
                {currentUser.credits} credits
              </span>
            </div>
            <hr className="my-2" />
            <div className="flex items-center justify-between font-semibold">
              <span>After booking:</span>
              <span className={currentUser.credits >= bookingData.duration ? 'text-green-600' : 'text-red-600'}>
                {currentUser.credits - bookingData.duration} credits
              </span>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={isLoading || currentUser.credits < bookingData.duration}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Book Session
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}