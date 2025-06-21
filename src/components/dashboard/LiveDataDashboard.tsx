
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Activity, Zap, Clock, TrendingUp, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LiveDataDashboardProps {
  apiKey: string;
  onReset: () => void;
}

interface ModelData {
  id: string;
  created: number;
  owned_by: string;
}

interface UsageMetrics {
  totalModels: number;
  lastUpdated: string;
  status: 'connected' | 'error' | 'loading';
  responseTime: number;
}

const LiveDataDashboard: React.FC<LiveDataDashboardProps> = ({ apiKey, onReset }) => {
  const [models, setModels] = useState<ModelData[]>([]);
  const [metrics, setMetrics] = useState<UsageMetrics>({
    totalModels: 0,
    lastUpdated: '',
    status: 'loading',
    responseTime: 0
  });
  const [chartData, setChartData] = useState<Array<{time: string, models: number, responseTime: number}>>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLiveData = async () => {
    const startTime = Date.now();
    try {
      setError(null);
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const responseTime = Date.now() - startTime;
      
      setModels(data.data || []);
      
      const newMetrics: UsageMetrics = {
        totalModels: data.data?.length || 0,
        lastUpdated: new Date().toLocaleTimeString(),
        status: 'connected',
        responseTime
      };
      setMetrics(newMetrics);

      // Update chart data
      const now = new Date().toLocaleTimeString();
      setChartData(prev => {
        const newData = [...prev, {
          time: now,
          models: newMetrics.totalModels,
          responseTime
        }].slice(-20); // Keep last 20 data points
        return newData;
      });

    } catch (err) {
      console.error('Error fetching live data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setMetrics(prev => ({ ...prev, status: 'error' }));
      toast({
        title: "Data Fetch Error",
        description: "Failed to fetch live data from OpenAI API",
        variant: "destructive"
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLiveData();
    setIsRefreshing(false);
    toast({
      title: "Data Refreshed",
      description: "Dashboard data has been updated",
    });
  };

  useEffect(() => {
    fetchLiveData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchLiveData, 30000);
    
    return () => clearInterval(interval);
  }, [apiKey]);

  const getStatusBadge = () => {
    switch (metrics.status) {
      case 'connected':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Connected</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="secondary">Loading...</Badge>;
    }
  };

  const MetricCard = ({ title, value, icon, description }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description: string;
  }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="p-2 bg-muted rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live API Dashboard</h1>
          <p className="text-muted-foreground">Real-time data from your connected OpenAI API</p>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge()}
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={onReset} variant="outline" size="sm">
            Reset API Key
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Available Models" 
          value={metrics.totalModels} 
          icon={<Activity className="h-5 w-5 text-blue-500" />}
          description="Total AI models accessible"
        />
        <MetricCard 
          title="API Response Time" 
          value={`${metrics.responseTime}ms`} 
          icon={<Clock className="h-5 w-5 text-green-500" />}
          description="Latest request latency"
        />
        <MetricCard 
          title="Connection Status" 
          value={metrics.status === 'connected' ? 'Active' : 'Inactive'} 
          icon={<Zap className="h-5 w-5 text-yellow-500" />}
          description="Real-time connection state"
        />
        <MetricCard 
          title="Last Updated" 
          value={metrics.lastUpdated || 'Never'} 
          icon={<TrendingUp className="h-5 w-5 text-purple-500" />}
          description="Data refresh timestamp"
        />
      </div>

      {/* Real-time Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Response Time Trend</CardTitle>
            <CardDescription>API response times over the last refreshes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="responseTime" 
                    stroke="#0ca5e9" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Models</CardTitle>
            <CardDescription>Latest AI models from your API ({models.length} total)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {models.slice(0, 10).map((model) => (
                <div key={model.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="font-mono text-sm">{model.id}</span>
                  <Badge variant="outline">{model.owned_by}</Badge>
                </div>
              ))}
              {models.length > 10 && (
                <p className="text-sm text-muted-foreground text-center pt-2">
                  ... and {models.length - 10} more models
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveDataDashboard;
