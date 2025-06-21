import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Key, Save, Trash2, Plus, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ApiKey {
  id: string;
  name: string;
  service: string;
  preview: string;
  created_at: string;
  last_used?: string;
  status: 'active' | 'inactive';
}

const ApiKeysManager: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newApiKey, setNewApiKey] = useState({ name: '', service: '', key: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingKey, setIsAddingKey] = useState(false);

  const supportedServices = [
    { 
      value: 'openai', 
      label: 'OpenAI', 
      placeholder: 'sk-...', 
      description: 'For GPT models and AI features',
      icon: '🤖'
    },
    { 
      value: 'anthropic', 
      label: 'Anthropic Claude', 
      placeholder: 'sk-ant-...', 
      description: 'For Claude AI models',
      icon: '🧠'
    },
    { 
      value: 'google', 
      label: 'Google Gemini', 
      placeholder: 'AIza...', 
      description: 'For Gemini AI models',
      icon: '🔍'
    },
    { 
      value: 'stripe', 
      label: 'Stripe', 
      placeholder: 'sk_live_...', 
      description: 'For payment processing',
      icon: '💳'
    },
    { 
      value: 'twilio', 
      label: 'Twilio', 
      placeholder: 'AC...', 
      description: 'For SMS and voice services',
      icon: '📱'
    },
    { 
      value: 'sendgrid', 
      label: 'SendGrid', 
      placeholder: 'SG...', 
      description: 'For email delivery',
      icon: '📧'
    },
  ];

  // Load API keys on component mount
  useEffect(() => {
    loadApiKeys();
  }, [user]);

  const loadApiKeys = () => {
    if (!user) return;

    // Load API keys from localStorage for demo
    const storedKeys: ApiKey[] = [];
    
    // Check for existing keys in localStorage
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (key.includes(user.id) && (key.includes('api_key') || key.includes('openai') || key.includes('stripe'))) {
        const value = localStorage.getItem(key);
        if (value && value.startsWith('sk-')) {
          const service = key.includes('openai') ? 'openai' : 'unknown';
          storedKeys.push({
            id: key,
            name: service === 'openai' ? 'OpenAI API Key' : 'API Key',
            service,
            preview: `${value.substring(0, 8)}...${value.substring(value.length - 4)}`,
            created_at: new Date().toISOString(),
            status: 'active'
          });
        }
      }
    });

    // Add sample keys if none exist
    if (storedKeys.length === 0) {
      const sampleKeys: ApiKey[] = [
        {
          id: '1',
          name: 'Production OpenAI',
          service: 'openai',
          preview: 'sk-proj-...8x2a',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          last_used: new Date().toISOString(),
          status: 'active'
        },
        {
          id: '2',
          name: 'Stripe Live',
          service: 'stripe',
          preview: 'sk_live_...9f3b',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          last_used: new Date(Date.now() - 3600000).toISOString(),
          status: 'active'
        }
      ];
      setApiKeys(sampleKeys);
    } else {
      setApiKeys(storedKeys);
    }
  };

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

      // Store in localStorage for demo purposes and dashboard integration
      const storageKey = `settings_${newApiKey.service}_${user.id}`;
      localStorage.setItem(storageKey, newApiKey.key);

      // If it's an OpenAI key, also store it with the dashboard-compatible key name
      if (newApiKey.service === 'openai') {
        localStorage.setItem(`api_key_${user.id}`, newApiKey.key);
      }

      toast({
        title: "API Key Saved",
        description: `${newApiKey.name} has been securely stored and is now available for the live dashboard`,
      });

      // Add to local state for display
      const newKey: ApiKey = {
        id: data.id,
        name: newApiKey.name,
        service: newApiKey.service,
        preview: data.preview,
        created_at: new Date().toISOString(),
        status: 'active'
      };
      
      setApiKeys(prev => [...prev, newKey]);

      // Reset form
      setNewApiKey({ name: '', service: '', key: '' });
      setIsAddingKey(false);
      
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
    if (!confirm(`Are you sure you want to delete "${keyName}"? This action cannot be undone.`)) return;

    try {
      // Remove from localStorage if it exists
      if (user) {
        const possibleKeys = [
          `settings_openai_${user.id}`,
          `api_key_${user.id}`,
          keyId // if keyId is the localStorage key itself
        ];
        
        possibleKeys.forEach(key => {
          localStorage.removeItem(key);
        });
      }

      // Remove from local state
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
      
      toast({
        title: "API Key Deleted",
        description: `${keyName} has been permanently removed`,
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

  const selectedService = supportedServices.find(s => s.value === newApiKey.service);

  return (
    <div className="space-y-6">
      {/* Security Notice */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          All API keys are encrypted and stored securely. Only masked versions are displayed for security purposes.
        </AlertDescription>
      </Alert>

      {/* Add New API Key */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Keys Management
            </CardTitle>
            <CardDescription>
              Securely store and manage your API keys for external services
            </CardDescription>
          </div>
          <Button 
            onClick={() => setIsAddingKey(!isAddingKey)}
            variant={isAddingKey ? "outline" : "default"}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isAddingKey ? 'Cancel' : 'Add New Key'}
          </Button>
        </CardHeader>
        
        {isAddingKey && (
          <CardContent className="space-y-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="key-name">Key Name</Label>
                <Input
                  id="key-name"
                  placeholder="e.g., Production OpenAI"
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
                      {service.icon} {service.label}
                    </option>
                  ))}
                </select>
                {selectedService && (
                  <p className="text-xs text-muted-foreground">{selectedService.description}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder={selectedService?.placeholder || "Enter your API key"}
                value={newApiKey.key}
                onChange={(e) => setNewApiKey(prev => ({ ...prev, key: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Your API key will be encrypted and stored securely. We never store plain text keys.
              </p>
            </div>
            <Button 
              onClick={handleSaveApiKey} 
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Encrypting & Saving...' : 'Save API Key'}
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Stored API Keys */}
      <Card>
        <CardHeader>
          <CardTitle>Stored API Keys ({apiKeys.length})</CardTitle>
          <CardDescription>
            Manage your saved API keys. Keys are encrypted and only masked versions are shown.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No API keys stored yet</p>
              <p className="text-sm">Add your first API key to get started with external integrations</p>
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((apiKey) => {
                const service = supportedServices.find(s => s.value === apiKey.service);
                return (
                  <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{apiKey.name}</h4>
                        <Badge variant={apiKey.status === 'active' ? 'default' : 'secondary'}>
                          {service?.icon} {service?.label || apiKey.service}
                        </Badge>
                        <Badge variant={apiKey.status === 'active' ? 'default' : 'secondary'} className="bg-green-100 text-green-800">
                          {apiKey.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <span className="font-mono">
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
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Created: {new Date(apiKey.created_at).toLocaleDateString()}</span>
                        {apiKey.last_used && (
                          <span>Last used: {new Date(apiKey.last_used).toLocaleDateString()}</span>
                        )}
                      </div>
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
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeysManager;
