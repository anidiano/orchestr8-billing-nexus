
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Zap, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Server,
  Gauge,
  CreditCard
} from 'lucide-react';
import { RealtimeMetrics } from '@/types/orchestr8';

interface RealTimeMetricsCardProps {
  metrics: RealtimeMetrics;
  isLive: boolean;
}

const RealTimeMetricsCard: React.FC<RealTimeMetricsCardProps> = ({ metrics, isLive }) => {
  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    change, 
    color,
    suffix = ''
  }: {
    title: string;
    value: string | number;
    icon: any;
    change?: string;
    color: string;
    suffix?: string;
  }) => (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </div>
        {change && (
          <p className="text-xs text-muted-foreground mt-1">
            <TrendingUp className="h-3 w-3 inline mr-1" />
            {change}
          </p>
        )}
        {isLive && (
          <div className="absolute top-2 right-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Real-Time Metrics</h3>
        <Badge variant={isLive ? "default" : "secondary"} className={isLive ? "bg-green-500" : ""}>
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-white animate-pulse' : 'bg-gray-300'} mr-2`} />
          {isLive ? 'Live' : 'Offline'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Calls (1h)"
          value={metrics.totalCalls}
          icon={Activity}
          color="text-blue-500"
          change="+12% from last hour"
        />
        
        <MetricCard
          title="Total Tokens (1h)"
          value={metrics.totalTokens}
          icon={Zap}
          color="text-yellow-500"
          change="+8% from last hour"
        />
        
        <MetricCard
          title="Total Cost (1h)"
          value={`$${metrics.totalCost.toFixed(4)}`}
          icon={DollarSign}
          color="text-green-500"
          change="+5% from last hour"
        />
        
        <MetricCard
          title="Avg Response"
          value={metrics.avgResponseTime}
          icon={Clock}
          color="text-purple-500"
          suffix="ms"
          change="-15ms faster"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Success Rate"
          value={`${metrics.successRate.toFixed(1)}%`}
          icon={Gauge}
          color="text-emerald-500"
          change="+2% improvement"
        />
        
        <MetricCard
          title="Active Providers"
          value={metrics.activeProviders}
          icon={Server}
          color="text-indigo-500"
        />
        
        <MetricCard
          title="Calls/Minute"
          value={metrics.callsPerMinute.toFixed(1)}
          icon={TrendingUp}
          color="text-orange-500"
          change="Live rate"
        />
        
        <MetricCard
          title="Cost/Hour"
          value={`$${metrics.costPerHour.toFixed(4)}`}
          icon={CreditCard}
          color="text-red-500"
          change="Current rate"
        />
      </div>
    </div>
  );
};

export default RealTimeMetricsCard;
