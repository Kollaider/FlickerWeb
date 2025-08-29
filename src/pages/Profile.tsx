import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

import { useProfileStore, useAuthStore } from '@/lib/store';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(18).max(100),
  bio: z.string().max(500).optional(),
  location: z.object({
    city: z.string().min(1, 'City is required'),
  }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const INTEREST_OPTIONS = [
  'hiking', 'coffee', 'dogs', 'cats', 'travel', 'music', 'art', 'cooking',
  'fitness', 'reading', 'movies', 'gaming', 'photography', 'dancing', 'yoga'
];

const LOOKING_FOR_OPTIONS = [
  { value: 'friendship', label: 'Friendship' },
  { value: 'dating', label: 'Dating' },
  { value: 'long_term', label: 'Long Term' },
];

export default function Profile() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { profile, isLoading, loadProfile, updateProfile } = useProfileStore();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedLookingFor, setSelectedLookingFor] = useState<('friendship' | 'dating' | 'long_term')[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      age: 18,
      bio: '',
      location: { city: '' },
    },
  });

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        age: profile.age,
        bio: profile.bio || '',
        location: { city: profile.location.city },
      });
      setSelectedTags(profile.tags || []);
      setSelectedLookingFor(profile.looking_for || []);
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile({
        ...data,
        tags: selectedTags,
        looking_for: selectedLookingFor,
        location: {
          ...profile?.location,
          city: data.location.city,
        } as { lat: number; lon: number; city: string },
      });
      
      setIsEditing(false);
      toast({
        title: t('success'),
        description: 'Profile updated successfully!',
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleLookingFor = (option: 'friendship' | 'dating' | 'long_term') => {
    setSelectedLookingFor(prev => 
      prev.includes(option) 
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  if (isLoading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('profile')}</h1>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? 'outline' : 'default'}
          >
            {isEditing ? t('cancel') : t('edit_profile')}
          </Button>
        </div>

        <div className="space-y-6">
          {/* Profile Photos */}
          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {profile?.photos?.map((photo, index) => (
                  <div key={photo.id} className="relative aspect-square">
                    <img
                      src={photo.url}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {photo.is_primary && (
                      <Badge className="absolute top-2 left-2">Primary</Badge>
                    )}
                  </div>
                ))}
                
                {/* Add Photo Button */}
                <div className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto mb-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <p className="text-sm text-muted-foreground">{t('add_photo')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('name')}</Label>
                    <Input
                      id="name"
                      {...form.register('name')}
                      disabled={!isEditing}
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">{t('age')}</Label>
                    <Input
                      id="age"
                      type="number"
                      {...form.register('age', { valueAsNumber: true })}
                      disabled={!isEditing}
                    />
                    {form.formState.errors.age && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.age.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    {...form.register('location.city')}
                    disabled={!isEditing}
                  />
                  {form.formState.errors.location?.city && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.location.city.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">{t('bio')}</Label>
                  <Textarea
                    id="bio"
                    {...form.register('bio')}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
                  />
                  {form.formState.errors.bio && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.bio.message}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? t('loading') : t('save_changes')}
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Interests */}
          <Card>
            <CardHeader>
              <CardTitle>{t('interests')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className={`cursor-pointer ${isEditing ? 'hover:bg-primary/80' : 'cursor-default'}`}
                    onClick={() => isEditing && toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Looking For */}
          <Card>
            <CardHeader>
              <CardTitle>{t('looking_for')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {LOOKING_FOR_OPTIONS.map((option) => (
                  <Badge
                    key={option.value}
                    variant={selectedLookingFor.includes(option.value as 'friendship' | 'dating' | 'long_term') ? 'default' : 'outline'}
                    className={`cursor-pointer ${isEditing ? 'hover:bg-primary/80' : 'cursor-default'}`}
                    onClick={() => isEditing && toggleLookingFor(option.value as 'friendship' | 'dating' | 'long_term')}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}