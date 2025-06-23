
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrchestr8Realtime } from '@/hooks/useOrchestr8Realtime';
import Navbar from '@/components/Navbar';
import RealTimeMetricsCard from '@/components/orchestr8/RealTimeMetricsCard';
import LiveApiCallsTable from '@/components/orchestr8/LiveApiCallsTable';
import RealtimeCharts from '@/components/orchestr8/RealtimeCharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, Server, AlertTriangle } from 'lucide-react';

const Orchestr8Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { realtimeMetrics, apiCallLogs, apiProviders, isConnected } = useOrchestr8Realtime();

  if (!user) {
    return <div>Please sign in to access Orchestr8</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Orchestr8 Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Real-time AI API usage and billing monitoring
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant={isConnected ? "default" : "secondary"} className={isConnected ? "bg-green-500" : ""}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-white animate-pulse' : 'bg-gray-300'} mr-2`} />
              {isConnected ? 'Live Monitoring' : 'Offline'}
            </Badge>
            
            <Card className="px-4 py-2">
              <div className="flex items-center gap-2 text-sm">
                <Server className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{apiProviders.length}</span>
                <span className="text-muted-foreground">Providers</span>
              </div>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="calls" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Live Calls
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alerts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <RealTimeMetricsCard metrics={realtimeMetrics} isLive={isConnected} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RealtimeCharts apiCalls={apiCallLogs} />
              <LiveApiCallsTable calls={apiCallLogs.slice(0, 5)} isLive={isConnected} />
            </div>
          </TabsContent>

          <TabsContent value="calls" className="space-y-6">
            <LiveApiCallsTable calls={apiCallLogs} isLive={isConnected} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RealtimeCharts apiCalls={apiCallLogs} />
              <Card>
                <CardHeader>
                  <CardTitle>Provider Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {apiProviders.map((provider) => (
                      <div key={provider.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${provider.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className="font-medium">{provider.provider_name}</span>
                        </div>
                        <Badge variant={provider.status === 'connected' ? 'default' : 'destructive'}>
                          {provider.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Cost Alerts & Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No active alerts. Your usage is within normal limits.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Orchestr8Dashboard;
