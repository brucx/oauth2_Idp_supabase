import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('client_id');
  const redirectUri = searchParams.get('redirect_uri');
  const state = searchParams.get('state');
  const scope = searchParams.get('scope');

  if (!clientId || !redirectUri || !state) {
    return NextResponse.json(
      { error: 'invalid_request' },
      { status: 400 }
    );
  }

  const supabase = createRouteHandlerClient({ cookies });
  
  // Verify client_id exists in our database
  const { data: client } = await supabase
    .from('oauth_clients')
    .select('*')
    .eq('client_id', clientId)
    .single();

  if (!client) {
    return NextResponse.json(
      { error: 'invalid_client' },
      { status: 401 }
    );
  }

  // Verify redirect_uri matches the registered one
  if (client.redirect_uri !== redirectUri) {
    return NextResponse.json(
      { error: 'invalid_redirect_uri' },
      { status: 400 }
    );
  }

  // Generate authorization code
  const code = nanoid(32);
  const { error } = await supabase
    .from('authorization_codes')
    .insert({
      code,
      client_id: clientId,
      redirect_uri: redirectUri,
      scope,
      state,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
    });

  if (error) {
    return NextResponse.json(
      { error: 'server_error' },
      { status: 500 }
    );
  }

  // Redirect to login page with the code
  return NextResponse.redirect(
    new URL(`/login?code=${code}&state=${state}`, request.url)
  );
}