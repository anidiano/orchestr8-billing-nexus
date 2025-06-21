
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ApiKeySetup from './ApiKeySetup';
import LiveDataDashboard from './LiveDataDashboard';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';

const DashboardFlow: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<'loading' | 'apiKey' | 'dashboard'>('loading');
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    checkExistingApiKey();
  }, [user]);

  const checkExistingApiKey = async () => {
    if (!user) {
      setCurrentStep('apiKey');
      return;
    }

    try {
      // First check localStorage for demo purposes
      const storedKey = localStorage.getItem(`api_key_${user.id}`);
      if (storedKey) {
        setApiKey(storedKey);
        setCurrentStep('dashboard');
        return;
      }

      // Check if user has saved an OpenAI API key in Settings
      // Since we're using localStorage in ApiKeysManager for demo purposes,
      // let's check for a more standard key name too
      const settingsApiKey = localStorage.getItem('openai_api_key') || 
                            localStorage.getItem(`settings_openai_${user.id}`);
      
      if (settingsApiKey) {
        setApiKey(settingsApiKey);
        setCurrentStep('dashboard');
        return;
      }

      // Try to get from the sample keys we might have in ApiKeysManager
      // Check for any OpenAI keys stored
      const allKeys = Object.keys(localStorage);
      const openaiKey = allKeys.find(key => 
        key.includes('openai') && key.includes(user.id)
      );
      
      if (openaiKey) {
        const keyValue = localStorage.getItem(openaiKey);
        if (keyValue) {
          setApiKey(keyValue);
          setCurrentStep('dashboard');
          return;
        }
      }
    } catch (error) {
      console.error('Error checking existing API key:', error);
    }
    
    setCurrentStep('apiKey');
  };

  const handleApiKeyValidated = (key: string) => {
    setApiKey(key);
    // Store in localStorage for demo purposes
    if (user) {
      localStorage.setItem(`api_key_${user.id}`, key);
      // Also store with a settings-compatible key name
      localStorage.setItem(`settings_openai_${user.id}`, key);
    }
    setCurrentStep('dashboard');
  };

  const handleReset = () => {
    setApiKey('');
    if (user) {
      localStorage.removeItem(`api_key_${user.id}`);
      localStorage.removeItem(`settings_openai_${user.id}`);
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
          existingKey={apiKey}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <LiveDataDashboard 
        apiKey={apiKey}
        onReset={handleReset}
      />
    </div>
  );
};

export default DashboardFlow;
