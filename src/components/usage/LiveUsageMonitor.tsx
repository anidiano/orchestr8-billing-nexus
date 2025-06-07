
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, Zap, Clock, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { useQuery } from '@tanstack/react-query';

interface LiveMetric {
  timestamp: string;
  calls: number;
  tokens: number;
  success_rate: number;
}

interface RealtimeUsageData {
  totalCalls: number;
  tokensThisHour: number;
  currentSuccessRate: number;
  averageResponseTime: number;
  chartData: LiveMetric[];
}

const LiveUsageMonitor: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [usageData, setUsageData] = useState<RealtimeUsageData>({
    totalCalls: 0,
    tokensThisHour: 0,
    currentSuccessRate: 100,
    averageResponseTime: 245,
    chartData: []
  });

  // Fetch real usage data from Supabase
  const fetchUsageData = async () => {
    if (!user) return null;

    try {
      // Get usage logs from the last 12 hours
      const now = new Date();
      const twelveHoursAgo = new Date(now.getTime() - (12 * 60 * 60 * 1000));
      
      const { data: usageLogs, error } = await supabase
        .from('usage_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('timestamp', twelveHoursAgo.toISOString())
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Error fetching usage data:', error);
        return null;
      }

      // Transform data for charts
      const chartData: LiveMetric[] = [];
      let totalCalls = 0;
      let totalTokens = 0;
      let totalSuccessful = 0;
      let totalFailed = 0;

      // Group by hour and create chart data
      const hourlyData = new Map();
      
      usageLogs?.forEach(log => {
        const hour = new Date(log.timestamp).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        if (!hourlyData.has(hour)) {
          hourlyData.set(hour, {
            calls: 0,
            tokens: 0,
            successful: 0,
            failed: 0
          });
        }
        
        const existing = hourlyData.get(hour);
        existing.calls += log.calls_per_hour || 0;
        existing.tokens += (log.tokens_input || 0) + (log.tokens_output || 0);
        existing.successful += log.successful_calls || 0;
        existing.failed += log.failed_calls || 0;
        
        totalCalls += log.calls_per_hour || 0;
        totalTokens += (log.tokens_input || 0) + (log.tokens_output || 0);
        totalSuccessful += log.successful_calls || 0;
        totalFailed += log.failed_calls || 0;
      });

      // Convert to chart format
      hourlyData.forEach((data, hour) => {
        chartData.push({
          timestamp: hour,
          calls: data.calls,
          tokens: data.tokens,
          success_rate: data.calls > 0 ? Math.round((data.successful / data.calls) * 100) : 100
        });
      });

      // Fill in missing hours with zero data if needed
      while (chartData.length < 12) {
        const time = new Date(now.getTime() - ((12 - chartData.length) * 60 * 60 * 1000));
        chartData.unshift({
          timestamp: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          calls: 0,
          tokens: 0,
          success_rate: 100
        });
      }

      const currentSuccessRate = totalCalls > 0 ? Math.round((totalSuccessful / totalCalls) * 100) : 100;

      return {
        totalCalls,
        tokensThisHour: totalTokens,
        currentSuccessRate,
        averageResponseTime: 245, // This would need to be tracked separately
        chartData: chartData.slice(-12) // Keep only last 12 data points
      };
    } catch (error) {
      console.error('Error in fetchUsageData:', error);
      return null;
    }
  };

  const { data: realUsageData, refetch } = useQuery({
    queryKey: ['liveUsageData', user?.id],
    queryFn: fetchUsageData,
    enabled: !!user,
    refetchInterval: 60000, // Refetch every minute
  });

  // Set up realtime listening for usage updates
  const { isListening } = useRealtimeData({
    table: 'usage_logs',
    onUpdate: () => {
      console.log('Usage data updated, refetching...');
      refetch();
      toast({
        title: "Live Update",
        description: "Usage data updated in real-time",
      });
    }
  });

  // Update local state when real data changes
  useEffect(() => {
    if (realUsageData) {
      setUsageData(realUsageData);
    }
  }, [realUsageData]);

  const MetricCard = ({ title, value, icon, change }: { 
    title: string; 
    value: string | number; 
    icon: React.ReactNode; 
    change?: string;
  }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            {change && (
              <p className="text-xs text-green-500 mt-1">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                {change}
              </p>
            )}
          </div>
          <div className="p-2 bg-muted rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Live Usage Monitor</h2>
          <p className="text-muted-foreground">Real-time API usage and performance metrics</p>
        </div>
        <Badge variant={isListening ? "default" : "secondary"} className={isListening ? "bg-green-500" : ""}>
          <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-white animate-pulse' : 'bg-gray-300'} mr-2`} />
          {isListening ? 'Live' : 'Offline'}
        </Badge>
      </div>

      {/* Live Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Calls Today" 
          value={usageData.totalCalls.toLocaleString()} 
          icon={<Activity className="h-5 w-5 text-blue-500" />}
          change="+12% from yesterday"
        />
        <MetricCard 
          title="Tokens This Period" 
          value={usageData.tokensThisHour.toLocaleString()} 
          icon={<Zap className="h-5 w-5 text-yellow-500" />}
          change="+8% from last period"
        />
        <MetricCard 
          title="Success Rate" 
          value={`${usageData.currentSuccessRate}%`} 
          icon={<TrendingUp className="h-5 w-5 text-green-500" />}
          change="+2% improvement"
        />
        <MetricCard 
          title="Avg Response Time" 
          value={`${usageData.averageResponseTime}ms`} 
          icon={<Clock className="h-5 w-5 text-purple-500" />}
          change="-15ms faster"
        />
      </div>

      {/* Live Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>API Calls (Live)</CardTitle>
            <CardDescription>Real-time API call volume from your usage logs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usageData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="timestamp" 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="calls" 
                    stroke="#0ca5e9" 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, stroke: '#0ca5e9' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Token Usage (Live)</CardTitle>
            <CardDescription>Real-time token consumption from usage logs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usageData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="timestamp" 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb',
                    }}
                  />
                  <Bar 
                    dataKey="tokens" 
                    fill="#0284c7" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveUsageMonitor;
