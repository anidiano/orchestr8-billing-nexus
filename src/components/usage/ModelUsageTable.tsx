
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";

interface ModelUsageTableProps {
  dateRange: { from: Date; to: Date };
}

const modelUsageData = [
  {
    id: 1,
    model: "GPT-4-Turbo",
    provider: "OpenAI",
    tokens: 4200000,
    calls: 520000,
    cost: 12450.00,
    avgCostPerCall: 0.024,
    trend: 8.5,
  },
  {
    id: 2,
    model: "Claude 3 Opus",
    provider: "Anthropic",
    tokens: 2850000,
    calls: 320000,
    cost: 8230.00,
    avgCostPerCall: 0.026,
    trend: 15.2,
  },
  {
    id: 3,
    model: "GPT-3.5-Turbo",
    provider: "OpenAI",
    tokens: 1200000,
    calls: 280000,
    cost: 2400.00,
    avgCostPerCall: 0.009,
    trend: -4.3,
  },
  {
    id: 4,
    model: "Llama 3",
    provider: "Meta",
    tokens: 250000,
    calls: 80000,
    cost: 1502.00,
    avgCostPerCall: 0.019,
    trend: 22.7,
  },
];

export function ModelUsageTable({ dateRange }: ModelUsageTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Model</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead className="text-right">Tokens</TableHead>
            <TableHead className="text-right">API Calls</TableHead>
            <TableHead className="text-right">Cost</TableHead>
            <TableHead className="text-right">Avg Cost/Call</TableHead>
            <TableHead className="text-right">Trend</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {modelUsageData.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.model}</TableCell>
              <TableCell>{row.provider}</TableCell>
              <TableCell className="text-right">{row.tokens.toLocaleString()}</TableCell>
              <TableCell className="text-right">{row.calls.toLocaleString()}</TableCell>
              <TableCell className="text-right">${row.cost.toLocaleString()}</TableCell>
              <TableCell className="text-right">${row.avgCostPerCall.toFixed(3)}</TableCell>
              <TableCell className="text-right">
                <div className={`flex items-center justify-end ${row.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {row.trend >= 0 ? 
                    <ArrowUp className="h-4 w-4 mr-1" /> : 
                    <ArrowDown className="h-4 w-4 mr-1" />
                  }
                  {Math.abs(row.trend).toFixed(1)}%
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
