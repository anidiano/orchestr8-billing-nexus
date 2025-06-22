
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ApiCallLog } from '@/types/orchestr8';

interface RealtimeChartsProps {
  apiCalls: ApiCallLog[];
}

const RealtimeCharts: React.FC<RealtimeChartsProps> = ({ apiCalls }) => {
  // Process data for charts
  const processCallsOverTime = () => {
    const last24Hours = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date();
      hour.setHours(hour.getHours() - (23 - i));
      return {
        time: hour.toLocaleTimeString([], { hour: '2-digit' }),
        calls: 0,
        tokens: 0,
        cost: 0
      };
    });

    // Group calls by hour
    apiCalls.forEach(call => {
      const callHour = new Date(call.created_at).getHours();
      const currentHour = new Date().getHours();
      const hourIndex = ((callHour - currentHour + 24) % 24) + (24 - 24);
      
      if (hourIndex >= 0 && hourIndex < 24) {
        last24Hours[hourIndex].calls += 1;
        last24Hours[hourIndex].tokens += call.total_tokens;
        last24Hours[hourIndex].cost += call.cost_usd;
      }
    });

    return last24Hours.slice(-12); // Show last 12 hours
  };

  const processProviderBreakdown = () => {
    const providerStats: Record<string, { calls: number; cost: number }> = {};
    
    apiCalls.forEach(call => {
      if (!providerStats[call.provider_id]) {
        providerStats[call.provider_id] = { calls: 0, cost: 0 };
      }
      providerStats[call.provider_id].calls += 1;
      providerStats[call.provider_id].cost += call.cost_usd;
    });

    return Object.entries(providerStats).map(([provider, stats]) => ({
      provider: provider.charAt(0).toUpperCase() + provider.slice(1),
      calls: stats.calls,
      cost: parseFloat(stats.cost.toFixed(4))
    }));
  };

  const callsData = processCallsOverTime();
  const providerData = processProviderBreakdown();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Calls Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={callsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'calls' ? value : 
                  name === 'cost' ? `$${Number(value).toFixed(4)}` : 
                  Number(value).toLocaleString(),
                  name === 'calls' ? 'API Calls' :
                  name === 'cost' ? 'Cost' : 'Tokens'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="calls" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Provider Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={providerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="provider" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'cost' ? `$${Number(value).toFixed(4)}` : value,
                  name === 'cost' ? 'Total Cost' : 'API Calls'
                ]}
              />
              <Bar dataKey="calls" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealtimeCharts;
