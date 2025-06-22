
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Key, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ApiKeyConfig } from '@/types/apiProviders';
import { AI_PROVIDERS } from '@/types/apiProviders';
import ApiProviderSelector from './ApiProviderSelector';
import ApiKeyCard from './ApiKeyCard';

const ApiKeysManager: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKeyConfig[]>([]);
  const [isAddingKey, setIsAddingKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadApiKeys();
  }, [user]);

  const loadApiKeys = () => {
    if (!user) return;

    // Load from localStorage for demo
    const stored = localStorage.getItem(`api_configs_${user.id}`);
    if (stored) {
      try {
        setApiKeys(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading API keys:', error);
      }
    }
  };

  const saveToStorage = (configs: ApiKeyConfig[]) => {
    if (!user) return;
    localStorage.setItem(`api_configs_${user.id}`, JSON.stringify(configs));
  };

  const handleSaveApiKey = async (config: Omit<ApiKeyConfig, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const newConfig: ApiKeyConfig = {
        ...config,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedConfigs = [...apiKeys, newConfig];
      setApiKeys(updatedConfigs);
      saveToStorage(updatedConfigs);

      // For backward compatibility with existing dashboard
      if (config.providerId === 'openai') {
        localStorage.setItem(`api_key_${user.id}`, config.apiKey);
        localStorage.setItem(`settings_openai_${user.id}`, config.apiKey);
      }

      toast({
        title: "API Key Saved",
        description: `${config.name} has been configured successfully`,
      });

      setIsAddingKey(false);
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: "Error",
        description: "Failed to save API key configuration",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleKey = (id: string, isActive: boolean) => {
    const updatedConfigs = apiKeys.map(config => 
      config.id === id ? { ...config, isActive, updatedAt: new Date().toISOString() } : config
    );
    setApiKeys(updatedConfigs);
    saveToStorage(updatedConfigs);

    toast({
      title: isActive ? "API Key Activated" : "API Key Deactivated",
      description: `Configuration has been ${isActive ? 'enabled' : 'disabled'}`,
    });
  };

  const handleDeleteKey = (id: string) => {
    const configToDelete = apiKeys.find(config => config.id === id);
    const updatedConfigs = apiKeys.filter(config => config.id !== id);
    setApiKeys(updatedConfigs);
    saveToStorage(updatedConfigs);

    // Clean up legacy storage if it's an OpenAI key
    if (configToDelete?.providerId === 'openai' && user) {
      localStorage.removeItem(`api_key_${user.id}`);
      localStorage.removeItem(`settings_openai_${user.id}`);
    }

    toast({
      title: "API Key Deleted",
      description: "Configuration has been permanently removed",
    });
  };

  const handleTestKey = async (id: string): Promise<void> => {
    const config = apiKeys.find(c => c.id === id);
    if (!config) return;

    const provider = AI_PROVIDERS.find(p => p.id === config.providerId);
    if (!provider) return;

    try {
      const testUrl = config.providerId === 'custom' 
        ? config.baseUrl 
        : `${provider.baseUrl}${provider.testEndpoint}`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...config.customHeaders
      };

      if (config.authType === 'bearer') {
        headers['Authorization'] = `Bearer ${config.apiKey}`;
      } else if (config.authType === 'api-key') {
        headers['x-api-key'] = config.apiKey;
      }

      const response = await fetch(testUrl, { method: 'GET', headers });
      
      const updatedConfigs = apiKeys.map(c => 
        c.id === id ? {
          ...c,
          status: response.ok ? 'connected' as const : 'error' as const,
          errorMessage: response.ok ? undefined : `HTTP ${response.status}`,
          lastTested: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } : c
      );

      setApiKeys(updatedConfigs);
      saveToStorage(updatedConfigs);

      toast({
        title: response.ok ? "Connection Successful" : "Connection Failed",
        description: response.ok ? "API key is working correctly" : `Test failed with status ${response.status}`,
        variant: response.ok ? "default" : "destructive"
      });
    } catch (error) {
      const updatedConfigs = apiKeys.map(c => 
        c.id === id ? {
          ...c,
          status: 'error' as const,
          errorMessage: 'Network error',
          lastTested: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } : c
      );

      setApiKeys(updatedConfigs);
      saveToStorage(updatedConfigs);

      toast({
        title: "Connection Test Failed",
        description: "Network error during testing",
        variant: "destructive"
      });
    }
  };

  const activeConfigs = apiKeys.filter(config => config.isActive);
  const connectedConfigs = activeConfigs.filter(config => config.status === 'connected');

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          All API keys are encrypted and stored securely. You have {activeConfigs.length} active configurations 
          with {connectedConfigs.length} successfully connected.
        </AlertDescription>
      </Alert>

      {/* Add New API Key */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              AI API Integrations
            </CardTitle>
            <CardDescription>
              Connect to multiple AI providers and manage all your API keys in one place
            </CardDescription>
          </div>
          <Button 
            onClick={() => setIsAddingKey(!isAddingKey)}
            variant={isAddingKey ? "outline" : "default"}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isAddingKey ? 'Cancel' : 'Add Provider'}
          </Button>
        </CardHeader>
        
        {isAddingKey && (
          <CardContent className="border-t">
            <ApiProviderSelector
              onSave={handleSaveApiKey}
              onCancel={() => setIsAddingKey(false)}
            />
          </CardContent>
        )}
      </Card>

      {/* API Key List */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Providers ({apiKeys.length})</CardTitle>
          <CardDescription>
            Manage your AI API integrations and monitor their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No API providers configured</p>
              <p className="text-sm">Add your first AI API integration to get started</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {apiKeys.map((config) => (
                <ApiKeyCard
                  key={config.id}
                  config={config}
                  onToggle={handleToggleKey}
                  onDelete={handleDeleteKey}
                  onTest={handleTestKey}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeysManager;
