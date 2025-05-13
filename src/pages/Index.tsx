
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const Index = () => {
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
                  <Link to="/dashboard" className="flex items-center">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="px-6 py-6 text-lg">
                  <Link to="/#features">Learn More</Link>
                </Button>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">Trusted by innovative companies worldwide</p>
                <div className="flex flex-wrap gap-6 items-center opacity-70">
                  <div className="h-8 font-bold text-xl text-orchestr8-800">ACME Inc</div>
                  <div className="h-8 font-bold text-xl text-orchestr8-800">TechGiant</div>
                  <div className="h-8 font-bold text-xl text-orchestr8-800">AIVentures</div>
                  <div className="h-8 font-bold text-xl text-orchestr8-800">DataFlow</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-orchestr8-300 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-orchestr8-500 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-1 shadow-2xl animate-float">
                <AspectRatio ratio={16/10} className="bg-gradient-to-br from-orchestr8-500/80 to-orchestr8-700 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-4/5 bg-white/90 rounded-lg mx-6 shadow-lg grid grid-cols-3 gap-3 p-3">
                      <div className="col-span-2 bg-orchestr8-50 rounded-md animate-pulse-slow"></div>
                      <div className="bg-orchestr8-50 rounded-md"></div>
                      <div className="col-span-1 bg-orchestr8-50 rounded-md"></div>
                      <div className="col-span-2 bg-orchestr8-50 rounded-md"></div>
                      <div className="col-span-3 bg-orchestr8-50 rounded-md h-24"></div>
                    </div>
                  </div>
                </AspectRatio>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section id="features" className="py-20 bg-orchestr8-50/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why Choose Orchestr8?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "One-Click Orchestration",
                description: "Connect and manage all your AI models through a single unified interface without complex integrations.",
                icon: <div className="w-12 h-12 bg-orchestr8-100 rounded-full flex items-center justify-center text-orchestr8-600 mb-6">1</div>
              },
              {
                title: "Real-Time Analytics",
                description: "Get instant insights into your AI operations with comprehensive dashboards and monitoring tools.",
                icon: <div className="w-12 h-12 bg-orchestr8-100 rounded-full flex items-center justify-center text-orchestr8-600 mb-6">2</div>
              },
              {
                title: "Simplified Billing",
                description: "Track costs across all AI services with transparent pricing and consolidated invoicing.",
                icon: <div className="w-12 h-12 bg-orchestr8-100 rounded-full flex items-center justify-center text-orchestr8-600 mb-6">3</div>
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
                {feature.icon}
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "Orchestr8 has transformed how we manage our AI infrastructure. The cost savings and efficiency gains have been substantial.",
                author: "Sarah Chen",
                role: "CTO, AIVentures"
              },
              {
                quote: "The analytics provided by Orchestr8 gave us insights we never had before. Our model performance improved by 32% in two months.",
                author: "Michael Rodriguez",
                role: "AI Engineer, DataFlow"
              },
              {
                quote: "The simplified billing alone was worth the switch. No more surprises at the end of the month from our AI providers.",
                author: "Jessica Kim",
                role: "Finance Director, TechGiant"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-background p-8 rounded-xl shadow-sm border border-border hover:border-orchestr8-300 transition-colors">
                <div className="flex mb-6">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                    </svg>
                  ))}
                </div>
                <p className="italic mb-6">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
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
            <Link to="/dashboard">Get Started Today</Link>
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
              <Link to="/dashboard" className="hover:text-orchestr8-600 transition-colors">Dashboard</Link>
              <Link to="/usage" className="hover:text-orchestr8-600 transition-colors">Usage</Link>
              <Link to="/billing" className="hover:text-orchestr8-600 transition-colors">Billing</Link>
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
