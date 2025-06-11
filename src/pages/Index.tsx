
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, loading } = useAuth();

  // If user is authenticated, redirect to dashboard
  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orchestr8-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-br from-background via-background to-orchestr8-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orchestr8-600 to-orchestr8-800">
                  Orchestrate Your AI Models with Ease
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground">
                  Monitor, manage, and optimize all your AI services in one powerful dashboard.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-orchestr8-600 hover:bg-orchestr8-700 text-white font-medium px-6 py-6 text-lg rounded-md">
                  <Link to="/auth" className="flex items-center">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="px-6 py-6 text-lg">
                  <Link to="/#features">Learn More</Link>
                </Button>
              </div>

              {/* Trusted by companies */}
              <div className="pt-8">
                <p className="text-sm text-muted-foreground mb-4">Trusted by innovative companies worldwide</p>
                <div className="flex items-center space-x-8 opacity-60">
                  <div className="text-2xl font-bold text-muted-foreground">TechCorp</div>
                  <div className="text-2xl font-bold text-muted-foreground">AI Solutions</div>
                  <div className="text-2xl font-bold text-muted-foreground">DataFlow</div>
                </div>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative">
              <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orchestr8-100 to-orchestr8-200 flex items-center justify-center">
                  <div className="text-6xl text-orchestr8-400">📊</div>
                </div>
              </AspectRatio>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to manage AI at scale</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From monitoring to optimization, Orchestr8 provides all the tools you need to run AI operations efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🔍",
                title: "Real-time Monitoring",
                description: "Track your AI models' performance, usage, and costs in real-time with comprehensive dashboards."
              },
              {
                icon: "⚡",
                title: "Smart Optimization",
                description: "Automatically optimize your AI workflows for better performance and cost efficiency."
              },
              {
                icon: "🔒",
                title: "Enterprise Security",
                description: "Bank-grade security with role-based access control and comprehensive audit logs."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-background p-8 rounded-lg shadow-sm border">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">What our customers say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "Orchestr8 transformed how we manage our AI infrastructure. The real-time monitoring is game-changing.",
                author: "Sarah Chen",
                title: "CTO, TechStart"
              },
              {
                quote: "The cost optimization features alone have saved us 40% on our AI operations budget.",
                author: "Michael Rodriguez",
                title: "Head of AI, DataCorp"
              },
              {
                quote: "Finally, a platform that understands the complexity of enterprise AI operations.",
                author: "Jennifer Kim",
                title: "AI Director, FinanceFlow"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-muted/30 p-6 rounded-lg">
                <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orchestr8-200 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-orchestr8-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to orchestrate your AI ecosystem?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of companies optimizing their AI operations with Orchestr8.</p>
          <Button size="lg" variant="secondary" className="px-8 py-6 text-lg hover:bg-white">
            <Link to="/auth">Get Started Today</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-orchestr8-600">Orchestr8</h2>
              <p className="text-muted-foreground">Simplifying AI operations</p>
            </div>
            <div className="flex gap-8">
              <Link to="/auth" className="hover:text-orchestr8-600 transition-colors">Sign In</Link>
              <a href="#features" className="hover:text-orchestr8-600 transition-colors">Features</a>
              <a href="#" className="hover:text-orchestr8-600 transition-colors">Docs</a>
              <a href="#" className="hover:text-orchestr8-600 transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground text-sm">
            <p>© {new Date().getFullYear()} Orchestr8, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
