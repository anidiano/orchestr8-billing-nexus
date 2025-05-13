
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BillingPlans } from "@/components/billing/BillingPlans";
import { InvoiceHistory } from "@/components/billing/InvoiceHistory";
import { PaymentMethod } from "@/components/billing/PaymentMethod";
import { Badge } from "@/components/ui/badge";
import { CreditCard, FileText, Package } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Billing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("plans");
  
  // Billing period calculation
  const startDate = new Date(new Date().setDate(1)); // First day of current month
  const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0); // Last day of current month
  const today = new Date();
  const progress = Math.floor((today.getDate() / endDate.getDate()) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
            <p className="text-muted-foreground">Manage your subscription, payment methods, and billing history</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <Badge variant="outline" className="bg-orchestr8-50 text-orchestr8-700 border-orchestr8-200 py-1.5 px-3">
              <Package className="h-4 w-4 mr-1.5" />
              Current plan: Enterprise
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">Need Help?</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Contact support@orchestr8.ai</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Billing period progress indicator */}
        <Card className="mb-8 border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current Billing Period</CardTitle>
            <CardDescription>
              {startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 mb-4">
              <div 
                className="bg-orchestr8-500 h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Current usage</div>
                <div className="text-lg font-semibold">$16,387.50</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Projected total</div>
                <div className="text-lg font-semibold">$24,582.00</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="plans" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 max-w-md">
            <TabsTrigger value="plans" className="flex items-center">
              <Package className="h-4 w-4 mr-2" />
              <span>Plans</span>
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              <span>Invoices</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              <span>Payment</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans" className="space-y-4">
            <BillingPlans currentPlan="enterprise" />
          </TabsContent>
          
          <TabsContent value="invoices">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Invoice History</CardTitle>
                <CardDescription>View and download your past invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <InvoiceHistory />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payment">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your payment methods and billing address</CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentMethod />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Billing;
