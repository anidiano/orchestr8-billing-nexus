
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Key, Smartphone, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SecuritySession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

const SecuritySettings: React.FC = () => {
  const { toast } = useToast();
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  
  const mockSessions: SecuritySession[] = [
    {
      id: '1',
      device: 'Chrome on Windows',
      location: 'New York, NY',
      lastActive: '2 minutes ago',
      isCurrent: true
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      location: 'New York, NY',
      lastActive: '3 hours ago',
      isCurrent: false
    }
  ];

  const generateBackupCodes = () => {
    const codes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );
    setBackupCodes(codes);
    setShowBackupCodes(true);
    
    toast({
      title: "Backup codes generated",
      description: "Save these codes in a secure location. Each can only be used once.",
    });
  };

  const revokeSession = (sessionId: string) => {
    toast({
      title: "Session revoked",
      description: "The selected session has been terminated.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Secure your account with two-factor authentication using an authenticator app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Authenticator App</h4>
              <p className="text-sm text-muted-foreground">Use Google Authenticator, Authy, or similar apps</p>
              <Badge variant="outline" className="mt-1">Not configured</Badge>
            </div>
            <Button>Setup</Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Backup Codes</h4>
              <p className="text-sm text-muted-foreground">Generate backup codes for account recovery</p>
            </div>
            <Button variant="outline" onClick={generateBackupCodes}>
              Generate Codes
            </Button>
          </div>
          
          {showBackupCodes && (
            <Alert>
              <Key className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Your backup codes:</p>
                  <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                    {backupCodes.map((code, index) => (
                      <div key={index} className="p-2 bg-muted rounded">
                        {code}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs">Save these codes securely. Each can only be used once.</p>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Active Sessions
          </CardTitle>
          <CardDescription>
            Manage your active login sessions across different devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{session.device}</h4>
                    {session.isCurrent && <Badge>Current session</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{session.location}</p>
                  <p className="text-xs text-muted-foreground">Last active: {session.lastActive}</p>
                </div>
                {!session.isCurrent && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => revokeSession(session.id)}
                  >
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Security Recommendations
          </CardTitle>
          <CardDescription>
            Suggestions to improve your account security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border rounded-lg border-yellow-200 bg-yellow-50">
              <div>
                <h4 className="font-medium">Enable Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Button size="sm">Enable</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg border-green-200 bg-green-50">
              <div>
                <h4 className="font-medium">Strong Password</h4>
                <p className="text-sm text-muted-foreground">Your password meets security requirements</p>
              </div>
              <Badge variant="default">✓ Good</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
