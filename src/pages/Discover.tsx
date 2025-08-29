import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

import { useDiscoverStore } from '@/lib/store';
import { ProfileType } from '@/lib/api';

export default function Discover() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { profiles, currentIndex, isLoading, loadProfiles, swipeProfile, nextProfile } = useDiscoverStore();
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    loadProfiles();
  }, []);

  const currentProfile = profiles[currentIndex];

  const handleSwipe = async (action: 'like' | 'pass') => {
    if (!currentProfile) return;

    setSwipeDirection(action === 'like' ? 'right' : 'left');
    
    try {
      const result = await swipeProfile(action);
      
      if (result.match) {
        toast({
          title: t('its_a_match'),
          description: `You matched with ${currentProfile.name}!`,
        });
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: 'Failed to process swipe',
        variant: 'destructive',
      });
    }

    // Reset swipe direction after animation
    setTimeout(() => setSwipeDirection(null), 300);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('no_more_profiles')}</h2>
          <p className="text-muted-foreground mb-6">Check back later for new matches!</p>
          <Button onClick={loadProfiles}>Refresh</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 p-4">
      <div className="max-w-sm mx-auto pt-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">{t('discover')}</h1>
          <p className="text-muted-foreground">
            {currentIndex + 1} of {profiles.length}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentProfile.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: swipeDirection === 'left' ? -300 : swipeDirection === 'right' ? 300 : 0,
              rotate: swipeDirection === 'left' ? -30 : swipeDirection === 'right' ? 30 : 0,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <Card className="overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-2xl">
              <div className="relative">
                <img
                  src={currentProfile.photos[0]?.url}
                  alt={currentProfile.name}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Profile Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h2 className="text-2xl font-bold">
                    {currentProfile.name}, {currentProfile.age}
                  </h2>
                  <p className="text-sm opacity-90 mb-2">{currentProfile.location.city}</p>
                  {currentProfile.bio && (
                    <p className="text-sm opacity-90 mb-3">{currentProfile.bio}</p>
                  )}
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {currentProfile.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mt-8">
          <Button
            size="lg"
            variant="outline"
            className="rounded-full w-16 h-16 border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
            onClick={() => handleSwipe('pass')}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>

          <Button
            size="lg"
            className="rounded-full w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            onClick={() => handleSwipe('like')}
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center gap-4 mt-4">
          <Button variant="ghost" size="sm">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            More Info
          </Button>
          
          <Button variant="ghost" size="sm">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Super Like
          </Button>
        </div>
      </div>
    </div>
  );
}