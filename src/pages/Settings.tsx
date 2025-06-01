
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Key, Shield, Save, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ApiKey {
  id: string;
  name: string;
  service: string;
  preview: string;
  created_at: string;
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newApiKey, setNewApiKey] = useState({ name: '', service: '', key: '' });
  const [isLoading, setIsLoading] = useState(false);

  const supportedServices = [
    { value: 'openai', label: 'OpenAI', placeholder: 'sk-...' },
    { value: 'anthropic', label: 'Anthropic Claude', placeholder: 'sk-ant-...' },
    { value: 'google', label: 'Google Gemini', placeholder: 'AIza...' },
    { value: 'stripe', label: 'Stripe', placeholder: 'sk_live_...' },
    { value: 'twilio', label: 'Twilio', placeholder: 'AC...' },
    { value: 'sendgrid', label: 'SendGrid', placeholder: 'SG...' },
  ];

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const handleSaveApiKey = async () => {
    if (!user || !newApiKey.name || !newApiKey.service || !newApiKey.key) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Call edge function to securely store the API key
      const { data, error } = await supabase.functions.invoke('store-api-key', {
        body: {
          name: newApiKey.name,
          service: newApiKey.service,
          api_key: newApiKey.key,
          user_id: user.id
        }
      });

      if (error) throw error;

      toast({
        title: "API Key Saved",
        description: `${newApiKey.name} has been securely stored`,
      });

      // Add to local state for display
      const newKey: ApiKey = {
        id: data.id,
        name: newApiKey.name,
        service: newApiKey.service,
        preview: data.preview,
        created_at: new Date().toISOString()
      };
      
      setApiKeys(prev => [...prev, newKey]);

      // Reset form
      setNewApiKey({ name: '', service: '', key: '' });
      
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: "Error",
        description: "Failed to save API key. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteApiKey = async (keyId: string, keyName: string) => {
    if (!confirm(`Are you sure you want to delete "${keyName}"?`)) return;

    try {
      // Remove from local state
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
      
      toast({
        title: "API Key Deleted",
        description: `${keyName} has been removed`,
      });
      
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast({
        title: "Error",
        description: "Failed to delete API key. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and API keys</p>
        </div>

        <Tabs defaultValue="api-keys" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Add New API Key
                </CardTitle>
                <CardDescription>
                  Securely store your API keys for external services. Keys are encrypted and stored safely.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="key-name">Key Name</Label>
                    <Input
                      id="key-name"
                      placeholder="My OpenAI Key"
                      value={newApiKey.name}
                      onChange={(e) => setNewApiKey(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service">Service</Label>
                    <select
                      id="service"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={newApiKey.service}
                      onChange={(e) => setNewApiKey(prev => ({ ...prev, service: e.target.value }))}
                    >
                      <option value="">Select a service</option>
                      {supportedServices.map(service => (
                        <option key={service.value} value={service.value}>
                          {service.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder={supportedServices.find(s => s.value === newApiKey.service)?.placeholder || "Enter your API key"}
                    value={newApiKey.key}
                    onChange={(e) => setNewApiKey(prev => ({ ...prev, key: e.target.value }))}
                  />
                </div>
                <Button 
                  onClick={handleSaveApiKey} 
                  disabled={isLoading}
                  className="w-full md:w-auto"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save API Key'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stored API Keys</CardTitle>
                <CardDescription>
                  Manage your saved API keys. Keys are encrypted and only the masked version is shown.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {apiKeys.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No API keys stored yet</p>
                    <p className="text-sm">Add your first API key above to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {apiKeys.map((apiKey) => (
                      <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{apiKey.name}</h4>
                            <span className="text-xs bg-secondary px-2 py-1 rounded">
                              {supportedServices.find(s => s.value === apiKey.service)?.label || apiKey.service}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>
                              {showKeys[apiKey.id] ? apiKey.preview : '••••••••••••••••••••'}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleKeyVisibility(apiKey.id)}
                            >
                              {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Created: {new Date(apiKey.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteApiKey(apiKey.id, apiKey.name)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    placeholder="Enter your full name"
                    value={user?.user_metadata?.full_name || ''}
                  />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your account security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Change Password</h4>
                      <p className="text-sm text-muted-foreground">Update your password regularly for better security</p>
                    </div>
                    <Button variant="outline">Change</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Active Sessions</h4>
                      <p className="text-sm text-muted-foreground">Manage your active login sessions</p>
                    </div>
                    <Button variant="outline">View Sessions</Button>
                  </div>
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
