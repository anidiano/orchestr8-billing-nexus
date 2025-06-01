
import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const TestRealtimeButton: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const simulateOrchestrationRun = async () => {
    if (!user) return;

    try {
      // First create an orchestration
      const { data: orchestration, error: orchestrationError } = await supabase
        .from('orchestrations')
        .insert({
          user_id: user.id,
          name: `Test Orchestration ${Date.now()}`,
          description: 'Simulated orchestration for testing realtime updates',
          status: 'active'
        })
        .select()
        .single();

      if (orchestrationError) throw orchestrationError;

      // Create an invocation in progress
      const { data: invocation, error: invocationError } = await supabase
        .from('invocations')
        .insert({
          user_id: user.id,
          orchestration_id: orchestration.id,
          status: 'in_progress'
        })
        .select()
        .single();

      if (invocationError) throw invocationError;

      // Simulate completion after 3 seconds
      setTimeout(async () => {
        await supabase
          .from('invocations')
          .update({
            status: 'success',
            duration_ms: 2500,
            output_data: { result: 'Simulation completed successfully' }
          })
          .eq('id', invocation.id);

        // Update usage logs
        await supabase.rpc('increment_usage', {
          p_user_id: user.id,
          p_success: true,
          p_tokens_input: 100,
          p_tokens_output: 50,
          p_model: 'gpt-4'
        });
      }, 3000);

      toast({
        title: "Simulation started",
        description: "Watch for realtime updates in the dashboard!",
      });

    } catch (error) {
      console.error('Error simulating orchestration:', error);
      toast({
        title: "Simulation failed",
        description: "Could not start simulation",
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      onClick={simulateOrchestrationRun}
      variant="outline"
      size="sm"
      className="ml-2"
    >
      Test Realtime 🧪
    </Button>
  );
};

export default TestRealtimeButton;
