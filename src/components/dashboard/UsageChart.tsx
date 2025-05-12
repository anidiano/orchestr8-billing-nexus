
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const data = [
  { name: 'Jan', tokens: 4000, cost: 2400 },
  { name: 'Feb', tokens: 3000, cost: 1398 },
  { name: 'Mar', tokens: 2000, cost: 9800 },
  { name: 'Apr', tokens: 2780, cost: 3908 },
  { name: 'May', tokens: 1890, cost: 4800 },
  { name: 'Jun', tokens: 2390, cost: 3800 },
  { name: 'Jul', tokens: 3490, cost: 4300 },
  { name: 'Aug', tokens: 4000, cost: 2400 },
  { name: 'Sep', tokens: 3000, cost: 1398 },
  { name: 'Oct', tokens: 2000, cost: 9800 },
  { name: 'Nov', tokens: 2780, cost: 3908 },
  { name: 'Dec', tokens: 1890, cost: 4800 },
];

const UsageChart: React.FC = () => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Usage Analytics</CardTitle>
        <CardDescription>View your token usage and associated costs over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tokens" className="w-full">
          <TabsList className="grid grid-cols-2 w-[400px]">
            <TabsTrigger value="tokens">Token Usage</TabsTrigger>
            <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="tokens" className="mt-4 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                  }}
                  formatter={(value) => [`${value.toLocaleString()} tokens`, 'Usage']}
                />
                <Bar dataKey="tokens" fill="#0ca5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="cost" className="mt-4 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                  }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Cost']}
                />
                <Line type="monotone" dataKey="cost" stroke="#0284c7" activeDot={{ r: 8 }} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UsageChart;
