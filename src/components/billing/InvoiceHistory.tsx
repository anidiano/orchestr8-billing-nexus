
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed';
  invoiceNumber: string;
}

export function InvoiceHistory() {
  const invoices: Invoice[] = [
    {
      id: '1',
      date: '2023-05-01',
      amount: '$499.00',
      status: 'paid',
      invoiceNumber: 'INV-2023-0001'
    },
    {
      id: '2',
      date: '2023-04-01',
      amount: '$499.00',
      status: 'paid',
      invoiceNumber: 'INV-2023-0002'
    },
    {
      id: '3',
      date: '2023-03-01',
      amount: '$499.00',
      status: 'paid',
      invoiceNumber: 'INV-2023-0003'
    },
    {
      id: '4',
      date: '2023-02-01',
      amount: '$399.00',
      status: 'paid',
      invoiceNumber: 'INV-2023-0004'
    },
    {
      id: '5',
      date: '2023-01-01',
      amount: '$399.00',
      status: 'paid',
      invoiceNumber: 'INV-2023-0005'
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
              <TableCell>{formatDate(invoice.date)}</TableCell>
              <TableCell>{invoice.amount}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(invoice.status)}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
