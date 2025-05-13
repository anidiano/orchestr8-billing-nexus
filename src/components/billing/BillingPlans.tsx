
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BillingPlansProps {
  currentPlan: 'free' | 'starter' | 'pro' | 'enterprise';
}

export function BillingPlans({ currentPlan }: BillingPlansProps) {
  const plans = [
    {
      name: 'Free',
      id: 'free',
      price: '$0',
      description: 'Basic AI usage tracking',
      features: [
        'Up to 50,000 tokens per month',
        'Basic analytics',
        'Single user account',
        '7-day data retention'
      ]
    },
    {
      name: 'Starter',
      id: 'starter',
      price: '$99',
      description: 'For startups and small teams',
      features: [
        'Up to 2M tokens per month',
        'Full analytics dashboard',
        'Up to 5 team members',
        '30-day data retention',
        'Email support'
      ]
    },
    {
      name: 'Professional',
      id: 'pro',
      price: '$499',
      description: 'For growing businesses',
      features: [
        'Up to 10M tokens per month',
        'Advanced analytics and reporting',
        'Up to 20 team members',
        '90-day data retention',
        'Priority support',
        'Custom integrations'
      ]
    },
    {
      name: 'Enterprise',
      id: 'enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: [
        'Unlimited tokens',
        'Advanced analytics and reporting',
        'Unlimited team members',
        '1-year data retention',
        'Dedicated support',
        'Custom integrations',
        'On-premise deployment options',
        'Custom contract terms'
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {plans.map(plan => (
        <Card key={plan.id} className={`flex flex-col ${currentPlan === plan.id ? 'border-orchestr8-500 border-2' : ''}`}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{plan.name}</CardTitle>
              {currentPlan === plan.id && (
                <Badge variant="outline" className="bg-orchestr8-50 text-orchestr8-700">
                  Current
                </Badge>
              )}
            </div>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="mb-4">
              <span className="text-3xl font-bold">{plan.price}</span>
              {plan.id !== 'free' && plan.id !== 'enterprise' && <span className="text-muted-foreground">/month</span>}
            </div>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-orchestr8-500 mr-2 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              variant={currentPlan === plan.id ? "outline" : "default"} 
              className="w-full" 
              disabled={currentPlan === plan.id}
            >
              {currentPlan === plan.id ? 'Current Plan' : 'Select Plan'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
