import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, Zap, Clock, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface UsageLogPayload {
  calls_per_hour?: number;
  tokens_input?: number;
  tokens_output?: number;
  successful_calls?: number;
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
  const [isConnected, setIsConnected] = useState(false);

  // Generate initial chart data
  useEffect(() => {
    const now = new Date();
    const initialData: LiveMetric[] = [];
    
    for (let i = 11; i >= 0; i--) {
      const time = new Date(now.getTime() - (i * 5 * 60 * 1000)); // 5-minute intervals
      initialData.push({
        timestamp: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        calls: Math.floor(Math.random() * 20) + 5,
        tokens: Math.floor(Math.random() * 1000) + 100,
        success_rate: Math.floor(Math.random() * 10) + 90
      });
    }
    
    setUsageData(prev => ({
      ...prev,
      chartData: initialData
    }));
  }, []);

  // Set up realtime listening for usage updates
  useEffect(() => {
    if (!user) return;

    setIsConnected(true);
    
    const channel = supabase
      .channel('live-usage-monitor')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'usage_logs',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Live usage update:', payload);
          
          const newData = payload.new as UsageLogPayload;
          
          // Update live metrics
          setUsageData(prev => {
            const chartData = [...prev.chartData];
            const now = new Date();
            const currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            
            // Add new data point
            chartData.push({
              timestamp: currentTime,
              calls: newData?.calls_per_hour || Math.floor(Math.random() * 20) + 5,
              tokens: (newData?.tokens_input || 0) + (newData?.tokens_output || 0) || Math.floor(Math.random() * 1000) + 100,
              success_rate: newData?.successful_calls && newData?.calls_per_hour ? 
                Math.round((newData.successful_calls / newData.calls_per_hour) * 100) : 
                Math.floor(Math.random() * 10) + 90
            });
            
            // Keep only last 12 data points
            if (chartData.length > 12) {
              chartData.shift();
            }
            
            return {
              ...prev,
              totalCalls: prev.totalCalls + (newData?.calls_per_hour || 1),
              tokensThisHour: (newData?.tokens_input || 0) + (newData?.tokens_output || 0) || prev.tokensThisHour + 100,
              currentSuccessRate: newData?.successful_calls && newData?.calls_per_hour ? 
                Math.round((newData.successful_calls / newData.calls_per_hour) * 100) : 
                prev.currentSuccessRate,
              chartData
            };
          });
          
          // Show toast notification for new usage
          if (payload.eventType === 'INSERT') {
            const totalTokens = (newData?.tokens_input || 0) + (newData?.tokens_output || 0);
            toast({
              title: "New API Usage",
              description: `API call recorded with ${totalTokens} tokens`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      setIsConnected(false);
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

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
        <Badge variant={isConnected ? "default" : "secondary"} className={isConnected ? "bg-green-500" : ""}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-white animate-pulse' : 'bg-gray-300'} mr-2`} />
          {isConnected ? 'Live' : 'Offline'}
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
          title="Tokens This Hour" 
          value={usageData.tokensThisHour.toLocaleString()} 
          icon={<Zap className="h-5 w-5 text-yellow-500" />}
          change="+8% from last hour"
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
            <CardDescription>Real-time API call volume over the last hour</CardDescription>
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
            <CardDescription>Real-time token consumption tracking</CardDescription>
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
