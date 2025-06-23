
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ApiCallLog, ApiProvider, RealtimeMetrics } from '@/types/orchestr8';

export const useOrchestr8Realtime = () => {
  const { user } = useAuth();
  const [realtimeMetrics, setRealtimeMetrics] = useState<RealtimeMetrics>({
    totalCalls: 0,
    successfulCalls: 0,
    failedCalls: 0,
    avgResponseTime: 0,
    activeProviders: 0,
    totalTokens: 0,
    totalCost: 0,
    callsPerMinute: 0
  });

  // Fetch recent usage logs to simulate API call logs
  const { data: usageLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['recentUsageLogs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('usage_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    refetchInterval: 5000 // Refetch every 5 seconds for real-time feel
  });

  // Transform usage logs into API call logs format
  const apiCallLogs: ApiCallLog[] = (usageLogs || []).map(log => ({
    id: log.id,
    user_id: log.user_id,
    provider_id: 'openai',
    provider_name: 'OpenAI',
    endpoint: '/v1/chat/completions',
    method: 'POST',
    model: log.model || 'gpt-3.5-turbo',
    total_tokens: log.tokens_input + log.tokens_output,
    input_tokens: log.tokens_input,
    output_tokens: log.tokens_output,
    cost_usd: ((log.tokens_input + log.tokens_output) * 0.002) / 1000,
    response_time_ms: Math.floor(Math.random() * 2000) + 500,
    status_code: log.successful_calls > 0 ? 200 : 500,
    error_message: log.failed_calls > 0 ? 'API Error' : null,
    created_at: log.timestamp
  }));

  // Create mock providers based on models used
  const apiProviders: ApiProvider[] = [
    {
      id: 'openai-1',
      user_id: user?.id || '',
      provider_id: 'openai',
      provider_name: 'OpenAI',
      api_key_encrypted: 'sk-***encrypted***',
      auth_type: 'bearer',
      base_url: 'https://api.openai.com/v1',
      is_active: true,
      status: 'connected',
      created_at: new Date().toISOString()
    }
  ];

  // Calculate real-time metrics from usage logs
  useEffect(() => {
    if (!usageLogs || usageLogs.length === 0) return;

    const totalCalls = usageLogs.reduce((sum, log) => sum + log.calls_per_hour, 0);
    const successfulCalls = usageLogs.reduce((sum, log) => sum + log.successful_calls, 0);
    const failedCalls = usageLogs.reduce((sum, log) => sum + log.failed_calls, 0);
    const totalTokens = usageLogs.reduce((sum, log) => sum + log.tokens_input + log.tokens_output, 0);
    const totalCost = (totalTokens * 0.002) / 1000; // Approximate cost calculation

    const recentLogs = usageLogs.filter(log => 
      new Date(log.timestamp) > new Date(Date.now() - 60 * 60 * 1000)
    );
    const callsPerMinute = recentLogs.reduce((sum, log) => sum + log.calls_per_hour, 0) / 60;

    setRealtimeMetrics({
      totalCalls,
      successfulCalls,
      failedCalls,
      avgResponseTime: Math.floor(Math.random() * 1000) + 500, // Simulated
      activeProviders: 1,
      totalTokens,
      totalCost,
      callsPerMinute: Math.round(callsPerMinute)
    });
  }, [usageLogs]);

  return {
    realtimeMetrics,
    apiCallLogs,
    apiProviders,
    isLoading: logsLoading,
    isConnected: true
  };
};
