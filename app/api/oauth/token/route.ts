import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import * as jose from 'jose';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const grantType = formData.get('grant_type');
    const clientId = formData.get('client_id');
    const clientSecret = formData.get('client_secret');

    if (!grantType || !clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'invalid_request' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Verify client credentials
    const { data: client } = await supabase
      .from('oauth_clients')
      .select('*')
      .eq('client_id', clientId)
      .eq('client_secret', clientSecret)
      .single();

    if (!client) {
      return NextResponse.json(
        { error: 'invalid_client' },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = 'HS256';

    if (grantType === 'authorization_code') {
      const code = formData.get('code');
      const redirectUri = formData.get('redirect_uri');

      if (!code || !redirectUri) {
        return NextResponse.json(
          { error: 'invalid_request' },
          { status: 400 }
        );
      }

      // Verify authorization code
      const { data: authCode } = await supabase
        .from('authorization_codes')
        .select('*')
        .eq('code', code)
        .eq('client_id', clientId)
        .single();

      if (!authCode || new Date(authCode.expires_at) < new Date()) {
        return NextResponse.json(
          { error: 'invalid_grant' },
          { status: 400 }
        );
      }

      // Generate JWT tokens
      const accessToken = await new jose.SignJWT({
        sub: authCode.user_id,
        scope: authCode.scope,
      })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(secret);

      const refreshToken = await new jose.SignJWT({
        sub: authCode.user_id,
        type: 'refresh',
      })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime('30d')
        .sign(secret);

      // Delete used authorization code
      await supabase
        .from('authorization_codes')
        .delete()
        .eq('code', code);

      return NextResponse.json({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: refreshToken,
        scope: authCode.scope,
      });
    } else if (grantType === 'refresh_token') {
      const refreshToken = formData.get('refresh_token');

      if (!refreshToken) {
        return NextResponse.json(
          { error: 'invalid_request' },
          { status: 400 }
        );
      }

      try {
        // Verify refresh token
        const { payload } = await jose.jwtVerify(
          refreshToken as string,
          secret
        );

        if (payload.type !== 'refresh') {
          throw new Error('Invalid token type');
        }

        // Generate new access token
        const accessToken = await new jose.SignJWT({
          sub: payload.sub,
          scope: payload.scope,
        })
          .setProtectedHeader({ alg })
          .setIssuedAt()
          .setExpirationTime('1h')
          .sign(secret);

        // Generate new refresh token (token rotation)
        const newRefreshToken = await new jose.SignJWT({
          sub: payload.sub,
          type: 'refresh',
          scope: payload.scope,
        })
          .setProtectedHeader({ alg })
          .setIssuedAt()
          .setExpirationTime('30d')
          .sign(secret);

        return NextResponse.json({
          access_token: accessToken,
          token_type: 'Bearer',
          expires_in: 3600,
          refresh_token: newRefreshToken,
          scope: payload.scope,
        });
      } catch (error) {
        return NextResponse.json(
          { error: 'invalid_grant' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'unsupported_grant_type' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Token endpoint error:', error);
    return NextResponse.json(
      { error: 'server_error' },
      { status: 500 }
    );
  }
}