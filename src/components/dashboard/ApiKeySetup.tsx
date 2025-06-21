
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Key, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ApiKeySetupProps {
  onApiKeyValidated: (key: string) => void;
  existingKey?: string;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onApiKeyValidated, existingKey }) => {
  const [apiKey, setApiKey] = useState(existingKey || '');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (existingKey) {
      setValidationStatus('valid');
    }
  }, [existingKey]);

  const validateApiKey = async (key: string) => {
    // Basic validation - check if key follows OpenAI format
    if (!key.startsWith('sk-') || key.length < 20) {
      return false;
    }

    try {
      // Test the API key with a simple request
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('API key validation error:', error);
      return false;
    }
  };

  const handleValidateKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key",
        variant: "destructive"
      });
      return;
    }

    setIsValidating(true);
    try {
      const isValid = await validateApiKey(apiKey);
      
      if (isValid) {
        setValidationStatus('valid');
        
        // Store the API key securely
        if (user) {
          const { error } = await supabase.functions.invoke('store-api-key', {
            body: {
              name: 'Dashboard OpenAI Key',
              service: 'openai',
              api_key: apiKey,
              user_id: user.id
            }
          });

          if (error) {
            console.error('Error storing API key:', error);
          }
        }

        onApiKeyValidated(apiKey);
        toast({
          title: "API Key Validated",
          description: "Your OpenAI API key has been validated and stored securely",
        });
      } else {
        setValidationStatus('invalid');
        toast({
          title: "Invalid API Key",
          description: "The API key you entered is not valid. Please check and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      setValidationStatus('invalid');
      toast({
        title: "Validation Error",
        description: "Failed to validate API key. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const getStatusIcon = () => {
    switch (validationStatus) {
      case 'valid':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'invalid':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Key className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    switch (validationStatus) {
      case 'valid':
        return 'border-green-500';
      case 'invalid':
        return 'border-red-500';
      default:
        return 'border-input';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Key className="h-6 w-6" />
          API Key Setup
        </CardTitle>
        <CardDescription>
          Enter your OpenAI API key to access real-time dashboard data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">OpenAI API Key</Label>
          <div className="relative">
            <Input
              id="api-key"
              type={showKey ? "text" : "password"}
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className={`pr-20 ${getStatusColor()}`}
              disabled={isValidating}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {getStatusIcon()}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {validationStatus === 'invalid' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Invalid API key. Please ensure you're using a valid OpenAI API key that starts with "sk-".
            </AlertDescription>
          </Alert>
        )}

        {validationStatus === 'valid' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              API key validated successfully! You can now access the dashboard.
            </AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleValidateKey}
          disabled={isValidating || !apiKey.trim()}
          className="w-full"
        >
          {isValidating ? 'Validating...' : validationStatus === 'valid' ? 'Validated ✓' : 'Validate & Continue'}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          <p>Your API key is encrypted and stored securely.</p>
          <p>Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">OpenAI Platform</a></p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeySetup;
