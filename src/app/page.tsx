'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, FileText, ClipboardList, Receipt } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    router.push('/dashboard');
    return <LoadingScreen />;
  }

  const handleGetStarted = () => {
    router.push('/auth/signin');
  };

  const features = [
    {
      icon: Building2,
      title: 'Project Management',
      description: 'Manage your projects efficiently with our comprehensive tools'
    },
    {
      icon: FileText,
      title: 'Document Control',
      description: 'Keep all your documents organized and easily accessible'
    },
    {
      icon: ClipboardList,
      title: 'Task Tracking',
      description: 'Track tasks and deadlines with our intuitive interface'
    },
    {
      icon: Receipt,
      title: 'Financial Management',
      description: 'Monitor budgets and expenses in real-time'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-5xl font-bold mb-6">Welcome to Project Manager</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your all-in-one solution for efficient project management. Streamline your workflow, collaborate with your team, and achieve your goals.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={handleGetStarted}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of teams who are already using our platform to manage their projects effectively.
          </p>
          <Button size="lg" onClick={handleGetStarted}>
            Sign Up Now - It's Free
          </Button>
        </div>
      </section>
    </div>
  );
}
