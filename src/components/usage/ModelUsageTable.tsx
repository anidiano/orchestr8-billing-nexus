
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { useRealUsageData } from '@/hooks/useRealUsageData';

interface ModelUsageTableProps {
  dateRange: { from: Date; to: Date };
}

export function ModelUsageTable({ dateRange }: ModelUsageTableProps) {
  const { modelUsage, isLoading, totalCost, totalTokens, totalCalls } = useRealUsageData(dateRange);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading model usage data...</div>
      </div>
    );
  }

  if (!modelUsage || modelUsage.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">No model usage data found for the selected period</div>
      </div>
    );
  }

  const formatCost = (cost: number) => `$${cost.toFixed(6)}`;
  const formatTokens = (tokens: number) => tokens.toLocaleString();

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{formatTokens(totalTokens)}</div>
          <div className="text-sm text-blue-600">Total Tokens</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{totalCalls.toLocaleString()}</div>
          <div className="text-sm text-green-600">Total API Calls</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{formatCost(totalCost)}</div>
          <div className="text-sm text-purple-600">Total Cost</div>
        </div>
      </div>

      {/* Model Usage Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Model</TableHead>
            <TableHead className="text-right">API Calls</TableHead>
            <TableHead className="text-right">Tokens Used</TableHead>
            <TableHead className="text-right">Cost</TableHead>
            <TableHead className="text-right">Avg Response Time</TableHead>
            <TableHead className="text-right">Usage %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {modelUsage
            .sort((a, b) => b.tokens - a.tokens)
            .map((usage, index) => {
              const usagePercentage = totalTokens > 0 ? (usage.tokens / totalTokens) * 100 : 0;
              
              return (
                <TableRow key={usage.model}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{usage.model}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{usage.calls.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{formatTokens(usage.tokens)}</TableCell>
                  <TableCell className="text-right">{formatCost(usage.cost)}</TableCell>
                  <TableCell className="text-right">{usage.avgResponseTime}ms</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={usagePercentage > 50 ? "default" : "secondary"}>
                      {usagePercentage.toFixed(1)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}
