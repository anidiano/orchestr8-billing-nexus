
import React from 'react';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrchestr8Realtime } from '@/hooks/useOrchestr8Realtime';
import RealTimeMetricsCard from '@/components/orchestr8/RealTimeMetricsCard';
import LiveApiCallsTable from '@/components/orchestr8/LiveApiCallsTable';
import RealtimeCharts from '@/components/orchestr8/RealtimeCharts';
import LiveUsageMonitor from '@/components/usage/LiveUsageMonitor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Settings, Zap, BarChart3, CreditCard, Shield } from 'lucide-react';

const Orchestr8Dashboard: React.FC = () => {
  const { metrics, recentCalls, isListening, refreshMetrics } = useOrchestr8Realtime();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Orchestr8 Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Real-time AI API monitoring, usage tracking, and cost management
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <Button 
              onClick={refreshMetrics} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="mb-8">
          <RealTimeMetricsCard metrics={metrics} isLive={isListening} />
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="realtime" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Live Monitoring
            </TabsTrigger>
            <TabsTrigger value="usage" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Usage Analytics
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="providers" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              API Providers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Live API Activity</CardTitle>
                  <CardDescription>
                    Real-time view of your AI API usage across all connected providers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RealtimeCharts apiCalls={recentCalls} isLive={isListening} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Calls Today</p>
                      <p className="text-2xl font-bold text-blue-600">{metrics.totalCalls}</p>
                    </div>
                    <Zap className="h-8 w-8 text-blue-500" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Cost Today</p>
                      <p className="text-2xl font-bold text-green-600">${metrics.totalCost.toFixed(2)}</p>
                    </div>
                    <CreditCard className="h-8 w-8 text-green-500" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <p className="text-2xl font-bold text-purple-600">{metrics.successRate.toFixed(1)}%</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="realtime" className="space-y-6 mt-6">
            <LiveApiCallsTable calls={recentCalls} isLive={isListening} />
            <RealtimeCharts apiCalls={recentCalls} isLive={isListening} />
          </TabsContent>

          <TabsContent value="usage" className="mt-6">
            <LiveUsageMonitor />
          </TabsContent>

          <TabsContent value="billing" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Cost Management</CardTitle>
                <CardDescription>
                  Track your AI API costs and set up billing alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Billing Dashboard Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Advanced billing features, cost alerts, and Stripe integration will be available here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="providers" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>API Provider Management</CardTitle>
                <CardDescription>
                  Connect and manage your AI API providers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Provider Management Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Connect OpenAI, Anthropic, Stability AI and other providers here
                  </p>
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
