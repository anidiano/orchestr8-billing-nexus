import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MetricsCards from '@/components/dashboard/MetricsCards';
import UsageChart from '@/components/dashboard/UsageChart';
import RecentActivity, { ActivityItem } from '@/components/dashboard/RecentActivity';
import RealtimeIndicator from '@/components/dashboard/RealtimeIndicator';
import TestRealtimeButton from '@/components/dashboard/TestRealtimeButton';
import DashboardFlow from '@/components/dashboard/DashboardFlow';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import SampleDataButton from '@/components/dashboard/SampleDataButton';

interface DashboardMetrics {
  total_invocations_month: number;
  success_rate: number;
  active_orchestrations: number;
  current_plan: string;
  credits_used: number;
  credits_allowed: number;
}

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const { toast } = useToast();
  
  const fetchDashboardMetrics = async (): Promise<DashboardMetrics | null> => {
    if (!user) return null;
    
    try {
      console.log('Fetching dashboard metrics for user:', user.id);
      
      const { data, error } = await supabase
        .from('dashboard_metrics')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching metrics:', error);
        
        // If no dashboard_metrics view data, calculate manually
        console.log('No metrics view data, calculating manually...');
        
        const { data: billing } = await supabase
          .from('billing')
          .select('*')
          .eq('user_id', user.id)
          .single();

        const { data: invocations } = await supabase
          .from('invocations')
          .select('*')
          .eq('user_id', user.id);

        const { data: orchestrations } = await supabase
          .from('orchestrations')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active');

        const totalInvocations = invocations?.length || 0;
        const successfulInvocations = invocations?.filter(inv => inv.status === 'success').length || 0;
        const successRate = totalInvocations > 0 ? Math.round((successfulInvocations / totalInvocations) * 100) : 100;

        const manualMetrics = {
          total_invocations_month: totalInvocations,
          success_rate: successRate,
          active_orchestrations: orchestrations?.length || 0,
          current_plan: billing?.current_plan || 'free',
          credits_used: billing?.credits_used || 0,
          credits_allowed: billing?.credits_allowed || 1000
        };

        console.log('Manual metrics calculated:', manualMetrics);
        return manualMetrics;
      }
      
      console.log('Dashboard metrics from view:', data);
      return data;
    } catch (err) {
      console.error('Error in fetchDashboardMetrics:', err);
      
      return {
        total_invocations_month: 0,
        success_rate: 100,
        active_orchestrations: 0,
        current_plan: 'free',
        credits_used: 0,
        credits_allowed: 1000
      };
    }
  };

  const { data: metrics, isLoading, refetch } = useQuery({
    queryKey: ['dashboardMetrics', user?.id],
    queryFn: fetchDashboardMetrics,
    enabled: !!user,
    refetchInterval: 30000,
  });

  // Set up realtime updates for multiple tables
  const { isListening: invocationsListening } = useRealtimeData({
    table: 'invocations',
    onUpdate: () => {
      console.log('Invocations updated, refreshing dashboard...');
      refetch();
    }
  });

  const { isListening: usageListening } = useRealtimeData({
    table: 'usage_logs',
    onUpdate: () => {
      console.log('Usage logs updated, refreshing dashboard...');
      refetch();
    }
  });

  const { isListening: billingListening } = useRealtimeData({
    table: 'billing',
    onUpdate: () => {
      console.log('Billing updated, refreshing dashboard...');
      refetch();
    }
  });

  const isListening = invocationsListening && usageListening && billingListening;

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Dashboard refreshed",
      description: "Latest data has been loaded.",
    });
  };
  
  const fetchRecentActivity = async (): Promise<ActivityItem[]> => {
    if (!user) return [];
    
    try {
      const { data: invocationsData, error: invocationsError } = await supabase
        .from('invocations')
        .select('id, status, error_message, created_at, orchestration_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (invocationsError) {
        console.error('Error fetching recent invocations:', invocationsError);
        return [];
      }
      
      return (invocationsData || []).map(inv => ({
        id: inv.id,
        type: (inv.status === 'success' ? 'usage' : 'alert') as 'usage' | 'alert',
        description: `Orchestration ${inv.status}: ${inv.error_message || 'Completed successfully'}`,
        timestamp: new Date(inv.created_at).toLocaleDateString(),
      }));
    } catch (err) {
      console.error('Error in fetchRecentActivity:', err);
      return [];
    }
  };

  const { data: activityData, refetch: refetchActivity } = useQuery({
    queryKey: ['recentActivity', user?.id],
    queryFn: fetchRecentActivity,
    enabled: !!user,
    refetchInterval: 30000,
  });

  // Set up realtime updates for activity
  useRealtimeData({
    table: 'invocations',
    onUpdate: () => {
      console.log('Invocations updated, refreshing activity...');
      refetchActivity();
    }
  });
  
  const safeMetrics = metrics || {
    total_invocations_month: 0,
    success_rate: 100,
    active_orchestrations: 0,
    current_plan: 'free',
    credits_used: 0,
    credits_allowed: 1000
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
              <RealtimeIndicator isListening={isListening} />
              <TestRealtimeButton />
              <SampleDataButton />
            </div>
            <p className="text-muted-foreground">Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}! Here's your AI operations at a glance.</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px] bg-background border">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="icon" 
              className="w-10 h-10"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center justify-center h-full w-full">
                      {isLoading ? (
                        <span className="animate-spin">⟳</span>
                      ) : (
                        '⟳'
                      )}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="live-api">Live API Dashboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            <div className="mb-8">
              <MetricsCards 
                metrics={{
                  monthlyRevenue: `$${(safeMetrics.credits_used * 0.01).toFixed(2)}`,
                  apiCalls: safeMetrics.total_invocations_month.toLocaleString(),
                  tokenUsage: safeMetrics.credits_used.toLocaleString(),
                  activeCustomers: safeMetrics.active_orchestrations.toString(),
                  successRate: `${safeMetrics.success_rate}%`
                }}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <Card className="lg:col-span-3 overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="bg-card border-b">
                  <CardTitle>Usage Analytics</CardTitle>
                  <CardDescription>View your token usage and associated costs over time</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <UsageChart />
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest events from your account</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <RecentActivity activityItems={activityData || []} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="live-api">
            <DashboardFlow />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
