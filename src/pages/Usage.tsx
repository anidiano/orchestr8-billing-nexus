
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsageOverTimeChart } from '@/components/usage/UsageOverTimeChart';
import { UsageBreakdownChart } from '@/components/usage/UsageBreakdownChart';
import { DateRangePicker } from '@/components/usage/DateRangePicker';
import { ModelUsageTable } from '@/components/usage/ModelUsageTable';
import LiveUsageMonitor from '@/components/usage/LiveUsageMonitor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, BarChart3, LineChart, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Usage: React.FC = () => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 4, 1),
    to: new Date()
  });
  const [modelFilter, setModelFilter] = useState('all');
  const [chartType, setChartType] = useState('line');

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your usage data export is being prepared and will download shortly.",
    });
    
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your usage data has been exported successfully.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Usage Analytics</h1>
            <p className="text-muted-foreground">Monitor your API usage, token consumption, and performance metrics</p>
          </div>
          <Button onClick={handleExport} className="mt-4 md:mt-0">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>

        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="live" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Live Monitor
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="space-y-6">
            <LiveUsageMonitor />
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <DateRangePicker 
                dateRange={dateRange} 
                onDateRangeChange={setDateRange} 
              />
              <div className="flex gap-2">
                <Select value={modelFilter} onValueChange={setModelFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Models</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                    <SelectItem value="claude-3">Claude 3</SelectItem>
                    <SelectItem value="llama-3">Llama 3</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Token Usage Over Time</CardTitle>
                <CardDescription>
                  Track your token consumption across different AI models and time periods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UsageOverTimeChart 
                  dateRange={dateRange} 
                  modelFilter={modelFilter}
                  chartType={chartType}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Model Usage Details</CardTitle>
                <CardDescription>
                  Detailed breakdown of usage by model, including costs and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ModelUsageTable modelFilter={modelFilter} dateRange={dateRange} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Trends</CardTitle>
                  <CardDescription>
                    Analyze usage patterns and trends over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UsageOverTimeChart 
                    dateRange={dateRange} 
                    modelFilter={modelFilter}
                    chartType="line"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Model Distribution</CardTitle>
                  <CardDescription>
                    Distribution of usage across different AI models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UsageBreakdownChart modelFilter={modelFilter} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Usage Breakdown</CardTitle>
                <CardDescription>
                  Detailed breakdown of your API usage by model and service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UsageBreakdownChart modelFilter={modelFilter} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Usage;
