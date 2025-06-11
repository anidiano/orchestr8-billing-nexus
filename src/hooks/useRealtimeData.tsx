
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UseRealtimeDataOptions {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  onUpdate?: () => void;
}

export const useRealtimeData = ({ table, event = '*', onUpdate }: UseRealtimeDataOptions) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!user) return;

    setIsListening(true);
    
    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        'postgres_changes' as any,
        {
          event,
          schema: 'public',
          table,
          filter: `user_id=eq.${user.id}`
        },
        (payload: any) => {
          console.log(`Realtime update on ${table}:`, payload);
          
          // Show toast notification for important events
          if (table === 'invocations' && payload.eventType === 'INSERT') {
            toast({
              title: "New orchestration started",
              description: "Your orchestration is now running.",
            });
          }
          
          if (table === 'invocations' && payload.eventType === 'UPDATE' && payload.new?.status === 'success') {
            toast({
              title: "Orchestration completed",
              description: "Your orchestration finished successfully.",
            });
          }
          
          if (table === 'invocations' && payload.eventType === 'UPDATE' && payload.new?.status === 'failed') {
            toast({
              title: "Orchestration failed",
              description: payload.new?.error_message || "Your orchestration encountered an error.",
              variant: "destructive"
            });
          }
          
          // Call the update callback
          if (onUpdate) {
            onUpdate();
          }
        }
      )
      .subscribe();

    return () => {
      setIsListening(false);
      supabase.removeChannel(channel);
    };
  }, [user, table, event, onUpdate, toast]);

  return { isListening };
};
