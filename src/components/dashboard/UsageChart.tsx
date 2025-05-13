
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Download, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip as UITooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('tokens');

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your data export is being prepared and will download shortly.",
    });
    
    // Simulating download delay
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your file has been downloaded successfully.",
      });
    }, 1500);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-md shadow-md border border-gray-200">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
              {entry.name === 'tokens' ? 'Usage: ' : 'Cost: '}
              <span className="font-medium">
                {entry.name === 'tokens' 
                  ? `${entry.value.toLocaleString()} tokens` 
                  : `$${entry.value.toLocaleString()}`}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
        <div>
          <CardTitle className="flex items-center">
            Usage Analytics
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 p-0">
                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View your token usage and associated costs over time</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>View your token usage and associated costs over time</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="grid grid-cols-2 w-[220px]">
              <TabsTrigger value="tokens">Token Usage</TabsTrigger>
              <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="ghost" size="icon" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <TabsContent value="tokens" className="m-0">
          <div className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value) => value >= 1000 ? `${value / 1000}K` : value}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(value) => value === 'tokens' ? 'Token Usage' : value} />
                <Bar 
                  dataKey="tokens" 
                  name="tokens"
                  fill="#0ca5e9" 
                  radius={[4, 4, 0, 0]} 
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        <TabsContent value="cost" className="m-0">
          <div className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value) => `$${value >= 1000 ? value / 1000 + 'K' : value}`}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(value) => value === 'cost' ? 'Cost Analysis' : value} />
                <Line 
                  type="monotone" 
                  dataKey="cost" 
                  name="cost"
                  stroke="#0284c7" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 7, stroke: '#0284c7', strokeWidth: 2 }}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default UsageChart;
