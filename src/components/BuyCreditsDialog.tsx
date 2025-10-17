import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { 
  Coins, 
  CreditCard, 
  Check,
  Sparkles,
  TrendingUp,
  Zap,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { useApp } from '../context/AppContext';

interface BuyCreditsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const creditPackages = [
  {
    id: '5-credits',
    credits: 5,
    price: 49,
    popular: false,
    savings: 0,
    description: 'Perfect for trying out the platform',
    features: ['5 hours of learning', 'Basic support', 'Valid for 6 months']
  },
  {
    id: '10-credits',
    credits: 10,
    price: 89,
    popular: true,
    savings: 10,
    description: 'Most popular for regular learners',
    features: ['10 hours of learning', 'Priority support', 'Valid for 12 months', '10% bonus credits']
  },
  {
    id: '25-credits',
    credits: 25,
    price: 199,
    popular: false,
    savings: 25,
    description: 'Best value for serious learners',
    features: ['25 hours of learning', 'VIP support', 'Valid for 18 months', '25% bonus credits', 'Exclusive workshops']
  },
  {
    id: 'custom',
    credits: 0,
    price: 0,
    popular: false,
    savings: 0,
    description: 'Choose your own amount',
    features: ['Custom credit amount', 'Flexible pricing', 'Valid for 12 months']
  }
];

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
  { id: 'paypal', name: 'PayPal', icon: CreditCard },
  { id: 'apple', name: 'Apple Pay', icon: CreditCard },
  { id: 'google', name: 'Google Pay', icon: CreditCard }
];

