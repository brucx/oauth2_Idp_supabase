import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Shield className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Secure Identity Provider
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A modern OAuth 2.0 identity provider service built with Next.js and Supabase
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>OAuth 2.0</CardTitle>
              <CardDescription>
                Industry-standard protocol for authorization
              </CardDescription>
            </CardHeader>
            <CardContent>
              Implements the Authorization Code flow for secure authentication and authorization.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Secure by Design</CardTitle>
              <CardDescription>
                Built with security best practices
              </CardDescription>
            </CardHeader>
            <CardContent>
              Features PKCE support, secure token handling, and protection against common vulnerabilities.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Easy Integration</CardTitle>
              <CardDescription>
                Simple to integrate with any application
              </CardDescription>
            </CardHeader>
            <CardContent>
              Well-documented endpoints and standard OAuth 2.0 flows make integration straightforward.
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" asChild>
            <a href="/docs">View Documentation</a>
          </Button>
        </div>
      </div>
    </div>
  );
}