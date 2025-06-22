
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ApiKeySetup from './ApiKeySetup';
import LiveDataDashboard from './LiveDataDashboard';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { ApiKeyConfig } from '@/types/apiProviders';

const DashboardFlow: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<'loading' | 'apiKey' | 'dashboard'>('loading');
  const [activeApiKeys, setActiveApiKeys] = useState<ApiKeyConfig[]>([]);

  useEffect(() => {
    checkExistingApiKeys();
  }, [user]);

  const checkExistingApiKeys = async () => {
    if (!user) {
      setCurrentStep('apiKey');
      return;
    }

    try {
      // Load API configurations from the new system
      const stored = localStorage.getItem(`api_configs_${user.id}`);
      if (stored) {
        const configs: ApiKeyConfig[] = JSON.parse(stored);
        const activeConfigs = configs.filter(config => 
          config.isActive && config.status === 'connected'
        );
        
        if (activeConfigs.length > 0) {
          setActiveApiKeys(activeConfigs);
          setCurrentStep('dashboard');
          return;
        }
      }

      // Fallback: Check for legacy OpenAI keys
      const legacyKeys = [
        localStorage.getItem(`api_key_${user.id}`),
        localStorage.getItem('openai_api_key'),
        localStorage.getItem(`settings_openai_${user.id}`)
      ].filter(Boolean);

      if (legacyKeys.length > 0) {
        // Create a legacy config for backward compatibility
        const legacyConfig: ApiKeyConfig = {
          id: 'legacy-openai',
          providerId: 'openai',
          name: 'Legacy OpenAI',
          apiKey: legacyKeys[0]!,
          baseUrl: 'https://api.openai.com/v1',
          authType: 'bearer',
          isActive: true,
          status: 'connected',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setActiveApiKeys([legacyConfig]);
        setCurrentStep('dashboard');
        return;
      }
    } catch (error) {
      console.error('Error checking existing API keys:', error);
    }
    
    setCurrentStep('apiKey');
  };

  const handleApiKeyValidated = (key: string) => {
    // Create a configuration for the validated key
    const newConfig: ApiKeyConfig = {
      id: 'dashboard-openai',
      providerId: 'openai',
      name: 'Dashboard OpenAI',
      apiKey: key,
      baseUrl: 'https://api.openai.com/v1',
      authType: 'bearer',
      isActive: true,
      status: 'connected',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setActiveApiKeys([newConfig]);
    
    // Store in localStorage for backward compatibility
    if (user) {
      localStorage.setItem(`api_key_${user.id}`, key);
      localStorage.setItem(`settings_openai_${user.id}`, key);
    }
    
    setCurrentStep('dashboard');
  };

  const handleReset = () => {
    setActiveApiKeys([]);
    if (user) {
      localStorage.removeItem(`api_key_${user.id}`);
      localStorage.removeItem(`settings_openai_${user.id}`);
      localStorage.removeItem(`api_configs_${user.id}`);
    }
    setCurrentStep('apiKey');
  };

  if (currentStep === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'apiKey') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <ApiKeySetup 
          onApiKeyValidated={handleApiKeyValidated}
          existingKey={activeApiKeys[0]?.apiKey || ''}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <LiveDataDashboard 
        apiConfigs={activeApiKeys}
        onReset={handleReset}
      />
    </div>
  );
};

export default DashboardFlow;
