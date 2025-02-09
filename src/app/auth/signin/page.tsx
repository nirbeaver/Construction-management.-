'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useRouter } from 'next/navigation';
import { Chrome } from 'lucide-react';

export default function SignIn() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    router.push('/dashboard');
    return <LoadingScreen />;
  }

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to access your projects and continue your work
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full py-6 text-base"
            onClick={handleSignIn}
          >
            <Chrome className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 