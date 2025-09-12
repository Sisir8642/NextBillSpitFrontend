'use client'
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CgSpinner } from 'react-icons/cg';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function LoginPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setIsSubmitting(true);

  try {
    await login(username, password);

    // Get token from query params (e.g. /login?next=/accept-invite/TOKEN)
    const params = new URLSearchParams(window.location.search);
    const nextUrl = params.get("next");

    if (nextUrl) {
      router.push(nextUrl); // Redirect to accept-invite page
    } else {
      router.push("/Dashboard");
    }

  } catch (error: any) {
    setError(error.message || "Error occurred !!");
  } finally {
    setIsSubmitting(false);
  }
};


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <CgSpinner className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2 text-gray-700 dark:text-gray-300">Loading authentication...</span>
      </div>
    );
  }

  // if (isAuthenticated) return null;

  return (
    <div className="flex items-center justify-center min-h-screen dark:bg-[#151519]">
      <Card className="w-full max-w-md p-6 shadow-md bg-[#212128] h-100">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center pt-5">Login</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="user@gmail.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <CgSpinner className="animate-spin h-5 w-5 mr-2" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
