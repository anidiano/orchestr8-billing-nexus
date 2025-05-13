
import React from 'react';
import { ArrowDown, ArrowUp, Database, DollarSign, Users } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface MetricsCardsProps {
  metrics: {
    monthlyRevenue: string;
    apiCalls: string;
    tokenUsage: string;
    activeCustomers: string;
    successRate: string;
  };
}

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, trend, icon }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
          </div>
          <div className="p-2 bg-muted rounded-full">
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          {trend && (
            <span className={`mr-1 flex items-center ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.positive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
              {trend.value}
            </span>
          )}
          <span className="text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
      <MetricCard 
        title="Monthly Revenue" 
        value={metrics.monthlyRevenue} 
        description="vs previous month" 
        trend={{
          value: "12%",
          positive: true
        }}
        icon={<DollarSign className="h-5 w-5 text-orchestr8-500" />}
      />
      <MetricCard 
        title="API Calls" 
        value={metrics.apiCalls} 
        description="vs previous month" 
        trend={{
          value: "8%",
          positive: true
        }}
        icon={<Database className="h-5 w-5 text-orchestr8-500" />}
      />
      <MetricCard 
        title="Token Usage" 
        value={metrics.tokenUsage} 
        description="vs previous month" 
        trend={{
          value: "3%",
          positive: false
        }}
        icon={<Database className="h-5 w-5 text-orchestr8-500" />}
      />
      <MetricCard 
        title="Success Rate" 
        value={metrics.successRate} 
        description="vs previous month" 
        trend={{
          value: "5%",
          positive: true
        }}
        icon={<Users className="h-5 w-5 text-orchestr8-500" />}
      />
    </div>
  );
};

export default MetricsCards;
