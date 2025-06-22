import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { AI_PROVIDERS, ApiProvider, ApiKeyConfig } from '@/types/apiProviders';
import { CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

interface ApiProviderSelectorProps {
  onSave: (config: Omit<ApiKeyConfig, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
}

interface ConfigState {
  name: string;
  apiKey: string;
  baseUrl: string;
  customHeaders: Record<string, string>;
  authType: 'bearer' | 'api-key' | 'custom';
  isActive: boolean;
}

const ApiProviderSelector: React.FC<ApiProviderSelectorProps> = ({ onSave, onCancel }) => {
  const [selectedProvider, setSelectedProvider] = useState<ApiProvider | null>(null);
  const [config, setConfig] = useState<ConfigState>({
    name: '',
    apiKey: '',
    baseUrl: '',
    customHeaders: {},
    authType: 'bearer',
    isActive: true
  });
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    status: 'success' | 'error' | null;
    message: string;
  }>({ status: null, message: '' });
  const { toast } = useToast();

  const handleProviderSelect = (providerId: string) => {
    const provider = AI_PROVIDERS.find(p => p.id === providerId);
    if (provider) {
      setSelectedProvider(provider);
      setConfig(prev => ({
        ...prev,
        name: `${provider.name} API`,
        baseUrl: provider.baseUrl,
        authType: provider.authType,
        customHeaders: provider.customHeaders || {}
      }));
      setValidationResult({ status: null, message: '' });
    }
  };

  const validateApiKey = async () => {
    if (!selectedProvider || !config.apiKey.trim()) {
      toast({
        title: "Validation Error",
        description: "Please select a provider and enter an API key",
        variant: "destructive"
      });
      return;
    }

    setIsValidating(true);
    setValidationResult({ status: null, message: '' });

    try {
      // Format validation first
      if (selectedProvider.keyFormat && !selectedProvider.keyFormat.pattern.test(config.apiKey)) {
        setValidationResult({
          status: 'error',
          message: `Invalid key format. Expected: ${selectedProvider.keyFormat.example}`
        });
        return;
      }

      // For custom provider, skip API validation if no test endpoint
      if (selectedProvider.id === 'custom' && !config.baseUrl.trim()) {
        setValidationResult({
          status: 'success',
          message: 'Custom provider configured (no validation endpoint specified)'
        });
        return;
      }

      // Live API validation
      const testUrl = selectedProvider.id === 'custom' 
        ? config.baseUrl 
        : `${selectedProvider.baseUrl}${selectedProvider.testEndpoint}`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...config.customHeaders
      };

      // Set authorization header based on auth type
      if (config.authType === 'bearer') {
        headers['Authorization'] = `Bearer ${config.apiKey}`;
      } else if (config.authType === 'api-key') {
        headers['x-api-key'] = config.apiKey;
      }

      const response = await fetch(testUrl, {
        method: 'GET',
        headers
      });

      if (response.ok || response.status === 200) {
        setValidationResult({
          status: 'success',
          message: 'API key validated successfully!'
        });
      } else {
        const errorText = await response.text();
        setValidationResult({
          status: 'error',
          message: `Validation failed: ${response.status} ${response.statusText}`
        });
      }
    } catch (error) {
      console.error('API validation error:', error);
      setValidationResult({
        status: 'error',
        message: 'Network error during validation. Please check your connection.'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = async () => {
    if (!selectedProvider || !config.name.trim() || !config.apiKey.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const finalConfig: Omit<ApiKeyConfig, 'id' | 'createdAt' | 'updatedAt'> = {
      providerId: selectedProvider.id,
      name: config.name,
      apiKey: config.apiKey,
      baseUrl: config.baseUrl || selectedProvider.baseUrl,
      customHeaders: config.customHeaders,
      authType: config.authType,
      isActive: config.isActive,
      status: validationResult.status === 'success' ? 'connected' : 'untested',
      errorMessage: validationResult.status === 'error' ? validationResult.message : undefined
    };

    await onSave(finalConfig);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Add New API Provider</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Provider Selection */}
        <div className="space-y-2">
          <Label>AI Provider</Label>
          <Select onValueChange={handleProviderSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select an AI provider" />
            </SelectTrigger>
            <SelectContent>
              {AI_PROVIDERS.map((provider) => (
                <SelectItem key={provider.id} value={provider.id}>
                  <div className="flex items-center gap-2">
                    <span>{provider.icon}</span>
                    <span>{provider.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedProvider && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium">{selectedProvider.name}</p>
                <p className="text-xs text-muted-foreground">{selectedProvider.description}</p>
              </div>
              {selectedProvider.documentationUrl && (
                <Button variant="ghost" size="sm" asChild>
                  <a href={selectedProvider.documentationUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>

        {selectedProvider && (
          <>
            {/* Configuration Name */}
            <div className="space-y-2">
              <Label htmlFor="config-name">Configuration Name</Label>
              <Input
                id="config-name"
                placeholder="e.g., Production OpenAI"
                value={config.name}
                onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            {/* API Key */}
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder={selectedProvider.keyFormat?.placeholder || "Enter your API key"}
                value={config.apiKey}
                onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
              />
              {selectedProvider.keyFormat && (
                <p className="text-xs text-muted-foreground">
                  Format: {selectedProvider.keyFormat.example}
                </p>
              )}
            </div>

            {/* Custom Base URL (for custom provider) */}
            {selectedProvider.id === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="base-url">Base URL</Label>
                <Input
                  id="base-url"
                  placeholder="https://api.example.com/v1"
                  value={config.baseUrl}
                  onChange={(e) => setConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                />
              </div>
            )}

            {/* Authentication Type */}
            <div className="space-y-2">
              <Label>Authentication Type</Label>
              <Select value={config.authType} onValueChange={(value: 'bearer' | 'api-key') => 
                setConfig(prev => ({ ...prev, authType: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bearer">Bearer Token</SelectItem>
                  <SelectItem value="api-key">API Key Header</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Validation */}
            <div className="space-y-3">
              <Button 
                onClick={validateApiKey}
                disabled={isValidating || !config.apiKey.trim()}
                variant="outline"
                className="w-full"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  'Test Connection'
                )}
              </Button>

              {validationResult.status && (
                <Alert variant={validationResult.status === 'success' ? 'default' : 'destructive'}>
                  {validationResult.status === 'success' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>{validationResult.message}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="flex-1">
                Save Configuration
              </Button>
              <Button onClick={onCancel} variant="outline">
                Cancel
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiProviderSelector;
