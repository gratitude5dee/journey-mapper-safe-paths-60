
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Retrieve Vapi secrets from environment variables
    const VAPI_PUBLIC_KEY = Deno.env.get('VAPI_PUBLIC_KEY')
    const VAPI_ASSISTANT_ID = Deno.env.get('VAPI_ASSISTANT_ID')

    // Check if secrets are present
    if (!VAPI_PUBLIC_KEY || !VAPI_ASSISTANT_ID) {
      throw new Error('Vapi configuration is not fully set up')
    }

    // Return the configuration
    return new Response(
      JSON.stringify({
        VAPI_PUBLIC_KEY,
        VAPI_ASSISTANT_ID,
      }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('Error retrieving Vapi configuration:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})
