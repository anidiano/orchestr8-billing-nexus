
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

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value}%`, 'Usage']}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
