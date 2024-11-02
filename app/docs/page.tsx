import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Key, Lock, RefreshCw } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Documentation</h1>
          <p className="text-xl text-gray-600">
            Learn how to integrate our OAuth 2.0 Identity Provider with your application
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="authorization">Authorization</TabsTrigger>
            <TabsTrigger value="token">Token Exchange</TabsTrigger>
            <TabsTrigger value="refresh">Refresh Token</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>OAuth 2.0 Overview</CardTitle>
                <CardDescription>
                  Understanding the OAuth 2.0 Authorization Code Flow
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Our Identity Provider implements the OAuth 2.0 Authorization Code Flow,
                  which is the most secure way to obtain access tokens for your application.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start space-x-3">
                    <Lock className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Secure by Design</h3>
                      <p className="text-sm text-gray-600">
                        Built with security best practices and modern authentication patterns
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Code2 className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Easy Integration</h3>
                      <p className="text-sm text-gray-600">
                        Standard OAuth 2.0 endpoints and flows for simple implementation
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="authorization">
            <Card>
              <CardHeader>
                <CardTitle>Authorization Endpoint</CardTitle>
                <CardDescription>
                  How to request authorization from users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-semibold">Endpoint</h3>
                <code className="block bg-gray-100 p-4 rounded-md">
                  GET /api/oauth/authorize
                </code>

                <h3 className="font-semibold mt-6">Required Parameters</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li><code>client_id</code> - Your application&apos;s client ID</li>
                  <li><code>redirect_uri</code> - URL to return to after authorization</li>
                  <li><code>state</code> - Random string to prevent CSRF attacks</li>
                  <li><code>scope</code> - Space-separated list of requested permissions</li>
                </ul>

                <h3 className="font-semibold mt-6">Example Request</h3>
                <code className="block bg-gray-100 p-4 rounded-md break-all">
                  /api/oauth/authorize?client_id=your_client_id&redirect_uri=https://your-app.com/callback&state=random_state&scope=read write
                </code>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="token">
            <Card>
              <CardHeader>
                <CardTitle>Token Endpoint</CardTitle>
                <CardDescription>
                  Exchange authorization code for access tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-semibold">Endpoint</h3>
                <code className="block bg-gray-100 p-4 rounded-md">
                  POST /api/oauth/token
                </code>

                <h3 className="font-semibold mt-6">Required Parameters</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li><code>grant_type</code> - Must be &quot;authorization_code&quot;</li>
                  <li><code>code</code> - The authorization code received</li>
                  <li><code>redirect_uri</code> - Same URL used in authorization request</li>
                  <li><code>client_id</code> - Your application&apos;s client ID</li>
                  <li><code>client_secret</code> - Your application&apos;s client secret</li>
                </ul>

                <h3 className="font-semibold mt-6">Example Response</h3>
                <code className="block bg-gray-100 p-4 rounded-md">
                  {JSON.stringify({
                    access_token: "eyJ0eXAi...",
                    token_type: "Bearer",
                    expires_in: 3600,
                    refresh_token: "eyJ0eXAi...",
                    scope: "read write"
                  }, null, 2)}
                </code>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="refresh">
            <Card>
              <CardHeader>
                <CardTitle>Refresh Token Flow</CardTitle>
                <CardDescription>
                  How to refresh expired access tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 mb-6">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  <p className="text-sm text-gray-600">
                    Use refresh tokens to obtain new access tokens without requiring user interaction
                  </p>
                </div>

                <h3 className="font-semibold">Endpoint</h3>
                <code className="block bg-gray-100 p-4 rounded-md">
                  POST /api/oauth/token
                </code>

                <h3 className="font-semibold mt-6">Required Parameters</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li><code>grant_type</code> - Must be &quot;refresh_token&quot;</li>
                  <li><code>refresh_token</code> - The refresh token</li>
                  <li><code>client_id</code> - Your application&apos;s client ID</li>
                  <li><code>client_secret</code> - Your application&apos;s client secret</li>
                </ul>

                <h3 className="font-semibold mt-6">Security Considerations</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                  <li>Store refresh tokens securely</li>
                  <li>Implement token rotation</li>
                  <li>Use HTTPS for all requests</li>
                  <li>Validate tokens on every use</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}