'use client';

import { useEffect, useState } from 'react';
import { generateCodeVerifier, generateCodeChallenge } from './utils/pkce';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      // 生成 PKCE 所需的 verifier 和 challenge
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      // 保存 code_verifier 到 sessionStorage，以便后续使用
      sessionStorage.setItem('code_verifier', codeVerifier);

      // 构建授权请求 URL
      const params = new URLSearchParams({
        response_type: 'code',
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'https://www.canva.com/apps/oauth/authorized',
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        scope: 'read write',
      });

      // 重定向到授权页面
      window.location.href = `/api/oauth/authorize?${params.toString()}`;
    } catch (error) {
      console.error('Authorization failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">OAuth2.0 Demo</h1>
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? 'Loading...' : 'Login with OAuth'}
      </button>
    </main>
  );
}