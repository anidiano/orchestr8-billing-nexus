
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/usage/DateRangePicker";
import { ModelUsageTable } from "@/components/usage/ModelUsageTable";
import { UsageBreakdownChart } from "@/components/usage/UsageBreakdownChart";
import { UsageOverTimeChart } from "@/components/usage/UsageOverTimeChart";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart, LineChart, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

const Usage: React.FC = () => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  
  const [modelFilter, setModelFilter] = useState<string>("all");
  const [chartType, setChartType] = useState<string>("line");

  const handleExport = (type: string) => {
    toast({
      title: "Export Started",
      description: `Your ${type} export is being prepared and will download shortly.`,
    });
    
    // Simulating download delay
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Your ${type} file has been downloaded successfully.`,
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
            <p className="text-muted-foreground">Monitor and analyze your AI model usage across services</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
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
            <div className="flex gap-1">
              <Button 
                variant={chartType === "line" ? "default" : "outline"} 
                size="icon"
                onClick={() => setChartType("line")}
                className="w-10 h-10"
              >
                <LineChart className="h-5 w-5" />
              </Button>
              <Button 
                variant={chartType === "bar" ? "default" : "outline"} 
                size="icon"
                onClick={() => setChartType("bar")}
                className="w-10 h-10"
              >
                <BarChart className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-card border-b">
              <div>
                <CardTitle>Usage Over Time</CardTitle>
                <CardDescription>Token usage trends by date</CardDescription>
              </div>
              <div className="flex gap-2">
                <Tabs defaultValue="tokens" className="w-[200px]">
                  <TabsList>
                    <TabsTrigger value="tokens">Tokens</TabsTrigger>
                    <TabsTrigger value="cost">Cost</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="flex gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => handleExport('CSV')} className="h-9 w-9">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Export as CSV</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => handleExport('PDF')} className="h-9 w-9">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Export as PDF</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <UsageOverTimeChart dateRange={dateRange} modelFilter={modelFilter} chartType={chartType} />
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Usage Summary</CardTitle>
              <CardDescription>Current billing period</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                {[
                  { label: "Total tokens", value: "8.5M", tooltip: "The sum of all tokens processed by your AI models" },
                  { label: "Estimated cost", value: "$24,582", tooltip: "Total cost based on current usage and pricing" },
                  { label: "API calls", value: "1.2M", tooltip: "Number of requests made to AI model endpoints" },
                  { label: "Avg. cost per call", value: "$0.02", tooltip: "Average cost per API call across all models" }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md transition-colors">
                    <div className="flex items-center">
                      <div className="text-sm font-medium">{item.label}</div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 p-0 ml-1">
                              <Info className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{item.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Period comparison</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-md p-4 hover:bg-muted/20 transition-colors">
                    <div className="text-sm text-muted-foreground mb-1">vs last period</div>
                    <div className="text-lg font-bold text-green-500">+12%</div>
                  </div>
                  <div className="border rounded-md p-4 hover:bg-muted/20 transition-colors">
                    <div className="text-sm text-muted-foreground mb-1">vs forecast</div>
                    <div className="text-lg font-bold text-red-500">-3%</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button variant="outline" size="sm" onClick={() => handleExport('Report')}>
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-card border-b">
              <div>
                <CardTitle>Usage Breakdown</CardTitle>
                <CardDescription>By model type</CardDescription>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Distribution of token usage across different AI models</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent className="pt-6">
              <UsageBreakdownChart modelFilter={modelFilter} />
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2 border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-card border-b">
              <div>
                <CardTitle>Model Usage Details</CardTitle>
                <CardDescription>Usage metrics by model</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="ml-auto">
                  Last 30 days
                </Badge>
                <Button variant="outline" size="sm" onClick={() => handleExport('Table')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ModelUsageTable dateRange={dateRange} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Usage;
