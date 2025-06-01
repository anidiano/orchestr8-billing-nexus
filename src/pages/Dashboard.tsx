
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MetricsCards from '@/components/dashboard/MetricsCards';
import UsageChart from '@/components/dashboard/UsageChart';
import RecentActivity, { ActivityItem } from '@/components/dashboard/RecentActivity';
import RealtimeIndicator from '@/components/dashboard/RealtimeIndicator';
import TestRealtimeButton from '@/components/dashboard/TestRealtimeButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { useRealtimeMetrics } from '@/hooks/useRealtimeMetrics';

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
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Enable realtime updates for dashboard
  const { isListening } = useRealtimeMetrics();
  
  const fetchDashboardMetrics = async (): Promise<DashboardMetrics | null> => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('dashboard_metrics')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching metrics:', error);
        toast({
          title: "Error loading dashboard",
          description: error.message,
          variant: "destructive"
        });
        
        // Return default values instead of null to prevent UI crashes
        return {
          total_invocations_month: 0,
          success_rate: 0,
          active_orchestrations: 0,
          current_plan: 'free',
          credits_used: 0,
          credits_allowed: 1000
        };
      }
      
      console.log('Dashboard metrics:', data);
      return data;
    } catch (err) {
      console.error('Error in fetchDashboardMetrics:', err);
      toast({
        title: "Error loading dashboard",
        description: "Unable to fetch dashboard data. Please try again.",
        variant: "destructive"
      });
      
      // Return default values instead of null
      return {
        total_invocations_month: 0,
        success_rate: 0,
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
    refetchInterval: isListening ? false : 30000, // Only poll if not realtime
  });

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
      // Simplified query to avoid potential policy recursion
      const { data: invocationsData, error: invocationsError } = await supabase
        .from('invocations')
        .select('id, status, error_message, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (invocationsError) {
        console.error('Error fetching recent invocations:', invocationsError);
        return [];
      }
      
      // Transform into activity items
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

  const { data: activityData } = useQuery({
    queryKey: ['recentActivity', user?.id],
    queryFn: fetchRecentActivity,
    enabled: !!user,
    refetchInterval: isListening ? false : 30000, // Only poll if not realtime
  });
  
  // Ensure metrics has default values
  const safeMetrics = metrics || {
    total_invocations_month: 0,
    success_rate: 0,
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Top AI Models</CardTitle>
                <CardDescription>Usage distribution across models</CardDescription>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Info</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Distribution of API calls across your top AI models</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "GPT-4-Turbo", percentage: 45, color: "bg-orchestr8-500" },
                  { name: "Claude 3 Opus", percentage: 30, color: "bg-orchestr8-600" },
                  { name: "GPT-3.5-Turbo", percentage: 15, color: "bg-orchestr8-400" },
                  { name: "Llama 3", percentage: 10, color: "bg-orchestr8-300" }
                ].map((model, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{model.name}</span>
                      <span className="text-sm text-muted-foreground">{model.percentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className={`${model.color} h-2.5 rounded-full`} style={{ width: `${model.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Cost Summary</CardTitle>
                <CardDescription>Current billing period</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/billing'}>
                View Details
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "GPT Models", amount: safeMetrics.credits_used * 0.006 },
                  { name: "Claude Models", amount: safeMetrics.credits_used * 0.004 },
                  { name: "Vector Databases", amount: safeMetrics.credits_used * 0.0015 },
                  { name: "Image Generation", amount: safeMetrics.credits_used * 0.00075 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="font-medium">${item.amount.toFixed(2)}</span>
                  </div>
                ))}
                
                <div className="pt-4 mt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold text-lg">
                      ${(safeMetrics.credits_used * 0.01).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
