
import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface UsageOverTimeChartProps {
  dateRange: { from: Date; to: Date };
  modelFilter: string;
  chartType?: string;
}

// Sample data
const data = [
  { name: 'May 1', gpt4: 400000, claude: 300000, gpt35: 250000, llama: 150000 },
  { name: 'May 8', gpt4: 420000, claude: 320000, gpt35: 230000, llama: 160000 },
  { name: 'May 15', gpt4: 480000, claude: 350000, gpt35: 240000, llama: 170000 },
  { name: 'May 22', gpt4: 520000, claude: 380000, gpt35: 220000, llama: 190000 },
  { name: 'May 29', gpt4: 490000, claude: 360000, gpt35: 210000, llama: 180000 },
  { name: 'Jun 5', gpt4: 550000, claude: 390000, gpt35: 200000, llama: 210000 },
  { name: 'Jun 12', gpt4: 600000, claude: 420000, gpt35: 180000, llama: 220000 },
];

export function UsageOverTimeChart({ dateRange, modelFilter, chartType = "line" }: UsageOverTimeChartProps) {
  const chartColors = {
    gpt4: "#0ca5e9",
    claude: "#0284c7",
    gpt35: "#7cd4fd",
    llama: "#36bffa"
  };

  const modelNames = {
    gpt4: "GPT-4-Turbo",
    claude: "Claude 3 Opus",
    gpt35: "GPT-3.5-Turbo",
    llama: "Llama 3"
  };

  const renderActiveShape = (props: any) => {
    // Additional custom rendering for active elements can be added here
    return <g>{props.children}</g>;
  };

  const shouldRenderModel = (modelKey: string) => {
    if (modelFilter === 'all') return true;
    
    const filterMap: {[key: string]: string} = {
      'gpt-4': 'gpt4',
      'claude-3': 'claude',
      'gpt-3.5': 'gpt35',
      'llama-3': 'llama'
    };
    
    return modelKey === filterMap[modelFilter];
  };

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "line" ? (
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => value >= 1000000 ? `${value / 1000000}M` : `${value / 1000}K`}
            />
            <Tooltip 
              formatter={(value: number) => [value.toLocaleString(), 'Tokens']}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                borderRadius: '6px',
                padding: '10px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb',
              }}
              cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '5 5' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: 10 }}
              formatter={(value) => <span style={{ color: '#374151', fontSize: 12 }}>{value}</span>}
            />
            {shouldRenderModel('gpt4') && (
              <Line 
                type="monotone" 
                dataKey="gpt4" 
                name={modelNames.gpt4}
                stroke={chartColors.gpt4} 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 7, stroke: chartColors.gpt4, strokeWidth: 2 }}
              />
            )}
            {shouldRenderModel('claude') && (
              <Line 
                type="monotone" 
                dataKey="claude" 
                name={modelNames.claude}
                stroke={chartColors.claude} 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 7, stroke: chartColors.claude, strokeWidth: 2 }}
              />
            )}
            {shouldRenderModel('gpt35') && (
              <Line 
                type="monotone" 
                dataKey="gpt35" 
                name={modelNames.gpt35}
                stroke={chartColors.gpt35} 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 7, stroke: chartColors.gpt35, strokeWidth: 2 }}
              />
            )}
            {shouldRenderModel('llama') && (
              <Line 
                type="monotone" 
                dataKey="llama" 
                name={modelNames.llama}
                stroke={chartColors.llama} 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 7, stroke: chartColors.llama, strokeWidth: 2 }}
              />
            )}
          </LineChart>
        ) : (
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => value >= 1000000 ? `${value / 1000000}M` : `${value / 1000}K`}
            />
            <Tooltip 
              formatter={(value: number) => [value.toLocaleString(), 'Tokens']}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                borderRadius: '6px',
                padding: '10px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb',
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: 10 }}
              formatter={(value) => <span style={{ color: '#374151', fontSize: 12 }}>{value}</span>}
            />
            {shouldRenderModel('gpt4') && (
              <Bar 
                dataKey="gpt4" 
                name={modelNames.gpt4}
                fill={chartColors.gpt4} 
                radius={[4, 4, 0, 0]}
                activeBar={renderActiveShape}
              />
            )}
            {shouldRenderModel('claude') && (
              <Bar 
                dataKey="claude" 
                name={modelNames.claude}
                fill={chartColors.claude} 
                radius={[4, 4, 0, 0]}
                activeBar={renderActiveShape}
              />
            )}
            {shouldRenderModel('gpt35') && (
              <Bar 
                dataKey="gpt35" 
                name={modelNames.gpt35}
                fill={chartColors.gpt35} 
                radius={[4, 4, 0, 0]}
                activeBar={renderActiveShape}
              />
            )}
            {shouldRenderModel('llama') && (
              <Bar 
                dataKey="llama" 
                name={modelNames.llama}
                fill={chartColors.llama} 
                radius={[4, 4, 0, 0]}
                activeBar={renderActiveShape}
              />
            )}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
