
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { useRealtimeMetrics } from '@/hooks/useRealtimeMetrics';
import { DashboardFlow } from '@/components/dashboard/DashboardFlow';
import Navbar from '@/components/Navbar';
import MetricsCards from '@/components/dashboard/MetricsCards';
import RecentActivity from '@/components/dashboard/RecentActivity';
import UsageChart from '@/components/dashboard/UsageChart';
import RealtimeIndicator from '@/components/dashboard/RealtimeIndicator';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: metrics, isLoading, error } = useDashboardMetrics();
  const { isListening } = useRealtimeMetrics();

  if (!user) {
    return <div>Please sign in to access the dashboard</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-muted-foreground">Loading dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-500">Error loading dashboard data</div>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return <DashboardFlow />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of your API usage and performance.
            </p>
          </div>
          <RealtimeIndicator isConnected={isListening} />
        </div>

        <MetricsCards metrics={metrics} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UsageChart />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
