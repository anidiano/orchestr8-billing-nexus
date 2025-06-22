
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApiCallLog } from '@/types/orchestr8';
import { CheckCircle, XCircle, Clock, Zap } from 'lucide-react';

interface LiveApiCallsTableProps {
  calls: ApiCallLog[];
  isLive: boolean;
}

const LiveApiCallsTable: React.FC<LiveApiCallsTableProps> = ({ calls, isLive }) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getStatusBadge = (success: boolean, statusCode: number) => {
    if (success && statusCode >= 200 && statusCode < 300) {
      return (
        <Badge variant="default" className="bg-green-500">
          <CheckCircle className="h-3 w-3 mr-1" />
          Success
        </Badge>
      );
    }
    return (
      <Badge variant="destructive">
        <XCircle className="h-3 w-3 mr-1" />
        Error
      </Badge>
    );
  };

  const getProviderIcon = (providerId: string) => {
    const icons: { [key: string]: string } = {
      'openai': '🤖',
      'anthropic': '🧠',
      'stability': '🎨',
      'cohere': '🔮',
      'huggingface': '🤗'
    };
    return icons[providerId] || '⚙️';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live API Calls
          </CardTitle>
          <Badge variant={isLive ? "default" : "secondary"} className={isLive ? "bg-green-500" : ""}>
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-white animate-pulse' : 'bg-gray-300'} mr-2`} />
            {isLive ? 'Live' : 'Offline'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>Model</TableHead>
                <TableHead className="text-right">Tokens</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Time (ms)</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calls.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No API calls recorded yet. Start using your connected providers to see real-time data.
                  </TableCell>
                </TableRow>
              ) : (
                calls.slice(0, 20).map((call) => (
                  <TableRow key={call.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">
                      {formatTime(call.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getProviderIcon(call.provider_id)}</span>
                        <span className="capitalize">{call.provider_id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {call.endpoint}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{call.model || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Zap className="h-3 w-3 text-yellow-500" />
                        {call.total_tokens.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      ${Number(call.cost_usd).toFixed(4)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Clock className="h-3 w-3 text-blue-500" />
                        {call.response_time_ms}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(call.success, call.status_code)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveApiCallsTable;
