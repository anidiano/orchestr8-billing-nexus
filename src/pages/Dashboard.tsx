
import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MetricsCards from '@/components/dashboard/MetricsCards';
import UsageChart from '@/components/dashboard/UsageChart';
import RecentActivity from '@/components/dashboard/RecentActivity';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Monitor your AI usage and billing metrics</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Tabs defaultValue="day" className="w-[300px]">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <MetricsCards />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <UsageChart />
          <RecentActivity />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top AI Models</CardTitle>
              <CardDescription>Usage distribution across models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">GPT-4-Turbo</span>
                    <span className="text-sm text-muted-foreground">45%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-orchestr8-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Claude 3 Opus</span>
                    <span className="text-sm text-muted-foreground">30%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-orchestr8-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">GPT-3.5-Turbo</span>
                    <span className="text-sm text-muted-foreground">15%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-orchestr8-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Llama 3</span>
                    <span className="text-sm text-muted-foreground">10%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-orchestr8-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost Summary</CardTitle>
              <CardDescription>Current billing period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">GPT Models</span>
                  <span className="font-medium">$12,450.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Claude Models</span>
                  <span className="font-medium">$8,230.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Vector Databases</span>
                  <span className="font-medium">$3,120.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Image Generation</span>
                  <span className="font-medium">$782.00</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">$24,582.00</span>
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
