
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface UsageBreakdownChartProps {
  modelFilter: string;
}

const data = [
  { name: 'GPT-4-Turbo', value: 45, color: '#0ca5e9' },
  { name: 'Claude 3 Opus', value: 30, color: '#0284c7' },
  { name: 'GPT-3.5-Turbo', value: 15, color: '#7cd4fd' },
  { name: 'Llama 3', value: 10, color: '#36bffa' },
];

export function UsageBreakdownChart({ modelFilter }: UsageBreakdownChartProps) {
  // Filter data based on modelFilter
  const filteredData = modelFilter === 'all' 
    ? data 
    : data.filter(item => item.name.toLowerCase().includes(modelFilter.toLowerCase()));

  // Custom label component for the pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Only show label if segment is big enough (over 5%)
    if (percent < 0.05) return null;

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        style={{ fontSize: '12px', fontWeight: 500 }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-md shadow-md border border-gray-200">
          <p className="font-semibold">{data.name}</p>
          <p className="text-muted-foreground">
            Usage: <span className="font-medium">{data.value}%</span>
          </p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={90}
            innerRadius={50}
            fill="#8884d8"
            dataKey="value"
            label={renderCustomizedLabel}
            paddingAngle={2}
            animationBegin={0}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {filteredData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                stroke="white" 
                strokeWidth={2}
                style={{
                  filter: 'drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.1))'
                }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
            formatter={(value, entry, index) => (
              <span className="text-sm font-medium">{value}</span>
            )}
            wrapperStyle={{ paddingTop: 20 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
