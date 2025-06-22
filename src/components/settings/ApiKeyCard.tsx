
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ApiKeyConfig } from '@/types/apiProviders';
import { AI_PROVIDERS } from '@/types/apiProviders';
import { 
  Eye, 
  EyeOff, 
  Trash2, 
  RefreshCw, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

interface ApiKeyCardProps {
  config: ApiKeyConfig;
  onToggle: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
  onTest: (id: string) => Promise<void>;
}

const ApiKeyCard: React.FC<ApiKeyCardProps> = ({ 
  config, 
  onToggle, 
  onDelete, 
  onTest 
}) => {
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  const provider = AI_PROVIDERS.find(p => p.id === config.providerId);

  const handleTest = async () => {
    setIsTesting(true);
    try {
      await onTest(config.id);
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Failed to test API connection",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${config.name}"? This action cannot be undone.`)) {
      onDelete(config.id);
    }
  };

  const getStatusIcon = () => {
    switch (config.status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (config.status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Untested</Badge>;
    }
  };

  const maskedKey = `${config.apiKey.substring(0, 8)}...${config.apiKey.substring(config.apiKey.length - 4)}`;

  return (
    <Card className="relative">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{provider?.icon || '⚙️'}</span>
            <div>
              <h3 className="font-medium">{config.name}</h3>
              <p className="text-sm text-muted-foreground">{provider?.name || 'Custom Provider'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <Switch
              checked={config.isActive}
              onCheckedChange={(checked) => onToggle(config.id, checked)}
            />
          </div>
        </div>

        {/* API Key Display */}
        <div className="flex items-center gap-2 mb-3 p-2 bg-muted rounded">
          <span className="font-mono text-sm flex-1">
            {showKey ? config.apiKey : maskedKey}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowKey(!showKey)}
          >
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>

        {/* Status and Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            {getStatusIcon()}
            <span className="text-muted-foreground">
              {config.status === 'connected' && 'API connection verified'}
              {config.status === 'error' && `Error: ${config.errorMessage}`}
              {config.status === 'untested' && 'Connection not tested'}
            </span>
          </div>

          {config.usage && (
            <div className="text-xs text-muted-foreground">
              <span>{config.usage.requests} requests</span>
              <span className="mx-2">•</span>
              <span>Last used: {new Date(config.usage.lastUsed).toLocaleDateString()}</span>
            </div>
          )}

          {config.lastTested && (
            <div className="text-xs text-muted-foreground">
              Last tested: {new Date(config.lastTested).toLocaleString()}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTest}
              disabled={isTesting || !config.isActive}
            >
              {isTesting ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Test
            </Button>
            
            {provider?.documentationUrl && (
              <Button variant="ghost" size="sm" asChild>
                <a href={provider.documentationUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyCard;
