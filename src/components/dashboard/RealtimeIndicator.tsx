
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RealtimeIndicatorProps {
  isListening: boolean;
}

const RealtimeIndicator: React.FC<RealtimeIndicatorProps> = ({ isListening }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={isListening ? "default" : "secondary"}
            className={`${isListening ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500'} text-white`}
          >
            <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-white animate-pulse' : 'bg-gray-300'} mr-2`} />
            {isListening ? 'Live' : 'Offline'}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isListening ? 'Receiving realtime updates' : 'Not connected to realtime'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RealtimeIndicator;
