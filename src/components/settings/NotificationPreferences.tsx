
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Mail, Smartphone, AlertCircle, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

const NotificationPreferences: React.FC = () => {
  const { toast } = useToast();
  const [globalEmail, setGlobalEmail] = useState(true);
  const [globalPush, setGlobalPush] = useState(true);
  const [globalSms, setGlobalSms] = useState(false);
  const [frequency, setFrequency] = useState('instant');
  
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: 'orchestration-complete',
      title: 'Orchestration Complete',
      description: 'When an AI orchestration finishes running',
      email: true,
      push: true,
      sms: false
    },
    {
      id: 'orchestration-failed',
      title: 'Orchestration Failed',
      description: 'When an orchestration encounters an error',
      email: true,
      push: true,
      sms: true
    },
    {
      id: 'usage-limit',
      title: 'Usage Limit Warnings',
      description: 'When approaching API usage limits',
      email: true,
      push: false,
      sms: false
    },
    {
      id: 'billing-alerts',
      title: 'Billing Alerts',
      description: 'Payment failures and billing notifications',
      email: true,
      push: false,
      sms: true
    },
    {
      id: 'security-alerts',
      title: 'Security Alerts',
      description: 'Suspicious login attempts and security events',
      email: true,
      push: true,
      sms: true
    },
    {
      id: 'product-updates',
      title: 'Product Updates',
      description: 'New features and platform improvements',
      email: false,
      push: false,
      sms: false
    }
  ]);

  const updateNotification = (id: string, type: 'email' | 'push' | 'sms', value: boolean) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, [type]: value } : notif
    ));
  };

  const savePreferences = () => {
    toast({
      title: "Preferences saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Global Notification Settings
          </CardTitle>
          <CardDescription>
            Control how you receive notifications across all events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <Label className="text-base">Email</Label>
                </div>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch checked={globalEmail} onCheckedChange={setGlobalEmail} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <Label className="text-base">Push</Label>
                </div>
                <p className="text-sm text-muted-foreground">Browser push notifications</p>
              </div>
              <Switch checked={globalPush} onCheckedChange={setGlobalPush} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <Label className="text-base">SMS</Label>
                </div>
                <p className="text-sm text-muted-foreground">Text message alerts</p>
              </div>
              <Switch checked={globalSms} onCheckedChange={setGlobalSms} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Notification Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instant">Instant</SelectItem>
                <SelectItem value="hourly">Hourly digest</SelectItem>
                <SelectItem value="daily">Daily digest</SelectItem>
                <SelectItem value="weekly">Weekly digest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <CardDescription>
            Customize which notifications you receive and how
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div key={notification.id}>
                <div className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                  <div className="flex gap-4 ml-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={notification.email && globalEmail}
                        onCheckedChange={(checked) => updateNotification(notification.id, 'email', checked)}
                        disabled={!globalEmail}
                      />
                      <Label className="text-sm">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={notification.push && globalPush}
                        onCheckedChange={(checked) => updateNotification(notification.id, 'push', checked)}
                        disabled={!globalPush}
                      />
                      <Label className="text-sm">Push</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={notification.sms && globalSms}
                        onCheckedChange={(checked) => updateNotification(notification.id, 'sms', checked)}
                        disabled={!globalSms}
                      />
                      <Label className="text-sm">SMS</Label>
                    </div>
                  </div>
                </div>
                {index < notifications.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
          
          <div className="flex justify-end mt-6">
            <Button onClick={savePreferences}>Save Preferences</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationPreferences;
