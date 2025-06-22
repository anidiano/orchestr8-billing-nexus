
export interface ApiProvider {
  id: string;
  user_id: string;
  provider_id: string;
  provider_name: string;
  api_key_encrypted: string;
  base_url?: string;
  custom_headers?: Record<string, string>;
  auth_type: string;
  is_active: boolean;
  status: 'connected' | 'error' | 'untested';
  last_tested_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiCallLog {
  id: string;
  user_id: string;
  provider_id: string;
  endpoint: string;
  method: string;
  model?: string;
  tokens_input: number;
  tokens_output: number;
  total_tokens: number;
  cost_usd: number;
  response_time_ms: number;
  status_code: number;
  success: boolean;
  error_message?: string;
  request_metadata: Record<string, any>;
  response_metadata: Record<string, any>;
  created_at: string;
}

export interface CostAlert {
  id: string;
  user_id: string;
  alert_type: 'daily_limit' | 'monthly_limit' | 'spike_detection';
  threshold_amount: number;
  current_amount: number;
  is_triggered: boolean;
  is_active: boolean;
  last_triggered_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UsageReport {
  id: string;
  user_id: string;
  report_type: 'daily' | 'weekly' | 'monthly';
  start_date: string;
  end_date: string;
  total_calls: number;
  total_tokens: number;
  total_cost: number;
  provider_breakdown: Record<string, any>;
  model_breakdown: Record<string, any>;
  generated_at: string;
}

export interface RealtimeMetrics {
  totalCalls: number;
  totalTokens: number;
  totalCost: number;
  avgResponseTime: number;
  successRate: number;
  activeProviders: number;
  callsPerMinute: number;
  costPerHour: number;
}
