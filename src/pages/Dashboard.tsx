
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MetricsCards from '@/components/dashboard/MetricsCards';
import UsageChart from '@/components/dashboard/UsageChart';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your AI operations at a glance.</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px] bg-background border">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="w-10 h-10">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center justify-center h-full w-full">⟳</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <MetricsCards />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="lg:col-span-3 overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-card border-b">
              <CardTitle>Usage Analytics</CardTitle>
              <CardDescription>View your token usage and associated costs over time</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <UsageChart />
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest events from your account</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <RecentActivity />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Top AI Models</CardTitle>
                <CardDescription>Usage distribution across models</CardDescription>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Info</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Distribution of API calls across your top AI models</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "GPT-4-Turbo", percentage: 45, color: "bg-orchestr8-500" },
                  { name: "Claude 3 Opus", percentage: 30, color: "bg-orchestr8-600" },
                  { name: "GPT-3.5-Turbo", percentage: 15, color: "bg-orchestr8-400" },
                  { name: "Llama 3", percentage: 10, color: "bg-orchestr8-300" }
                ].map((model, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{model.name}</span>
                      <span className="text-sm text-muted-foreground">{model.percentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className={`${model.color} h-2.5 rounded-full`} style={{ width: `${model.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Cost Summary</CardTitle>
                <CardDescription>Current billing period</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "GPT Models", amount: 12450.00 },
                  { name: "Claude Models", amount: 8230.00 },
                  { name: "Vector Databases", amount: 3120.00 },
                  { name: "Image Generation", amount: 782.00 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="font-medium">${item.amount.toLocaleString()}</span>
                  </div>
                ))}
                
                <div className="pt-4 mt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold text-lg">${(12450 + 8230 + 3120 + 782).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
