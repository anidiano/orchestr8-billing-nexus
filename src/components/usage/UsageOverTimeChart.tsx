
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useRealUsageData } from '@/hooks/useRealUsageData';

interface UsageOverTimeChartProps {
  dateRange: { from: Date; to: Date };
  modelFilter: string;
  chartType: string;
}

export function UsageOverTimeChart({ dateRange, modelFilter, chartType }: UsageOverTimeChartProps) {
  const { usageOverTime, isLoading } = useRealUsageData(dateRange, modelFilter);

  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="text-muted-foreground">Loading usage data...</div>
      </div>
    );
  }

  if (!usageOverTime || usageOverTime.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="text-muted-foreground">No usage data found for the selected period</div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-md shadow-md border border-gray-200">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === 'tokens' ? 'Tokens' : 
               entry.dataKey === 'calls' ? 'API Calls' : 'Cost'}: {' '}
              <span className="font-medium">
                {entry.dataKey === 'cost' ? `$${entry.value.toFixed(4)}` : entry.value.toLocaleString()}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const ChartComponent = chartType === 'bar' ? BarChart : LineChart;

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={usageOverTime}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          {chartType === 'bar' ? (
            <>
              <Bar dataKey="tokens" fill="#8884d8" />
              <Bar dataKey="calls" fill="#82ca9d" />
            </>
          ) : (
            <>
              <Line type="monotone" dataKey="tokens" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="calls" stroke="#82ca9d" strokeWidth={2} />
            </>
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}
