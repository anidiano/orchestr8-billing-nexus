
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, PlusCircle, Trash2 } from "lucide-react";

interface PaymentCard {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export function PaymentMethod() {
  const [cards, setCards] = useState<PaymentCard[]>([
    {
      id: '1',
      type: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2024,
      isDefault: true
    },
    {
      id: '2',
      type: 'mastercard',
      last4: '5555',
      expMonth: 3,
      expYear: 2025,
      isDefault: false
    }
  ]);

  const getCardIcon = (type: string) => {
    switch(type) {
      case 'visa':
        return '💳 Visa';
      case 'mastercard':
        return '💳 Mastercard';
      case 'amex':
        return '💳 American Express';
      default:
        return '💳';
    }
  };

  const setDefaultCard = (cardId: string) => {
    setCards(cards.map(card => ({
      ...card,
      isDefault: card.id === cardId
    })));
  };

  const removeCard = (cardId: string) => {
    // Don't remove if it's the default card and the only card
    if (cards.length === 1 && cards[0].id === cardId && cards[0].isDefault) {
      return;
    }
    
    // If removing the default card, set another as default
    if (cards.find(card => card.id === cardId)?.isDefault && cards.length > 1) {
      const newDefaultCard = cards.find(card => card.id !== cardId);
      setCards(cards
        .filter(card => card.id !== cardId)
        .map(card => ({
          ...card,
          isDefault: card.id === newDefaultCard?.id
        }))
      );
    } else {
      setCards(cards.filter(card => card.id !== cardId));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-4">Saved Payment Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map(card => (
            <Card key={card.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-md">{getCardIcon(card.type)}</CardTitle>
                <CardDescription>
                  **** **** **** {card.last4}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">
                  Expires: {card.expMonth.toString().padStart(2, '0')}/{card.expYear}
                </p>
                {card.isDefault && (
                  <p className="text-sm font-medium text-orchestr8-600 mt-1">
                    Default payment method
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                {!card.isDefault && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setDefaultCard(card.id)}
                  >
                    Set as default
                  </Button>
                )}
                {(cards.length > 1 || !card.isDefault) && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeCard(card.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
          
          <Card className="flex items-center justify-center h-[172px] border-dashed">
            <Button variant="ghost" className="flex flex-col h-full w-full">
              <div className="flex flex-col items-center justify-center h-full space-y-2">
                <PlusCircle className="h-6 w-6 text-muted-foreground" />
                <span className="text-muted-foreground">Add payment method</span>
              </div>
            </Button>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Billing Address</h3>
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Company Headquarters</CardTitle>
          </CardHeader>
          <CardContent>
            <address className="not-italic">
              <p>Orchestr8 Inc.</p>
              <p>123 AI Plaza</p>
              <p>San Francisco, CA 94103</p>
              <p>United States</p>
            </address>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">Edit address</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
