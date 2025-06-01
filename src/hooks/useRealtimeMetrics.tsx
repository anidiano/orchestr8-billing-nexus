
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRealtimeData } from './useRealtimeData';
import { useAuth } from '@/contexts/AuthContext';

export const useRealtimeMetrics = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const invalidateQueries = useCallback(() => {
    // Invalidate dashboard metrics query (this will refresh the view data)
    queryClient.invalidateQueries({
      queryKey: ['dashboardMetrics', user?.id]
    });
    
    // Invalidate recent activity query
    queryClient.invalidateQueries({
      queryKey: ['recentActivity', user?.id]
    });
  }, [queryClient, user?.id]);

  // Listen to invocations changes (this will trigger dashboard_metrics view updates)
  const { isListening: invocationsListening } = useRealtimeData({
    table: 'invocations',
    onUpdate: invalidateQueries
  });

  // Listen to usage logs changes
  const { isListening: usageListening } = useRealtimeData({
    table: 'usage_logs',
    onUpdate: invalidateQueries
  });

  // Listen to billing changes
  const { isListening: billingListening } = useRealtimeData({
    table: 'billing',
    onUpdate: invalidateQueries
  });

  // Listen to orchestrations changes
  const { isListening: orchestrationsListening } = useRealtimeData({
    table: 'orchestrations',
    onUpdate: invalidateQueries
  });

  return {
    isListening: invocationsListening && usageListening && billingListening && orchestrationsListening
  };
};
