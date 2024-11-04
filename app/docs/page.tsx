import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Key, Lock, RefreshCw } from "lucide-react";

export default function DocsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">OAuth2.0 PKCE Flow Documentation</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Authorization Request</h2>
        <p className="mb-4">Send users to the authorization endpoint:</p>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
          {`GET /api/oauth/authorize?
  response_type=code
  &redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_REDIRECT_URI || '')}
  &code_challenge={CODE_CHALLENGE}
  &code_challenge_method=S256
  &scope=read write`}
        </pre>
        <p className="mt-4">Parameters:</p>
        <ul className="list-disc ml-6">
          <li><code>response_type</code>: Must be &quot;code&quot;</li>
          <li><code>redirect_uri</code>: Your application&apos;s callback URL</li>
          <li><code>code_challenge</code>: SHA256 hash of the code_verifier, base64url encoded</li>
          <li><code>code_challenge_method</code>: Must be &quot;S256&quot;</li>
          <li><code>scope</code>: Space-separated list of requested permissions</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Token Request</h2>
        <p className="mb-4">Exchange the authorization code for tokens:</p>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
          {`POST /api/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code={AUTHORIZATION_CODE}
&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_REDIRECT_URI || '')}
&code_verifier={CODE_VERIFIER}`}
        </pre>
        <p className="mt-4">Parameters:</p>
        <ul className="list-disc ml-6">
          <li><code>grant_type</code>: Must be &quot;authorization_code&quot;</li>
          <li><code>code</code>: The authorization code received from the authorize endpoint</li>
          <li><code>redirect_uri</code>: Must match the redirect_uri used in the authorization request</li>
          <li><code>code_verifier</code>: The original random string used to generate the code_challenge</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Refresh Token</h2>
        <p className="mb-4">Get a new access token using a refresh token:</p>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
          {`POST /api/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token
&refresh_token={REFRESH_TOKEN}`}
        </pre>
        <p className="mt-4">Parameters:</p>
        <ul className="list-disc ml-6">
          <li><code>grant_type</code>: Must be &quot;refresh_token&quot;</li>
          <li><code>refresh_token</code>: The refresh token received from a previous token request</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Response Format</h2>
        <p className="mb-4">Successful token responses will return:</p>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
          {`{
  "access_token": "...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "...",
  "scope": "read write"
}`}
        </pre>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Error Responses</h2>
        <p className="mb-4">Error responses will return:</p>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
          {`{
  "error": "error_code",
  "error_description": "A description of what went wrong"
}`}
        </pre>
        <p className="mt-4">Common error codes:</p>
        <ul className="list-disc ml-6">
          <li><code>invalid_request</code>: Missing or invalid parameters</li>
          <li><code>invalid_grant</code>: Invalid authorization code or refresh token</li>
          <li><code>unsupported_grant_type</code>: Invalid grant_type parameter</li>
          <li><code>server_error</code>: Internal server error</li>
        </ul>
      </section>
    </main>
  );
}