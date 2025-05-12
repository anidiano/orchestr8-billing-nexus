
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityItem {
  id: string;
  type: 'invoice' | 'usage' | 'alert';
  description: string;
  timestamp: string;
}

const activityItems: ActivityItem[] = [
  {
    id: '1',
    type: 'invoice',
    description: 'Invoice #12345 generated for $1,245.00',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    type: 'usage',
    description: 'Usage spike detected: 200K tokens in 5 minutes',
    timestamp: '4 hours ago',
  },
  {
    id: '3',
    type: 'alert',
    description: 'Monthly budget threshold (80%) reached',
    timestamp: '1 day ago',
  },
  {
    id: '4',
    type: 'invoice',
    description: 'Customer Acme Corp paid invoice #12344',
    timestamp: '2 days ago',
  },
  {
    id: '5',
    type: 'usage',
    description: 'New API key created for Production environment',
    timestamp: '3 days ago',
  },
];

const ActivityIcon: React.FC<{ type: ActivityItem['type'] }> = ({ type }) => {
  switch (type) {
    case 'invoice':
      return <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
        <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>;
    case 'usage':
      return <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
        <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      </div>;
    case 'alert':
      return <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
        <svg className="h-4 w-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>;
    default:
      return null;
  }
};

const RecentActivity: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest events and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {activityItems.map((item) => (
            <div key={item.id} className="flex items-start">
              <ActivityIcon type={item.type} />
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{item.description}</p>
                <p className="text-sm text-muted-foreground">{item.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
