
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="w-full py-6 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <svg 
              viewBox="0 0 24 24" 
              className="h-8 w-8 text-orchestr8-500"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            <span className="ml-2 text-2xl font-bold">Orchestr8</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium hover:text-orchestr8-500 transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium hover:text-orchestr8-500 transition-colors">Pricing</a>
            <a href="#docs" className="text-sm font-medium hover:text-orchestr8-500 transition-colors">Documentation</a>
            <Link to="/dashboard">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/dashboard">
              <Button>Get Started</Button>
            </Link>
          </nav>
          <Button className="md:hidden" variant="ghost">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-b from-muted to-background">
          <div className="absolute inset-0 grid-background opacity-[0.2] dark:opacity-[0.05]"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                Enterprise-Grade Billing for <span className="text-orchestr8-500">AI Platforms</span>
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-muted-foreground">
                Orchestr8 helps AI startups track usage, apply pricing rules, and generate invoices with enterprise reliability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/dashboard">
                  <Button size="lg" className="px-8 py-6 text-lg">
                    Start Free Trial
                  </Button>
                </Link>
                <a href="#features">
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                    View Features
                  </Button>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-16 max-w-5xl mx-auto px-4">
            <div className="relative rounded-lg border bg-card p-2 shadow-lg">
              <div className="flex items-center border-b p-2">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="mx-auto text-sm font-medium">Orchestr8 Dashboard</div>
              </div>
              <div className="rounded-b-lg bg-muted p-4 h-[300px] flex items-center justify-center">
                <div className="text-center bg-card p-6 rounded-lg shadow-md">
                  <p className="text-lg font-medium mb-2">Live Dashboard Preview</p>
                  <p className="text-muted-foreground">Visualize your AI platform usage and costs</p>
                  <Link to="/dashboard" className="mt-4 inline-block">
                    <Button variant="secondary">
                      View Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Enterprise Features</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to monitor, bill, and scale your AI services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-card rounded-lg p-6 shadow-md">
                <div className="h-12 w-12 rounded-lg bg-orchestr8-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-orchestr8-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Usage Tracking</h3>
                <p className="text-muted-foreground mb-4">
                  Track tokens, GPU-seconds, and API calls across OpenAI, Anthropic, and more.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Real-time tracking
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Multi-provider support
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Customizable metrics
                  </li>
                </ul>
              </div>

              {/* Feature 2 */}
              <div className="bg-card rounded-lg p-6 shadow-md">
                <div className="h-12 w-12 rounded-lg bg-orchestr8-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-orchestr8-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Dynamic Pricing</h3>
                <p className="text-muted-foreground mb-4">
                  Configure tiered, volume-based, and customer-specific pricing rules.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Tiered pricing
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Volume discounts
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Custom contracts
                  </li>
                </ul>
              </div>

              {/* Feature 3 */}
              <div className="bg-card rounded-lg p-6 shadow-md">
                <div className="h-12 w-12 rounded-lg bg-orchestr8-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-orchestr8-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Automated Invoicing</h3>
                <p className="text-muted-foreground mb-4">
                  Generate and send professional invoices with Stripe integration.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Stripe integration
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    PDF generation
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Automated reminders
                  </li>
                </ul>
              </div>

              {/* Feature 4 */}
              <div className="bg-card rounded-lg p-6 shadow-md">
                <div className="h-12 w-12 rounded-lg bg-orchestr8-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-orchestr8-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
                <p className="text-muted-foreground mb-4">
                  SOC 2 compliance and industry-standard security practices.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    SOC 2 compliant
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Data encryption
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Role-based access
                  </li>
                </ul>
              </div>

              {/* Feature 5 */}
              <div className="bg-card rounded-lg p-6 shadow-md">
                <div className="h-12 w-12 rounded-lg bg-orchestr8-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-orchestr8-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Multi-Provider Support</h3>
                <p className="text-muted-foreground mb-4">
                  Integrate with popular AI and vector database providers.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    OpenAI & Anthropic
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Pinecone & Weaviate
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Custom providers
                  </li>
                </ul>
              </div>

              {/* Feature 6 */}
              <div className="bg-card rounded-lg p-6 shadow-md">
                <div className="h-12 w-12 rounded-lg bg-orchestr8-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-orchestr8-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Developer APIs</h3>
                <p className="text-muted-foreground mb-4">
                  REST and GraphQL APIs with comprehensive documentation.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    REST & GraphQL
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    SDK libraries
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Webhook events
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Pay as you grow with our straightforward pricing plans.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Starter Plan */}
              <div className="bg-card rounded-lg shadow-md overflow-hidden border border-border hover:border-orchestr8-300 transition-colors duration-300">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Starter</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">$299</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Perfect for early-stage startups processing up to 10M tokens per month.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Up to 10M tokens/month</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Basic invoice templates</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Standard reports</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Email support</span>
                    </li>
                  </ul>
                  <Link to="/dashboard">
                    <Button className="w-full" variant="outline">
                      Start Free Trial
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Growth Plan */}
              <div className="bg-card rounded-lg shadow-xl overflow-hidden border-2 border-orchestr8-500 relative transform hover:scale-105 transition-transform duration-300">
                <div className="absolute top-0 left-0 right-0 bg-orchestr8-500 text-white text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
                <div className="p-6 pt-8">
                  <h3 className="text-xl font-semibold mb-2">Growth</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">$999</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    For scaling companies processing up to 50M tokens per month.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Up to 50M tokens/month</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Custom invoice templates</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Advanced analytics</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Priority support</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Multi-provider support</span>
                    </li>
                  </ul>
                  <Link to="/dashboard">
                    <Button className="w-full">
                      Start Free Trial
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-card rounded-lg shadow-md overflow-hidden border border-border hover:border-orchestr8-300 transition-colors duration-300">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">Custom</span>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    For large organizations with custom requirements and high volume.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Unlimited tokens</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>White-labeled invoices</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Custom integrations</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Dedicated account manager</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>24/7 premium support</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Custom SLAs</span>
                    </li>
                  </ul>
                  <Button className="w-full" variant="secondary">
                    Contact Sales
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-orchestr8-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to start monitoring your AI usage?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-orchestr8-100">
              Join hundreds of AI companies using Orchestr8 to streamline their billing operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" variant="secondary" className="px-8 py-6 text-lg">
                  Start Free Trial
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-white text-white hover:bg-white hover:text-orchestr8-600">
                Schedule Demo
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-orchestr8-500">Features</a></li>
                <li><a href="#" className="hover:text-orchestr8-500">Pricing</a></li>
                <li><a href="#" className="hover:text-orchestr8-500">Roadmap</a></li>
                <li><a href="#" className="hover:text-orchestr8-500">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-orchestr8-500">Documentation</a></li>
                <li><a href="#" className="hover:text-orchestr8-500">API Reference</a></li>
                <li><a href="#" className="hover:text-orchestr8-500">SDKs</a></li>
                <li><a href="#" className="hover:text-orchestr8-500">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-orchestr8-500">About</a></li>
                <li><a href="#" className="hover:text-orchestr8-500">Blog</a></li>
                <li><a href="#" className="hover:text-orchestr8-500">Careers</a></li>
                <li><a href="#" className="hover:text-orchestr8-500">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-orchestr8-500">Terms of Service</a></li>
                <li><a href="#" className="hover:text-orchestr8-500">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-orchestr8-500">Security</a></li>
                <li><a href="#" className="hover:text-orchestr8-500">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Orchestr8, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
