
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ApiCallLog, ApiProvider, CostAlert, RealtimeMetrics } from '@/types/orchestr8';

export const useOrchestr8Realtime = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<RealtimeMetrics>({
    totalCalls: 0,
    totalTokens: 0,
    totalCost: 0,
    avgResponseTime: 0,
    successRate: 100,
    activeProviders: 0,
    callsPerMinute: 0,
    costPerHour: 0
  });
  const [recentCalls, setRecentCalls] = useState<ApiCallLog[]>([]);
  const [isListening, setIsListening] = useState(false);

  const fetchLatestMetrics = useCallback(async () => {
    if (!user) return;

    try {
      // Fetch recent API calls (last hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { data: callLogs } = await supabase
        .from('api_call_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', oneHourAgo)
        .order('created_at', { ascending: false })
        .limit(100);

      // Fetch active providers
      const { data: providers } = await supabase
        .from('api_providers')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (callLogs) {
        setRecentCalls(callLogs);
        
        // Calculate real-time metrics
        const totalCalls = callLogs.length;
        const totalTokens = callLogs.reduce((sum, call) => sum + call.total_tokens, 0);
        const totalCost = callLogs.reduce((sum, call) => sum + Number(call.cost_usd), 0);
        const avgResponseTime = totalCalls > 0 
          ? callLogs.reduce((sum, call) => sum + call.response_time_ms, 0) / totalCalls 
          : 0;
        const successfulCalls = callLogs.filter(call => call.success).length;
        const successRate = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 100;
        const activeProviders = providers?.length || 0;
        
        // Calculate calls per minute (based on last hour)
        const callsPerMinute = totalCalls / 60;
        const costPerHour = totalCost;

        setMetrics({
          totalCalls,
          totalTokens,
          totalCost,
          avgResponseTime: Math.round(avgResponseTime),
          successRate: Math.round(successRate * 100) / 100,
          activeProviders,
          callsPerMinute: Math.round(callsPerMinute * 100) / 100,
          costPerHour: Math.round(costPerHour * 10000) / 10000
        });
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    setIsListening(true);
    fetchLatestMetrics();

    // Set up realtime listeners
    const apiCallsChannel = supabase
      .channel('api-calls-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'api_call_logs',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New API call logged:', payload);
          fetchLatestMetrics();
          
          const newCall = payload.new as ApiCallLog;
          toast({
            title: "New API Call",
            description: `${newCall.provider_id} - ${newCall.endpoint} (${newCall.total_tokens} tokens)`,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'cost_alerts',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const alert = payload.new as CostAlert;
          if (alert.is_triggered) {
            toast({
              title: "Cost Alert Triggered!",
              description: `${alert.alert_type}: $${alert.current_amount} exceeded threshold of $${alert.threshold_amount}`,
              variant: "destructive"
            });
          }
        }
      )
      .subscribe();

    const providersChannel = supabase
      .channel('providers-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'api_providers',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchLatestMetrics();
        }
      )
      .subscribe();

    // Refresh metrics every 30 seconds
    const interval = setInterval(fetchLatestMetrics, 30000);

    return () => {
      setIsListening(false);
      supabase.removeChannel(apiCallsChannel);
      supabase.removeChannel(providersChannel);
      clearInterval(interval);
    };
  }, [user, fetchLatestMetrics, toast]);

  return {
    metrics,
    recentCalls,
    isListening,
    refreshMetrics: fetchLatestMetrics
  };
};
