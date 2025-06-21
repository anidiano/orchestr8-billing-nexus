
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
      // Check if user has an existing API key
      // For demo purposes, we'll check localStorage as well
      const storedKey = localStorage.getItem(`api_key_${user.id}`);
      if (storedKey) {
        setApiKey(storedKey);
        setCurrentStep('dashboard');
        return;
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
    }
    setCurrentStep('dashboard');
  };

  const handleReset = () => {
    setApiKey('');
    if (user) {
      localStorage.removeItem(`api_key_${user.id}`);
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
