
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ApiCallLog, ApiProvider, RealtimeMetrics } from '@/types/orchestr8';

export const useOrchestr8Realtime = () => {
  const { user } = useAuth();
  const [apiCalls, setApiCalls] = useState<ApiCallLog[]>([]);
  const [providers, setProviders] = useState<ApiProvider[]>([]);
  const [isLive, setIsLive] = useState(false);
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

  const fetchApiCalls = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('api_call_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching API calls:', error);
        return;
      }

      setApiCalls(data || []);
    } catch (error) {
      console.error('Error in fetchApiCalls:', error);
    }
  };

  const fetchProviders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('api_providers')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching providers:', error);
        return;
      }

      setProviders(data || []);
    } catch (error) {
      console.error('Error in fetchProviders:', error);
    }
  };

  const calculateMetrics = (calls: ApiCallLog[], providers: ApiProvider[]) => {
    if (calls.length === 0) {
      return {
        totalCalls: 0,
        totalTokens: 0,
        totalCost: 0,
        avgResponseTime: 0,
        successRate: 100,
        activeProviders: providers.filter(p => p.is_active).length,
        callsPerMinute: 0,
        costPerHour: 0
      };
    }

    const totalCalls = calls.length;
    const totalTokens = calls.reduce((sum, call) => sum + call.total_tokens, 0);
    const totalCost = calls.reduce((sum, call) => sum + call.cost_usd, 0);
    const avgResponseTime = calls.reduce((sum, call) => sum + (call.response_time_ms || 0), 0) / totalCalls;
    const successRate = (calls.filter(call => call.success).length / totalCalls) * 100;
    
    // Calculate calls per minute (last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCalls = calls.filter(call => new Date(call.created_at) > oneHourAgo);
    const callsPerMinute = recentCalls.length / 60;
    
    // Calculate cost per hour
    const costPerHour = totalCost * (60 / Math.max(1, totalCalls));

    return {
      totalCalls,
      totalTokens,
      totalCost,
      avgResponseTime: Math.round(avgResponseTime),
      successRate: Math.round(successRate * 100) / 100,
      activeProviders: providers.filter(p => p.is_active).length,
      callsPerMinute: Math.round(callsPerMinute * 100) / 100,
      costPerHour: Math.round(costPerHour * 10000) / 10000
    };
  };

  useEffect(() => {
    if (!user) return;

    console.log('Setting up Orchestr8 realtime connection for user:', user.id);
    setIsLive(true);

    // Initial data fetch
    fetchApiCalls();
    fetchProviders();

    // Set up realtime subscriptions
    const apiCallsChannel = supabase
      .channel('api_call_logs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'api_call_logs',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('API call log change:', payload);
          fetchApiCalls();
        }
      )
      .subscribe();

    const providersChannel = supabase
      .channel('api_providers_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'api_providers',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('API provider change:', payload);
          fetchProviders();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up Orchestr8 realtime connection');
      supabase.removeChannel(apiCallsChannel);
      supabase.removeChannel(providersChannel);
      setIsLive(false);
    };
  }, [user]);

  // Update metrics when data changes
  useEffect(() => {
    const newMetrics = calculateMetrics(apiCalls, providers);
    setMetrics(newMetrics);
  }, [apiCalls, providers]);

  return {
    apiCalls,
    providers,
    metrics,
    isLive
  };
};
