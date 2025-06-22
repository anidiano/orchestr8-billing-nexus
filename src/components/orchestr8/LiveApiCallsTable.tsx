
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { 
  Activity,
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  Zap,
  Server
} from 'lucide-react';
import { ApiCallLog } from '@/types/orchestr8';

interface LiveApiCallsTableProps {
  calls: ApiCallLog[];
  isLive: boolean;
}

const LiveApiCallsTable: React.FC<LiveApiCallsTableProps> = ({ calls, isLive }) => {
  const formatCost = (cost: number) => {
    return `$${cost.toFixed(6)}`;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getProviderColor = (provider: string) => {
    const colors: Record<string, string> = {
      'openai': 'bg-green-100 text-green-800',
      'anthropic': 'bg-orange-100 text-orange-800',
      'stability': 'bg-purple-100 text-purple-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[provider.toLowerCase()] || colors.default;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Live API Calls
        </CardTitle>
        <Badge variant={isLive ? "default" : "secondary"} className={isLive ? "bg-green-500" : ""}>
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-white animate-pulse' : 'bg-gray-300'} mr-2`} />
          {isLive ? 'Live' : 'Offline'}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {calls.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No API calls yet. Connect your providers to start tracking.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {calls.slice(0, 10).map((call) => (
                <div
                  key={call.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(call.success)}
                      <Badge className={getProviderColor(call.provider_id)}>
                        {call.provider_id}
                      </Badge>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm truncate">
                          {call.endpoint}
                        </span>
                        {call.model && (
                          <Badge variant="outline" className="text-xs">
                            {call.model}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTime(call.created_at)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Zap className="h-3 w-3 text-yellow-500" />
                      <span>{call.total_tokens.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-3 w-3 text-green-500" />
                      <span>{formatCost(call.cost_usd)}</span>
                    </div>
                    
                    {call.response_time_ms && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-blue-500" />
                        <span>{call.response_time_ms}ms</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveApiCallsTable;
