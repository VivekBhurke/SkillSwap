import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Plus } from 'lucide-react';
import { makeRequest } from '../utils/supabase/client';
import { useApp } from '../context/AppContext';

interface AddSkillDialogProps {
  children?: React.ReactNode;
}

export function AddSkillDialog({ children }: AddSkillDialogProps) {
  const { refreshData } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [skillData, setSkillData] = useState({
    name: '',
    category: '',
    level: '',
    description: '',
    creditsPerHour: 1,
    availability: ['Monday 9-5']
  });

  const categories = [
    'Programming',
    'Music',
    'Fitness',
    'Art',
    'Language',
    'Cooking',
    'Business',
    'Design',
    'Photography',
    'Writing'
  ];

  const levels = ['Beginner', 'Intermediate', 'Expert'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await makeRequest('/skills', {
        method: 'POST',
        body: JSON.stringify(skillData)
      });

      await refreshData();
      setIsOpen(false);
      setSkillData({
        name: '',
        category: '',
        level: '',
        description: '',
        creditsPerHour: 1,
        availability: ['Monday 9-5']
      });
    } catch (error: any) {
      console.error('Add skill error:', error);
      setError(error.message || 'Failed to add skill');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a New Skill</DialogTitle>
          <DialogDescription>
            Share your expertise with the SkillSwap community
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skill-name">Skill Name</Label>
            <Input
              id="skill-name"
              value={skillData.name}
              onChange={(e) => setSkillData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., React Development, Guitar Lessons, Yoga"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="skill-category">Category</Label>
              <Select
                value={skillData.category}
                onValueChange={(value) => setSkillData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skill-level">Your Level</Label>
              <Select
                value={skillData.level}
                onValueChange={(value) => setSkillData(prev => ({ ...prev, level: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skill-description">Description</Label>
            <Textarea
              id="skill-description"
              value={skillData.description}
              onChange={(e) => setSkillData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what you'll teach and what students can expect to learn..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skill-availability">Availability</Label>
            <Input
              id="skill-availability"
              value={skillData.availability[0]}
              onChange={(e) => setSkillData(prev => ({ ...prev, availability: [e.target.value] }))}
              placeholder="e.g., Monday-Friday 9am-5pm, Weekends only"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-gray-600">
              Rate: 1 credit per hour (standard rate)
            </p>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Skill
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}