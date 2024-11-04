import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import * as jose from 'jose';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const grantType = formData.get('grant_type');
    const code = formData.get('code');
    const redirectUri = formData.get('redirect_uri');
    const codeVerifier = formData.get('code_verifier');
    const refreshToken = formData.get('refresh_token');

    console.log('Token request body:', Object.fromEntries(formData.entries()));

    const supabase = createRouteHandlerClient({ cookies }, {
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY
    });
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = 'HS256';

    // 处理授权码模式
    if (grantType === 'authorization_code') {
      // 检查必需的参数
      if (!code || !redirectUri || !codeVerifier) {
        console.error('Missing required parameters:', {
          hasCode: !!code,
          hasRedirectUri: !!redirectUri,
          hasCodeVerifier: !!codeVerifier
        });
        return NextResponse.json(
          { error: 'invalid_request', error_description: 'Missing required parameters' },
          { status: 400 }
        );
      }

      // 验证授权码
      const { data: authCode } = await supabase
        .from('authorization_codes')
        .select('*')
        .eq('code', code)
        .single();

      if (!authCode || new Date(authCode.expires_at) < new Date()) {
        console.error('Invalid or expired authorization code');
        return NextResponse.json(
          { error: 'invalid_grant', error_description: 'Invalid or expired authorization code' },
          { status: 400 }
        );
      }

      // 验证 code_verifier
      if (authCode.code_challenge) {
        const codeChallenge = await calculateCodeChallenge(codeVerifier as string);
        if (codeChallenge !== authCode.code_challenge) {
          console.error('Invalid code verifier');
          return NextResponse.json(
            { error: 'invalid_grant', error_description: 'Invalid code verifier' },
            { status: 400 }
          );
        }
      }

      // 生成访问令牌
      const accessToken = await new jose.SignJWT({
        sub: authCode.user_id,
        scope: authCode.scope,
      })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(secret);

      // 生成刷新令牌
      const newRefreshToken = await new jose.SignJWT({
        sub: authCode.user_id,
        type: 'refresh',
        scope: authCode.scope,
      })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime('30d')
        .sign(secret);

      // 删除已使用的授权码
      await supabase
        .from('authorization_codes')
        .delete()
        .eq('code', code);

      return NextResponse.json({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: newRefreshToken,
        scope: authCode.scope,
      });
    }
    // 处理刷新令牌模式
    else if (grantType === 'refresh_token') {
      if (!refreshToken) {
        return NextResponse.json(
          { error: 'invalid_request', error_description: 'Missing refresh token' },
          { status: 400 }
        );
      }

      try {
        // 验证刷新令牌
        const { payload } = await jose.jwtVerify(refreshToken as string, secret);

        if (payload.type !== 'refresh') {
          throw new Error('Invalid token type');
        }

        // 生成新的访问令牌
        const accessToken = await new jose.SignJWT({
          sub: payload.sub,
          scope: payload.scope,
        })
          .setProtectedHeader({ alg })
          .setIssuedAt()
          .setExpirationTime('1h')
          .sign(secret);

        // 生成新的刷新令牌
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
        console.error('Refresh token verification failed:', error);
        return NextResponse.json(
          { error: 'invalid_grant', error_description: 'Invalid refresh token' },
          { status: 400 }
        );
      }
    }
    // 不支持的授权类型
    else {
      return NextResponse.json(
        { error: 'unsupported_grant_type', error_description: 'Unsupported grant type' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Token endpoint error:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { error: 'server_error', error_description: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 辅助函数：计算 code_challenge
async function calculateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);

  const base64String = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))));
  return base64String
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}