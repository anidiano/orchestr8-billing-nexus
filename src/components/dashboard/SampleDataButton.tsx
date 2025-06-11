
import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Database, Loader2 } from 'lucide-react';
import { useState } from 'react';

const SampleDataButton: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const createSampleData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Create sample orchestrations
      const { data: orchestrations, error: orchestrationsError } = await supabase
        .from('orchestrations')
        .insert([
          {
            user_id: user.id,
            name: 'Content Generation Pipeline',
            description: 'AI-powered content creation workflow',
            status: 'active'
          },
          {
            user_id: user.id,
            name: 'Data Analysis Bot',
            description: 'Automated data processing and insights',
            status: 'active'
          },
          {
            user_id: user.id,
            name: 'Customer Support Assistant',
            description: 'AI chatbot for customer inquiries',
            status: 'paused'
          }
        ])
        .select();

      if (orchestrationsError) throw orchestrationsError;

      // Create sample invocations
      if (orchestrations && orchestrations.length > 0) {
        const { error: invocationsError } = await supabase
          .from('invocations')
          .insert([
            {
              user_id: user.id,
              orchestration_id: orchestrations[0].id,
              status: 'success',
              duration_ms: 2500,
              output_data: { result: 'Content generated successfully' }
            },
            {
              user_id: user.id,
              orchestration_id: orchestrations[1].id,
              status: 'success',
              duration_ms: 1800,
              output_data: { analysis: 'Data processed' }
            },
            {
              user_id: user.id,
              orchestration_id: orchestrations[0].id,
              status: 'failed',
              error_message: 'Rate limit exceeded',
              duration_ms: 500
            }
          ]);

        if (invocationsError) throw invocationsError;
      }

      // Create sample usage logs for the past few hours
      const now = new Date();
      const usageLogs = [];
      
      for (let i = 5; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
        usageLogs.push({
          user_id: user.id,
          timestamp: timestamp.toISOString(),
          calls_per_hour: Math.floor(Math.random() * 50) + 10,
          successful_calls: Math.floor(Math.random() * 45) + 8,
          failed_calls: Math.floor(Math.random() * 5),
          tokens_input: Math.floor(Math.random() * 10000) + 1000,
          tokens_output: Math.floor(Math.random() * 5000) + 500,
          model: ['gpt-4', 'claude-3-opus', 'gpt-3.5-turbo'][Math.floor(Math.random() * 3)]
        });
      }

      const { error: usageError } = await supabase
        .from('usage_logs')
        .insert(usageLogs);

      if (usageError) throw usageError;

      // Update billing with some usage
      await supabase.rpc('increment_usage', {
        p_user_id: user.id,
        p_success: true,
        p_tokens_input: 5000,
        p_tokens_output: 2500,
        p_model: 'gpt-4'
      });

      toast({
        title: "Sample data created",
        description: "Your dashboard now has sample orchestrations, invocations, and usage data!",
      });

    } catch (error) {
      console.error('Error creating sample data:', error);
      toast({
        title: "Error creating sample data",
        description: "Could not create sample data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={createSampleData}
      variant="outline"
      size="sm"
      className="ml-2"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating...
        </>
      ) : (
        <>
          <Database className="mr-2 h-4 w-4" />
          Add Sample Data
        </>
      )}
    </Button>
  );
};

export default SampleDataButton;
