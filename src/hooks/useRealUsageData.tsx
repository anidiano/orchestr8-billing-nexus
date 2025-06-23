
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

  // Fetch usage logs from the existing table
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

  // Process usage over time data
  const usageOverTime: UsageData[] = (usageLogs || []).map(log => ({
    date: new Date(log.timestamp).toLocaleDateString(),
    tokens: log.tokens_input + log.tokens_output,
    calls: log.calls_per_hour,
    cost: ((log.tokens_input + log.tokens_output) * 0.002) / 1000, // Approximate cost
    model: log.model || 'gpt-3.5-turbo'
  }));

  // Process model usage data
  const modelUsage: ModelUsage[] = [];
  if (usageLogs) {
    const modelStats: Record<string, {
      tokens: number;
      calls: number;
      cost: number;
      totalResponseTime: number;
    }> = {};

    usageLogs.forEach(log => {
      const model = log.model || 'gpt-3.5-turbo';
      if (!modelStats[model]) {
        modelStats[model] = {
          tokens: 0,
          calls: 0,
          cost: 0,
          totalResponseTime: 0
        };
      }
      
      const tokens = log.tokens_input + log.tokens_output;
      modelStats[model].tokens += tokens;
      modelStats[model].calls += log.calls_per_hour;
      modelStats[model].cost += (tokens * 0.002) / 1000;
      modelStats[model].totalResponseTime += Math.floor(Math.random() * 1000) + 500; // Simulated
    });

    Object.entries(modelStats).forEach(([model, stats]) => {
      modelUsage.push({
        model,
        tokens: stats.tokens,
        calls: stats.calls,
        cost: stats.cost,
        avgResponseTime: Math.round(stats.totalResponseTime / Math.max(stats.calls, 1))
      });
    });
  }

  // Calculate breakdown data for pie chart
  const totalTokens = modelUsage.reduce((sum, u) => sum + u.tokens, 0);
  const breakdownData = modelUsage.map(usage => ({
    name: usage.model,
    value: totalTokens > 0 ? Math.round((usage.tokens / totalTokens) * 100) : 0,
    color: getModelColor(usage.model)
  }));

  return {
    usageOverTime,
    modelUsage,
    breakdownData,
    isLoading: usageLoading,
    totalTokens,
    totalCalls: modelUsage.reduce((sum, u) => sum + u.calls, 0),
    totalCost: modelUsage.reduce((sum, u) => sum + u.cost, 0)
  };
};

// Helper function to assign colors to models
const getModelColor = (model: string): string => {
  const colors: Record<string, string> = {
    'gpt-4': '#0ca5e9',
    'gpt-3.5': '#7cd4fd',
    'claude': '#0284c7',
    'llama': '#36bffa',
    'unknown': '#9ca3af'
  };
  
  const modelKey = Object.keys(colors).find(key => 
    model.toLowerCase().includes(key.toLowerCase())
  );
  
  return colors[modelKey || 'unknown'];
};
