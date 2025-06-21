
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SampleDataButton: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const createSampleData = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create sample data.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    
    try {
      console.log('Starting sample data creation for user:', user.id);

      // 1. Create sample orchestrations with properly typed status
      const orchestrationsData = [
        {
          user_id: user.id,
          name: "Customer Support AI",
          description: "AI-powered customer support automation",
          status: "active" as const,
          config: { model: "gpt-4-turbo", temperature: 0.7 }
        },
        {
          user_id: user.id,
          name: "Content Generator",
          description: "Automated content generation pipeline",
          status: "active" as const,
          config: { model: "claude-3-opus", temperature: 0.5 }
        },
        {
          user_id: user.id,
          name: "Data Analyzer",
          description: "Real-time data analysis orchestration",
          status: "paused" as const,
          config: { model: "gpt-3.5-turbo", temperature: 0.3 }
        }
      ];

      const { data: orchestrations, error: orchestrationsError } = await supabase
        .from('orchestrations')
        .insert(orchestrationsData)
        .select();

      if (orchestrationsError) {
        console.error('Error creating orchestrations:', orchestrationsError);
        throw orchestrationsError;
      }

      console.log('Created orchestrations:', orchestrations);

      // 2. Create sample invocations
      const invocationsData = [];
      orchestrations?.forEach(orch => {
        // Create multiple invocations per orchestration
        for (let i = 0; i < 5; i++) {
          invocationsData.push({
            user_id: user.id,
            orchestration_id: orch.id,
            status: Math.random() > 0.2 ? 'success' as const : 'failed' as const,
            duration_ms: Math.floor(Math.random() * 5000) + 500,
            input_data: { query: `Sample input ${i + 1}` },
            output_data: { result: `Sample output ${i + 1}` },
            error_message: Math.random() > 0.8 ? 'Sample error message' : null
          });
        }
      });

      const { data: invocations, error: invocationsError } = await supabase
        .from('invocations')
        .insert(invocationsData)
        .select();

      if (invocationsError) {
        console.error('Error creating invocations:', invocationsError);
        throw invocationsError;
      }

      console.log('Created invocations:', invocations);

      // 3. Create sample usage logs using the increment_usage function
      for (let hour = 0; hour < 24; hour++) {
        const { error: usageError } = await supabase.rpc('increment_usage', {
          p_user_id: user.id,
          p_success: Math.random() > 0.1,
          p_tokens_input: Math.floor(Math.random() * 1000) + 100,
          p_tokens_output: Math.floor(Math.random() * 800) + 50,
          p_model: ['gpt-4-turbo', 'claude-3-opus', 'gpt-3.5-turbo'][Math.floor(Math.random() * 3)]
        });

        if (usageError) {
          console.error('Error creating usage log:', usageError);
        }
      }

      // 4. Update billing to reflect usage and set to pro plan
      const { error: billingError } = await supabase
        .from('billing')
        .update({
          credits_used: Math.floor(Math.random() * 500) + 100,
          current_plan: 'pro' as const,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (billingError) {
        console.error('Error updating billing:', billingError);
        // Don't throw here, billing update is not critical
      }

      toast({
        title: "Sample data created successfully!",
        description: "Your dashboard now shows sample usage data. Please refresh to see the updates.",
      });

      // Force a page refresh to show new data
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error: any) {
      console.error('Error creating sample data:', error);
      toast({
        title: "Error creating sample data",
        description: error.message || "Please try again or check the console for details.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={createSampleData}
      disabled={isCreating || !user}
      className="gap-2"
    >
      {isCreating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Database className="h-4 w-4" />
      )}
      {isCreating ? 'Creating...' : 'Add Sample Data'}
    </Button>
  );
};

export default SampleDataButton;
