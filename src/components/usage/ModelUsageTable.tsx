
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUp, ArrowDown, Info } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

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
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="font-medium">Model</TableHead>
            <TableHead className="font-medium">Provider</TableHead>
            <TableHead className="text-right font-medium">
              <div className="flex items-center justify-end gap-1">
                Tokens
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total number of tokens processed</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TableHead>
            <TableHead className="text-right font-medium">
              <div className="flex items-center justify-end gap-1">
                API Calls
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Number of requests made to the API</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TableHead>
            <TableHead className="text-right font-medium">
              <div className="flex items-center justify-end gap-1">
                Cost
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total cost for the selected period</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TableHead>
            <TableHead className="text-right font-medium">
              <div className="flex items-center justify-end gap-1">
                Avg Cost/Call
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Average cost per API call</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TableHead>
            <TableHead className="text-right font-medium">
              <div className="flex items-center justify-end gap-1">
                Trend
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Usage trend compared to previous period</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {modelUsageData.map((row) => (
            <TableRow key={row.id} className="hover:bg-muted/30 transition-colors">
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
                  <span className="font-medium">{Math.abs(row.trend).toFixed(1)}%</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-muted/20">
            <TableCell colSpan={2} className="font-semibold">Total</TableCell>
            <TableCell className="text-right font-semibold">
              {modelUsageData.reduce((acc, row) => acc + row.tokens, 0).toLocaleString()}
            </TableCell>
            <TableCell className="text-right font-semibold">
              {modelUsageData.reduce((acc, row) => acc + row.calls, 0).toLocaleString()}
            </TableCell>
            <TableCell className="text-right font-semibold">
              ${modelUsageData.reduce((acc, row) => acc + row.cost, 0).toLocaleString()}
            </TableCell>
            <TableCell className="text-right font-semibold">
              ${(modelUsageData.reduce((acc, row) => acc + (row.cost / row.calls), 0) / modelUsageData.length).toFixed(3)}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
