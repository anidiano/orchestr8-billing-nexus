
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BillingPlans } from "@/components/billing/BillingPlans";
import { InvoiceHistory } from "@/components/billing/InvoiceHistory";
import { PaymentMethod } from "@/components/billing/PaymentMethod";
import { Badge } from "@/components/ui/badge";

const Billing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("plans");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
            <p className="text-muted-foreground">Manage your subscription and billing details</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Badge variant="outline" className="text-orchestr8-600 border-orchestr8-300 bg-orchestr8-50">
              Current plan: Enterprise
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="plans" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="invoices">Invoice History</TabsTrigger>
            <TabsTrigger value="payment">Payment Method</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans" className="space-y-4">
            <BillingPlans currentPlan="enterprise" />
          </TabsContent>
          
          <TabsContent value="invoices">
            <InvoiceHistory />
          </TabsContent>
          
          <TabsContent value="payment">
            <PaymentMethod />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Billing;
