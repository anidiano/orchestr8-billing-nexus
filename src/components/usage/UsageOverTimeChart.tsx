
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface UsageOverTimeChartProps {
  dateRange: { from: Date; to: Date };
  modelFilter: string;
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

export function UsageOverTimeChart({ dateRange, modelFilter }: UsageOverTimeChartProps) {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => [value.toLocaleString(), 'Tokens']}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          />
          <Legend />
          {(modelFilter === 'all' || modelFilter === 'gpt-4') && (
            <Line 
              type="monotone" 
              dataKey="gpt4" 
              name="GPT-4-Turbo" 
              stroke="#0ca5e9" 
              activeDot={{ r: 8 }} 
              strokeWidth={2} 
            />
          )}
          {(modelFilter === 'all' || modelFilter === 'claude-3') && (
            <Line 
              type="monotone" 
              dataKey="claude" 
              name="Claude 3 Opus" 
              stroke="#0284c7" 
              activeDot={{ r: 8 }} 
              strokeWidth={2} 
            />
          )}
          {(modelFilter === 'all' || modelFilter === 'gpt-3.5') && (
            <Line 
              type="monotone" 
              dataKey="gpt35" 
              name="GPT-3.5-Turbo" 
              stroke="#7cd4fd" 
              activeDot={{ r: 8 }} 
              strokeWidth={2} 
            />
          )}
          {(modelFilter === 'all' || modelFilter === 'llama-3') && (
            <Line 
              type="monotone" 
              dataKey="llama" 
              name="Llama 3" 
              stroke="#36bffa" 
              activeDot={{ r: 8 }} 
              strokeWidth={2} 
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
