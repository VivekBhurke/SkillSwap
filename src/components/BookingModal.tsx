import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Calendar } from './ui/calendar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from './ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select';
import { Separator } from './ui/separator';
import {
  Calendar as CalendarIcon,
  Clock,
  CreditCard,
  MapPin,
  Star,
  Video,
  MessageCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: any;
  teacher: any;
}

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
  '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
];

export function BookingModal({ isOpen, onClose, skill, teacher }: BookingModalProps) {
  const { currentUser, userProfile } = useApp();
  const [step, setStep] = useState(1); // 1: Details, 2: Schedule, 3: Payment, 4: Confirmation
  const [bookingData, setBookingData] = useState({
    date: new Date(),
    time: '',
    duration: 1,
    message: '',
    sessionType: 'online'
  });
  const [isLoading, setIsLoading] = useState(false);

  const totalCredits = skill?.creditsPerHour * bookingData.duration;
  const hasEnoughCredits = (userProfile?.credits || 0) >= totalCredits;

  const handleBooking = async () => {
    if (!hasEnoughCredits) {
      toast.error('Insufficient credits. Please add more credits to your wallet.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate booking API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success and move to confirmation step
      setStep(4);
      toast.success('Session booked successfully!');
    } catch (error) {
      toast.error('Failed to book session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return 'Configure your session details and preferences';
      case 2: return 'Select your preferred date and time for the session';
      case 3: return 'Review and confirm your booking details';
      case 4: return 'Your session has been successfully booked';
      default: return '';
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-eco-green-500 to-eco-teal-500 rounded-xl flex items-center justify-center text-2xl text-white">
                {teacher?.avatar}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{skill?.name}</h3>
                <p className="text-muted-foreground">with {teacher?.name}</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current text-yellow-500" />
                    <span>{teacher?.rating} ({teacher?.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{teacher?.location}</span>
                  </div>
                </div>
              </div>
              <Badge className="bg-eco-green-500 text-white">
                {skill?.creditsPerHour} credits/hr
              </Badge>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Session Duration</Label>
                <Select 
                  value={bookingData.duration.toString()} 
                  onValueChange={(value) => setBookingData(prev => ({ ...prev, duration: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="3">3 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionType">Session Type</Label>
                <Select 
                  value={bookingData.sessionType} 
                  onValueChange={(value) => setBookingData(prev => ({ ...prev, sessionType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Online Video Call
                      </div>
                    </SelectItem>
                    <SelectItem value="inperson">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        In-Person Meeting
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message to Teacher (Optional)</Label>
                <Textarea
                  id="message"
                  value={bookingData.message}
                  onChange={(e) => setBookingData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Let the teacher know what you'd like to focus on..."
                  rows={3}
                />
              </div>
            </div>

            <div className="bg-eco-green-50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-eco-green-800">Session Summary</h4>
              <div className="flex justify-between text-sm">
                <span>Duration:</span>
                <span>{bookingData.duration} hour{bookingData.duration > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Rate:</span>
                <span>{skill?.creditsPerHour} credits/hour</span>
              </div>
              <Separator className="bg-eco-green-200" />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>{totalCredits} credits</span>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Choose Date & Time</h3>
              <p className="text-muted-foreground">Select when you'd like to have your session</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label>Select Date</Label>
                <Calendar
                  mode="single"
                  selected={bookingData.date}
                  onSelect={(date) => date && setBookingData(prev => ({ ...prev, date }))}
                  disabled={(date) => date < new Date() || date < new Date(Date.now() - 86400000)}
                  className="rounded-lg border border-eco-green-200"
                />
              </div>

              <div className="space-y-3">
                <Label>Available Times</Label>
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={bookingData.time === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setBookingData(prev => ({ ...prev, time }))}
                      className={bookingData.time === time ? 
                        "gradient-eco text-white" : 
                        "border-eco-green-200 hover:bg-eco-green-50"
                      }
                    >
                      {time}
                    </Button>
                  ))}
                </div>
                
                {bookingData.time && (
                  <div className="p-3 bg-eco-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-eco-green-800">
                      <Clock className="w-4 h-4" />
                      <span>
                        Selected: {bookingData.date.toLocaleDateString()} at {bookingData.time}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Confirm Booking</h3>
              <p className="text-muted-foreground">Review your session details and confirm payment</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-eco-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-eco-green-500 to-eco-teal-500 rounded-lg flex items-center justify-center text-white">
                    {teacher?.avatar}
                  </div>
                  <div>
                    <h4 className="font-medium">{skill?.name}</h4>
                    <p className="text-sm text-muted-foreground">with {teacher?.name}</p>
                  </div>
                </div>
                <Badge variant="outline">{skill?.level}</Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {bookingData.date.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{bookingData.time} ({bookingData.duration}h)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {bookingData.sessionType === 'online' ? 
                      <Video className="w-4 h-4 text-muted-foreground" /> :
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                    }
                    <span className="text-sm">
                      {bookingData.sessionType === 'online' ? 'Online Video Call' : 'In-Person Meeting'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-eco-green-50 rounded-lg">
                    <h5 className="font-medium text-eco-green-800 mb-2">Payment Details</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Session ({bookingData.duration}h):</span>
                        <span>{totalCredits} credits</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Your balance:</span>
                        <span>{userProfile?.credits || 0} credits</span>
                      </div>
                      <Separator className="bg-eco-green-200" />
                      <div className="flex justify-between font-medium">
                        <span>After booking:</span>
                        <span>{(userProfile?.credits || 0) - totalCredits} credits</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {bookingData.message && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h5 className="font-medium mb-1">Your Message:</h5>
                  <p className="text-sm text-muted-foreground">{bookingData.message}</p>
                </div>
              )}

              {!hasEnoughCredits && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <X className="w-4 h-4" />
                    <span className="text-sm font-medium">Insufficient Credits</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    You need {totalCredits - (userProfile?.credits || 0)} more credits to book this session.
                  </p>
                  <Button size="sm" className="mt-2 bg-red-600 hover:bg-red-700 text-white">
                    Add Credits
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-eco-green-500 rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>

            <div>
              <h3 className="text-2xl font-bold text-eco-green-600 mb-2">Booking Confirmed!</h3>
              <p className="text-muted-foreground">
                Your session with {teacher?.name} has been successfully booked.
              </p>
            </div>

            <div className="p-4 bg-eco-green-50 rounded-lg text-left">
              <h4 className="font-medium text-eco-green-800 mb-3">Session Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Skill:</span>
                  <span>{skill?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Teacher:</span>
                  <span>{teacher?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span>{bookingData.date.toLocaleDateString()} at {bookingData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{bookingData.duration} hour{bookingData.duration > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span>Session Type:</span>
                  <span>{bookingData.sessionType === 'online' ? 'Online' : 'In-Person'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                You'll receive a confirmation email with meeting details shortly.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" className="border-eco-green-200">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message Teacher
                </Button>
                <Button className="gradient-eco text-white">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Add to Calendar
                </Button>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return bookingData.duration > 0;
      case 2: return bookingData.date && bookingData.time;
      case 3: return hasEnoughCredits;
      default: return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">
            {step === 4 ? 'Booking Confirmed!' : 'Book a Session'}
          </DialogTitle>
          <DialogDescription>
            {getStepDescription()}
          </DialogDescription>
          
          {step !== 4 && (
            <div className="flex items-center gap-2 mt-4">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    stepNumber === step 
                      ? 'bg-eco-green-500 text-white' 
                      : stepNumber < step 
                        ? 'bg-eco-green-100 text-eco-green-600'
                        : 'bg-gray-100 text-gray-400'
                  }`}>
                    {stepNumber < step ? <CheckCircle className="w-4 h-4" /> : stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      stepNumber < step ? 'bg-eco-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogHeader>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </div>

        {step !== 4 && (
          <div className="p-6 pt-0 flex justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : (
              <div />
            )}
            
            {step < 3 ? (
              <Button 
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="gradient-eco text-white"
              >
                Continue
              </Button>
            ) : (
              <Button 
                onClick={handleBooking}
                disabled={!canProceed() || isLoading}
                className="gradient-eco text-white"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Booking...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Confirm Booking ({totalCredits} credits)
                  </div>
                )}
              </Button>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="p-6 pt-0">
            <Button onClick={onClose} className="w-full gradient-eco text-white">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}