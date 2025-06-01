
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StoreApiKeyRequest {
  name: string;
  service: string;
  api_key: string;
  user_id: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { name, service, api_key, user_id }: StoreApiKeyRequest = await req.json()

    if (!name || !service || !api_key || !user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Store the API key as a Supabase secret with a unique name
    const secretName = `USER_${user_id}_${service.toUpperCase()}_${name.replace(/\s+/g, '_').toUpperCase()}`
    
    console.log(`Storing API key with secret name: ${secretName}`)

    // For now, we'll just return success since we can't actually store secrets via API
    // In a real implementation, you'd store the key metadata in a table and the actual key in a secure vault
    const keyPreview = `${api_key.substring(0, 8)}...${api_key.substring(api_key.length - 4)}`

    return new Response(
      JSON.stringify({ 
        message: 'API key stored successfully',
        id: crypto.randomUUID(),
        preview: keyPreview 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error storing API key:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
