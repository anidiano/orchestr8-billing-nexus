
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useDashboardMetrics = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboardMetrics', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Fetch dashboard metrics from the view
      const { data: dashboardData, error: dashboardError } = await supabase
        .from('dashboard_metrics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (dashboardError && dashboardError.code !== 'PGRST116') {
        throw dashboardError;
      }

      // Fetch recent usage for additional metrics
      const { data: recentUsage, error: usageError } = await supabase
        .from('usage_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('timestamp', { ascending: false });

      if (usageError) throw usageError;

      // Calculate metrics
      const totalTokensMonth = recentUsage?.reduce((sum, log) => 
        sum + log.tokens_input + log.tokens_output, 0) || 0;
      
      const totalCallsMonth = recentUsage?.reduce((sum, log) => 
        sum + log.calls_per_hour, 0) || 0;

      return {
        monthlyRevenue: `$${((dashboardData?.credits_used || 0) * 0.01).toFixed(2)}`,
        apiCalls: totalCallsMonth.toLocaleString(),
        tokenUsage: totalTokensMonth.toLocaleString(),
        activeCustomers: "1", // Single user for now
        successRate: `${(dashboardData?.success_rate || 100).toFixed(1)}%`,
        totalInvocationsMonth: dashboardData?.total_invocations_month || 0,
        activeOrchestrations: dashboardData?.active_orchestrations || 0,
        currentPlan: dashboardData?.current_plan || 'free',
        creditsUsed: dashboardData?.credits_used || 0,
        creditsAllowed: dashboardData?.credits_allowed || 1000
      };
    },
    enabled: !!user,
    refetchInterval: 30000 // Refetch every 30 seconds
  });
};
