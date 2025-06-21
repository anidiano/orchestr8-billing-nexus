
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, User, Key, Bell, Globe, Database, Trash2, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ApiKeysManager from '@/components/settings/ApiKeysManager';
import SecuritySettings from '@/components/settings/SecuritySettings';
import NotificationPreferences from '@/components/settings/NotificationPreferences';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Profile state
  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [language, setLanguage] = useState('en');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
  // Data & Privacy
  const [dataRetention, setDataRetention] = useState('90');
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setAvatar(user.user_metadata?.avatar_url || '');
      // Load user preferences from database if available
      loadUserPreferences();
    }
  }, [user]);

  const loadUserPreferences = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (data && !error) {
        // Set preferences from database if available
        setTimezone(data.timezone || 'UTC');
        setLanguage(data.language || 'en');
      }
    } catch (error) {
      console.log('No user preferences found, using defaults');
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsUpdatingProfile(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          avatar_url: avatar
        }
      });

      if (error) throw error;

      // Also update profiles table if it exists
      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          timezone,
          language,
          updated_at: new Date().toISOString()
        });

      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user?.email) return;
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth`
      });

      if (error) throw error;

      toast({
        title: "Password reset sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleExportData = async () => {
    if (!user) return;
    
    try {
      // Fetch user's data for export
      const { data: orchestrations } = await supabase
        .from('orchestrations')
        .select('*')
        .eq('user_id', user.id);
        
      const { data: invocations } = await supabase
        .from('invocations')
        .select('*')
        .eq('user_id', user.id);
        
      const { data: usage } = await supabase
        .from('usage_logs')
        .select('*')
        .eq('user_id', user.id);

      const exportData = {
        profile: {
          email: user.email,
          created_at: user.created_at,
          full_name: fullName
        },
        orchestrations: orchestrations || [],
        invocations: invocations || [],
        usage_logs: usage || [],
        exported_at: new Date().toISOString()
      };

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orchestr8-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported",
        description: "Your data has been downloaded as a JSON file.",
      });
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently delete all your data.")) {
      return;
    }
    
    if (!confirm("This will permanently delete your account and all associated data. Type 'DELETE' to confirm this is really what you want to do.")) {
      return;
    }

    try {
      // Call edge function to handle account deletion
      const { error } = await supabase.functions.invoke('delete-account', {
        body: { user_id: user?.id }
      });

      if (error) throw error;

      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });

      // Sign out user
      await supabase.auth.signOut();
    } catch (error: any) {
      toast({
        title: "Deletion failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings, preferences, and security options</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data & Privacy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed directly. Contact support if needed.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input
                      id="full-name"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input
                    id="avatar"
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                  />
                  {avatar && (
                    <div className="mt-2">
                      <img src={avatar} alt="Avatar preview" className="w-16 h-16 rounded-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="EST">Eastern Time</SelectItem>
                        <SelectItem value="PST">Pacific Time</SelectItem>
                        <SelectItem value="GMT">GMT</SelectItem>
                        <SelectItem value="CET">Central European Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="it">Italian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleUpdateProfile} disabled={isUpdatingProfile}>
                    {isUpdatingProfile ? 'Updating...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setFullName(user?.user_metadata?.full_name || '');
                    setAvatar(user?.user_metadata?.avatar_url || '');
                    setTimezone('UTC');
                    setLanguage('en');
                  }}>
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api-keys" className="space-y-6">
            <ApiKeysManager />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationPreferences />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  General Preferences
                </CardTitle>
                <CardDescription>Customize your application experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Dashboard Theme</Label>
                    <Select defaultValue="system">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select defaultValue="MM/DD/YYYY">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Show Advanced Features</Label>
                      <p className="text-sm text-muted-foreground">Display developer and advanced user options</p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Auto-save Changes</Label>
                      <p className="text-sm text-muted-foreground">Automatically save form changes</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                </div>
                
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data & Privacy
                </CardTitle>
                <CardDescription>Manage your data, privacy settings, and account deletion</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Data Retention Period</Label>
                    <Select value={dataRetention} onValueChange={setDataRetention}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">6 months</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="forever">Forever</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">How long to keep your usage logs and analytics data</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Analytics & Tracking</Label>
                      <p className="text-sm text-muted-foreground">Help improve our service with anonymous usage data</p>
                    </div>
                    <Switch checked={analyticsEnabled} onCheckedChange={setAnalyticsEnabled} />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Data Management</h4>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleExportData} className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export My Data
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Import Data
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium text-destructive">Danger Zone</h4>
                  <Alert>
                    <AlertDescription>
                      Once you delete your account, there is no going back. Please be certain.
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
