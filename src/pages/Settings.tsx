import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

import { useSettingsStore, useAuthStore } from '@/lib/store';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const { logout } = useAuthStore();
  const { theme, language, telegramLinked, setTheme, setLanguage, checkTelegramStatus } = useSettingsStore();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    toast({
      title: t('success'),
      description: 'Theme updated successfully',
    });
  };

  const handleLanguageChange = (newLanguage: 'en' | 'ru') => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    toast({
      title: t('success'),
      description: 'Language updated successfully',
    });
  };

  const handleTelegramLink = async () => {
    // Mock Telegram linking for now
    toast({
      title: 'Telegram Integration',
      description: 'Telegram linking will be implemented with backend API',
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: t('success'),
        description: 'Logged out successfully',
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: 'Failed to logout',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <h1 className="text-2xl font-bold mb-6">{t('settings')}</h1>

        <div className="space-y-6">
          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the app looks and feels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme">{t('theme')}</Label>
                <Select value={theme} onValueChange={handleThemeChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{t('light')}</SelectItem>
                    <SelectItem value="dark">{t('dark')}</SelectItem>
                    <SelectItem value="system">{t('system')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="language">{t('language')}</Label>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ru">Русский</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for new matches and messages
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get email updates about your activity
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Telegram Integration */}
          <Card>
            <CardHeader>
              <CardTitle>Telegram Integration</CardTitle>
              <CardDescription>Connect your Telegram account for enhanced features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{telegramLinked ? t('telegram_linked') : t('link_telegram')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {telegramLinked 
                      ? 'Your Telegram account is connected'
                      : 'Link your Telegram account to receive notifications'
                    }
                  </p>
                </div>
                <Button
                  variant={telegramLinked ? 'outline' : 'default'}
                  onClick={handleTelegramLink}
                >
                  {telegramLinked ? 'Unlink' : 'Link'}
                </Button>
              </div>

              {telegramLinked && (
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Telegram Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive match and message notifications in Telegram
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Privacy & Safety */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Safety</CardTitle>
              <CardDescription>Control your privacy and safety settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Distance</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your distance to other users
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Online Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Let others see when you're online
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Read Receipts</Label>
                  <p className="text-sm text-muted-foreground">
                    Show when you've read messages
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Export My Data
              </Button>
              
              <Button variant="outline" className="w-full">
                Delete Account
              </Button>
              
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleLogout}
              >
                {t('logout')}
              </Button>
            </CardContent>
          </Card>

          {/* Admin Panel (Mock) */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Panel</CardTitle>
              <CardDescription>Administrative functions (demo)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" size="sm">
                  User Reports
                </Button>
                <Button variant="outline" size="sm">
                  Statistics
                </Button>
                <Button variant="outline" size="sm">
                  Moderation
                </Button>
                <Button variant="outline" size="sm">
                  Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}