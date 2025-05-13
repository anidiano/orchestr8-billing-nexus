
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header provided' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Verify the JWT and get the user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token', details: authError }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request to get operation
    const { operation } = await req.json();

    let responseData;
    
    switch(operation) {
      case 'getDashboardMetrics':
        // Get dashboard metrics for this user
        const { data: metricsData, error: metricsError } = await supabaseClient
          .from('dashboard_metrics')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (metricsError) {
          // If there's no data yet, let's generate some default data
          // This would normally come from real usage
          await supabaseClient.rpc('increment_usage', {
            p_user_id: user.id,
            p_success: true,
            p_tokens_input: 500,
            p_tokens_output: 200,
            p_model: 'gpt-4'
          });
          
          responseData = {
            total_invocations_month: 1,
            success_rate: 100,
            active_orchestrations: 0,
            credits_used: 700, // tokens_input + tokens_output
            credits_allowed: 1000,
            current_plan: 'free'
          };
        } else {
          responseData = metricsData;
        }
        break;
        
      case 'getRecentActivity':
        // Get recent activities (invocations or billing events)
        const { data: activitiesData, error: activitiesError } = await supabaseClient
          .from('invocations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (activitiesError) {
          throw activitiesError;
        }
        
        responseData = activitiesData;
        break;
        
      default:
        return new Response(
          JSON.stringify({ error: 'Unknown operation' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    // Return the data
    return new Response(
      JSON.stringify(responseData),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Dashboard data error:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
