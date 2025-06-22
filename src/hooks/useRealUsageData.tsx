
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UsageData {
  date: string;
  tokens: number;
  calls: number;
  cost: number;
  model?: string;
}

interface ModelUsage {
  model: string;
  tokens: number;
  calls: number;
  cost: number;
  avgResponseTime: number;
}

export const useRealUsageData = (dateRange: { from: Date; to: Date }, modelFilter: string = 'all') => {
  const { user } = useAuth();

  // Fetch usage logs
  const { data: usageLogs, isLoading: usageLoading } = useQuery({
    queryKey: ['usageLogs', user?.id, dateRange.from, dateRange.to],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('usage_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('timestamp', dateRange.from.toISOString())
        .lte('timestamp', dateRange.to.toISOString())
        .order('timestamp');

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  // Fetch detailed API call logs
  const { data: apiCallLogs, isLoading: callsLoading } = useQuery({
    queryKey: ['apiCallLogs', user?.id, dateRange.from, dateRange.to, modelFilter],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('api_call_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString());

      if (modelFilter !== 'all') {
        query = query.ilike('model', `%${modelFilter}%`);
      }

      const { data, error } = await query.order('created_at');

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  // Process usage over time data
  const usageOverTime = usageLogs?.map(log => ({
    date: new Date(log.timestamp).toLocaleDateString(),
    tokens: log.tokens_input + log.tokens_output,
    calls: log.calls_per_hour,
    cost: 0, // We'll calculate from API calls
    model: log.model
  })) || [];

  // Process model usage data
  const modelUsage: ModelUsage[] = [];
  if (apiCallLogs) {
    const modelStats: Record<string, {
      tokens: number;
      calls: number;
      cost: number;
      totalResponseTime: number;
    }> = {};

    apiCallLogs.forEach(call => {
      const model = call.model || 'unknown';
      if (!modelStats[model]) {
        modelStats[model] = {
          tokens: 0,
          calls: 0,
          cost: 0,
          totalResponseTime: 0
        };
      }
      
      modelStats[model].tokens += call.total_tokens;
      modelStats[model].calls += 1;
      modelStats[model].cost += call.cost_usd;
      modelStats[model].totalResponseTime += call.response_time_ms || 0;
    });

    Object.entries(modelStats).forEach(([model, stats]) => {
      modelUsage.push({
        model,
        tokens: stats.tokens,
        calls: stats.calls,
        cost: stats.cost,
        avgResponseTime: Math.round(stats.totalResponseTime / stats.calls) || 0
      });
    });
  }

  // Calculate breakdown data for pie chart
  const breakdownData = modelUsage.map(usage => ({
    name: usage.model,
    value: Math.round((usage.tokens / modelUsage.reduce((sum, u) => sum + u.tokens, 1)) * 100),
    color: getModelColor(usage.model)
  }));

  return {
    usageOverTime,
    modelUsage,
    breakdownData,
    isLoading: usageLoading || callsLoading,
    totalTokens: modelUsage.reduce((sum, u) => sum + u.tokens, 0),
    totalCalls: modelUsage.reduce((sum, u) => sum + u.calls, 0),
    totalCost: modelUsage.reduce((sum, u) => sum + u.cost, 0)
  };
};

// Helper function to assign colors to models
const getModelColor = (model: string): string => {
  const colors: Record<string, string> = {
    'gpt-4': '#0ca5e9',
    'gpt-3.5': '#7cd4fd',
    'claude-3': '#0284c7',
    'llama': '#36bffa',
    'unknown': '#9ca3af'
  };
  
  const modelKey = Object.keys(colors).find(key => 
    model.toLowerCase().includes(key.toLowerCase())
  );
  
  return colors[modelKey || 'unknown'];
};
