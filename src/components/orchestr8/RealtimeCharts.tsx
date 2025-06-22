
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ApiCallLog } from '@/types/orchestr8';

interface RealtimeChartsProps {
  apiCalls: ApiCallLog[];
  isLive: boolean;
}

const RealtimeCharts: React.FC<RealtimeChartsProps> = ({ apiCalls, isLive }) => {
  const [chartData, setChartData] = useState({
    timeSeriesData: [] as any[],
    providerData: [] as any[],
    costData: [] as any[],
    tokensData: [] as any[]
  });

  useEffect(() => {
    if (!apiCalls.length) return;

    // Process data for charts
    const now = new Date();
    const last60Minutes = Array.from({ length: 60 }, (_, i) => {
      const time = new Date(now.getTime() - (59 - i) * 60 * 1000);
      return {
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        timestamp: time.getTime(),
        calls: 0,
        tokens: 0,
        cost: 0,
        avgResponseTime: 0
      };
    });

    // Aggregate calls by minute
    apiCalls.forEach(call => {
      const callTime = new Date(call.created_at);
      const minuteIndex = Math.floor((callTime.getTime() - (now.getTime() - 59 * 60 * 1000)) / (60 * 1000));
      
      if (minuteIndex >= 0 && minuteIndex < 60) {
        last60Minutes[minuteIndex].calls += 1;
        last60Minutes[minuteIndex].tokens += call.total_tokens;
        last60Minutes[minuteIndex].cost += Number(call.cost_usd);
        last60Minutes[minuteIndex].avgResponseTime = 
          (last60Minutes[minuteIndex].avgResponseTime + call.response_time_ms) / 2;
      }
    });

    // Provider breakdown
    const providerBreakdown: { [key: string]: { calls: number; tokens: number; cost: number } } = {};
    apiCalls.forEach(call => {
      if (!providerBreakdown[call.provider_id]) {
        providerBreakdown[call.provider_id] = { calls: 0, tokens: 0, cost: 0 };
      }
      providerBreakdown[call.provider_id].calls += 1;
      providerBreakdown[call.provider_id].tokens += call.total_tokens;
      providerBreakdown[call.provider_id].cost += Number(call.cost_usd);
    });

    const providerData = Object.entries(providerBreakdown).map(([provider, data]) => ({
      name: provider,
      calls: data.calls,
      tokens: data.tokens,
      cost: data.cost,
      color: getProviderColor(provider)
    }));

    setChartData({
      timeSeriesData: last60Minutes,
      providerData,
      costData: last60Minutes.filter(d => d.cost > 0),
      tokensData: last60Minutes.filter(d => d.tokens > 0)
    });
  }, [apiCalls]);

  const getProviderColor = (provider: string) => {
    const colors: { [key: string]: string } = {
      'openai': '#0ca5e9',
      'anthropic': '#0284c7',
      'stability': '#7cd4fd',
      'cohere': '#36bffa',
      'huggingface': '#0ea5e9'
    };
    return colors[provider] || '#6b7280';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* API Calls Over Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 API Calls (Last 60 Minutes)
            {isLive && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="time" 
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
                <Area 
                  type="monotone" 
                  dataKey="calls" 
                  stroke="#0ca5e9" 
                  fill="#0ca5e9" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Token Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ⚡ Token Usage (Live)
            {isLive && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="time" 
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
                  dataKey="tokens" 
                  stroke="#eab308" 
                  strokeWidth={3}
                  dot={{ r: 2 }}
                  activeDot={{ r: 5, stroke: '#eab308' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Provider Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Provider Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.providerData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="calls"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.providerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Cost Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💰 Cost Tracking (Real-time)
            {isLive && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.costData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(4)}`, 'Cost']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                  }}
                />
                <Bar 
                  dataKey="cost" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealtimeCharts;
