
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

  useEffect(() => {
    if (!user) return;

    console.log('Setting up Orchestr8 realtime connection for user:', user.id);
    setIsLive(true);

    // For now, let's simulate data until the new tables are available in types
    const generateMockData = () => {
      const mockCalls: ApiCallLog[] = [
        {
          id: '1',
          user_id: user.id,
          provider_id: 'openai',
          endpoint: '/v1/chat/completions',
          method: 'POST',
          model: 'gpt-4',
          tokens_input: 150,
          tokens_output: 300,
          total_tokens: 450,
          cost_usd: 0.0135,
          response_time_ms: 1200,
          status_code: 200,
          success: true,
          error_message: undefined,
          request_metadata: {},
          response_metadata: {},
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          user_id: user.id,
          provider_id: 'anthropic',
          endpoint: '/v1/messages',
          method: 'POST',
          model: 'claude-3-sonnet',
          tokens_input: 200,
          tokens_output: 500,
          total_tokens: 700,
          cost_usd: 0.021,
          response_time_ms: 800,
          status_code: 200,
          success: true,
          error_message: undefined,
          request_metadata: {},
          response_metadata: {},
          created_at: new Date(Date.now() - 30000).toISOString()
        }
      ];

      const mockProviders: ApiProvider[] = [
        {
          id: '1',
          user_id: user.id,
          provider_id: 'openai',
          provider_name: 'OpenAI',
          api_key_encrypted: 'encrypted_key_1',
          auth_type: 'bearer',
          is_active: true,
          status: 'connected',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          user_id: user.id,
          provider_id: 'anthropic',
          provider_name: 'Anthropic',
          api_key_encrypted: 'encrypted_key_2',
          auth_type: 'bearer',
          is_active: true,
          status: 'connected',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      setApiCalls(mockCalls);
      setProviders(mockProviders);
      
      // Calculate metrics from mock data
      const totalCalls = mockCalls.length;
      const totalTokens = mockCalls.reduce((sum, call) => sum + call.total_tokens, 0);
      const totalCost = mockCalls.reduce((sum, call) => sum + call.cost_usd, 0);
      const avgResponseTime = mockCalls.reduce((sum, call) => sum + (call.response_time_ms || 0), 0) / totalCalls;
      const successRate = (mockCalls.filter(call => call.success).length / totalCalls) * 100;
      
      setMetrics({
        totalCalls,
        totalTokens,
        totalCost,
        avgResponseTime,
        successRate,
        activeProviders: mockProviders.filter(p => p.is_active).length,
        callsPerMinute: totalCalls / 60, // Simplified calculation
        costPerHour: totalCost * 60 // Simplified calculation
      });
    };

    // Generate initial mock data
    generateMockData();

    // Simulate real-time updates every 5 seconds
    const interval = setInterval(() => {
      console.log('Simulating new API call...');
      const newCall: ApiCallLog = {
        id: Date.now().toString(),
        user_id: user.id,
        provider_id: Math.random() > 0.5 ? 'openai' : 'anthropic',
        endpoint: '/v1/chat/completions',
        method: 'POST',
        model: Math.random() > 0.5 ? 'gpt-4' : 'claude-3-sonnet',
        tokens_input: Math.floor(Math.random() * 500) + 100,
        tokens_output: Math.floor(Math.random() * 1000) + 200,
        total_tokens: 0, // Will be calculated
        cost_usd: Math.random() * 0.05,
        response_time_ms: Math.floor(Math.random() * 2000) + 500,
        status_code: 200,
        success: Math.random() > 0.1, // 90% success rate
        error_message: undefined,
        request_metadata: {},
        response_metadata: {},
        created_at: new Date().toISOString()
      };
      
      newCall.total_tokens = newCall.tokens_input + newCall.tokens_output;
      
      setApiCalls(prev => [newCall, ...prev].slice(0, 50)); // Keep last 50 calls
      
      // Update metrics
      setMetrics(prev => ({
        ...prev,
        totalCalls: prev.totalCalls + 1,
        totalTokens: prev.totalTokens + newCall.total_tokens,
        totalCost: prev.totalCost + newCall.cost_usd,
        callsPerMinute: prev.callsPerMinute + 0.2
      }));
    }, 5000);

    return () => {
      console.log('Cleaning up Orchestr8 realtime connection');
      clearInterval(interval);
      setIsLive(false);
    };
  }, [user]);

  return {
    apiCalls,
    providers,
    metrics,
    isLive
  };
};