export function BuyCreditsDialog({ isOpen, onClose }: BuyCreditsDialogProps) {
  const { updateUserProfile, userProfile } = useApp();
  const [selectedPackage, setSelectedPackage] = useState('10-credits');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'select' | 'payment' | 'success'>('select');

  const selectedPkg = creditPackages.find(pkg => pkg.id === selectedPackage);
  const creditsToAdd = selectedPackage === 'custom' 
    ? parseInt(customAmount) || 0 
    : selectedPkg?.credits || 0;
  
  const totalPrice = selectedPackage === 'custom'
    ? (parseInt(customAmount) || 0) * 10
    : selectedPkg?.price || 0;

  const handlePurchase = async () => {
    if (creditsToAdd === 0) {
      toast.error('Please select a package or enter a valid amount');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update user credits
      const currentCredits = userProfile?.credits || 0;
      await updateUserProfile({
        credits: currentCredits + creditsToAdd
      });

      setStep('success');
      
      toast.success(`Successfully purchased ${creditsToAdd} credits!`, {
        description: 'Your credits have been added to your wallet',
        duration: 5000
      });

      // Auto-close after success
      setTimeout(() => {
        onClose();
        setStep('select');
      }, 3000);
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Purchase failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
      setTimeout(() => setStep('select'), 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-2xl">
                  <Coins className="w-6 h-6 text-eco-green-500" />
                  Buy Credits
                </DialogTitle>
                <DialogDescription>
                  Choose a credit package to continue your learning journey
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Credit Packages */}
                <div className="grid md:grid-cols-2 gap-4">
                  {creditPackages.map((pkg) => (
                    <motion.div
                      key={pkg.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedPackage === pkg.id
                            ? 'border-eco-green-500 border-2 shadow-lg'
                            : 'border-eco-green-200/50 hover:border-eco-green-300'
                        } ${pkg.popular ? 'relative' : ''}`}
                        onClick={() => setSelectedPackage(pkg.id)}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge className="gradient-eco text-white shadow-lg">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Most Popular
                            </Badge>
                          </div>
                        )}
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-3xl font-bold">
                                  {pkg.id === 'custom' ? 'Custom' : pkg.credits}
                                </span>
                                {pkg.id !== 'custom' && (
                                  <span className="text-muted-foreground">credits</span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{pkg.description}</p>
                            </div>
                            {selectedPackage === pkg.id && (
                              <div className="w-6 h-6 rounded-full bg-eco-green-500 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>

                          {pkg.id === 'custom' ? (
                            <div className="space-y-2 mb-4">
                              <Label htmlFor="custom-amount">Enter credits amount</Label>
                              <Input
                                id="custom-amount"
                                type="number"
                                min="1"
                                max="100"
                                placeholder="Enter amount"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                className="border-eco-green-200/50"
                              />
                              {customAmount && parseInt(customAmount) > 0 && (
                                <p className="text-sm text-muted-foreground">
                                  = ${parseInt(customAmount) * 10} total
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="mb-4">
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-eco-green-600">
                                  ${pkg.price}
                                </span>
                                {pkg.savings > 0 && (
                                  <Badge variant="secondary" className="bg-eco-green-100 text-eco-green-700">
                                    Save {pkg.savings}%
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                ${(pkg.price / pkg.credits).toFixed(2)} per credit
                              </p>
                            </div>
                          )}

                          <ul className="space-y-2">
                            {pkg.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <Check className="w-4 h-4 text-eco-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Summary */}
                <Card className="border-eco-green-200/50 bg-eco-green-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Purchase Summary</p>
                        <p className="text-sm text-muted-foreground">
                          {creditsToAdd} credits = {creditsToAdd} hours of learning
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-eco-green-600">${totalPrice}</p>
                        <p className="text-xs text-muted-foreground">One-time payment</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="gradient-eco text-white"
                    onClick={() => setStep('payment')}
                    disabled={creditsToAdd === 0 || isProcessing}
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-2xl">
                  <CreditCard className="w-6 h-6 text-eco-green-500" />
                  Payment Method
                </DialogTitle>
                <DialogDescription>
                  Complete your purchase of {creditsToAdd} credits for ${totalPrice}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Payment Method Selection */}
                <div>
                  <Label className="mb-3 block">Select Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-3">
                      {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        return (
                          <Card
                            key={method.id}
                            className={`cursor-pointer transition-all ${
                              paymentMethod === method.id
                                ? 'border-eco-green-500 border-2'
                                : 'border-eco-green-200/50 hover:border-eco-green-300'
                            }`}
                            onClick={() => setPaymentMethod(method.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <RadioGroupItem value={method.id} id={method.id} />
                                <Icon className="w-5 h-5 text-muted-foreground" />
                                <Label
                                  htmlFor={method.id}
                                  className="flex-1 cursor-pointer"
                                >
                                  {method.name}
                                </Label>
                                {paymentMethod === method.id && (
                                  <Check className="w-5 h-5 text-eco-green-500" />
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </RadioGroup>
                </div>

                {/* Mock Card Details (for demo) */}
                {paymentMethod === 'card' && (
                  <Card className="border-eco-green-200/50 bg-eco-neutral-50">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="card-number">Card Number</Label>
                          <Input
                            id="card-number"
                            placeholder="1234 5678 9012 3456"
                            className="mt-1"
                            disabled={isProcessing}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input
                              id="expiry"
                              placeholder="MM/YY"
                              className="mt-1"
                              disabled={isProcessing}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              className="mt-1"
                              disabled={isProcessing}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Security Notice */}
                <div className="bg-eco-blue-50 border border-eco-blue-200 rounded-lg p-4">
                  <p className="text-sm text-eco-blue-800 flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Your payment is secure and encrypted. This is a demo environment - no real charges will be made.
                    </span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={() => setStep('select')}
                    disabled={isProcessing}
                  >
                    ← Back
                  </Button>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={handleClose}
                      disabled={isProcessing}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="gradient-eco text-white"
                      onClick={handlePurchase}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Complete Purchase
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <DialogHeader>
                <DialogTitle className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.6 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-eco-green-500 to-eco-teal-500 flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="w-10 h-10 text-white" />
                  </motion.div>
                  <span className="text-2xl">Purchase Successful!</span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-6 text-center">
                <div>
                  <p className="text-lg text-muted-foreground mb-4">
                    {creditsToAdd} credits have been added to your wallet
                  </p>
                  
                  <Card className="border-eco-green-200/50 bg-eco-green-50/50 max-w-sm mx-auto">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <Coins className="w-8 h-8 text-eco-green-600" />
                        <span className="text-4xl font-bold text-eco-green-600">
                          +{creditsToAdd}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        New Balance: {(userProfile?.credits || 0) + creditsToAdd} credits
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">What's next?</p>
                  <div className="grid grid-cols-1 gap-2 max-w-md mx-auto">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="w-4 h-4 text-eco-green-500" />
                      <span>Browse skills and book your first session</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Gift className="w-4 h-4 text-eco-green-500" />
                      <span>Invite friends to earn bonus credits</span>
                    </div>
                  </div>
                </div>

                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <p className="text-sm text-eco-green-600 font-medium">
                    ✨ Closing automatically...
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
