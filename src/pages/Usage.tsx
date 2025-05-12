
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/usage/DateRangePicker";
import { ModelUsageTable } from "@/components/usage/ModelUsageTable";
import { UsageBreakdownChart } from "@/components/usage/UsageBreakdownChart";
import { UsageOverTimeChart } from "@/components/usage/UsageOverTimeChart";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Usage: React.FC = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  
  const [modelFilter, setModelFilter] = useState<string>("all");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Usage Analytics</h1>
            <p className="text-muted-foreground">Monitor your AI model usage across services</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
            <DateRangePicker date={dateRange} setDate={setDateRange} />
            <Select value={modelFilter} onValueChange={setModelFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="claude-3">Claude 3</SelectItem>
                <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                <SelectItem value="llama-3">Llama 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Usage Over Time</CardTitle>
                <CardDescription>Token usage trends by date</CardDescription>
              </div>
              <Tabs defaultValue="tokens" className="w-[200px]">
                <TabsList>
                  <TabsTrigger value="tokens">Tokens</TabsTrigger>
                  <TabsTrigger value="cost">Cost</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <UsageOverTimeChart dateRange={dateRange} modelFilter={modelFilter} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Usage Summary</CardTitle>
              <CardDescription>Current billing period</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium">Total tokens</div>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold">8.5M</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium">Estimated cost</div>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold">$24,582</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium">API calls</div>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold">1.2M</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Avg. cost per call</div>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold">$0.02</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Period comparison</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-md p-3">
                    <div className="text-sm text-muted-foreground">vs last period</div>
                    <div className="text-lg font-bold text-green-500">+12%</div>
                  </div>
                  <div className="border rounded-md p-3">
                    <div className="text-sm text-muted-foreground">vs forecast</div>
                    <div className="text-lg font-bold text-red-500">-3%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Usage Breakdown</CardTitle>
              <CardDescription>By model type</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <UsageBreakdownChart modelFilter={modelFilter} />
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Model Usage Details</CardTitle>
                <CardDescription>Usage metrics by model</CardDescription>
              </div>
              <Badge variant="outline" className="ml-auto">
                Last 30 days
              </Badge>
            </CardHeader>
            <CardContent>
              <ModelUsageTable dateRange={dateRange} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Usage;
