export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      billing: {
        Row: {
          billing_cycle_end: string
          billing_cycle_start: string
          created_at: string
          credits_allowed: number
          credits_used: number
          current_plan: Database["public"]["Enums"]["billing_plan_type"]
          id: string
          payment_status: Database["public"]["Enums"]["payment_status_type"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_cycle_end?: string
          billing_cycle_start?: string
          created_at?: string
          credits_allowed?: number
          credits_used?: number
          current_plan?: Database["public"]["Enums"]["billing_plan_type"]
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status_type"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_cycle_end?: string
          billing_cycle_start?: string
          created_at?: string
          credits_allowed?: number
          credits_used?: number
          current_plan?: Database["public"]["Enums"]["billing_plan_type"]
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status_type"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["user_id"]
          },
        ]
      }
      invocations: {
        Row: {
          created_at: string
          duration_ms: number | null
          error_message: string | null
          id: string
          input_data: Json | null
          orchestration_id: string
          output_data: Json | null
          status: Database["public"]["Enums"]["invocation_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          input_data?: Json | null
          orchestration_id: string
          output_data?: Json | null
          status?: Database["public"]["Enums"]["invocation_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          input_data?: Json | null
          orchestration_id?: string
          output_data?: Json | null
          status?: Database["public"]["Enums"]["invocation_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invocations_orchestration_id_fkey"
            columns: ["orchestration_id"]
            isOneToOne: false
            referencedRelation: "orchestrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invocations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["user_id"]
          },
        ]
      }
      orchestrations: {
        Row: {
          config: Json | null
          created_at: string
          description: string | null
          id: string
          name: string
          status: Database["public"]["Enums"]["orchestration_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: Database["public"]["Enums"]["orchestration_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["orchestration_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orchestrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          language: string | null
          role: string
          timezone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          language?: string | null
          role?: string
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          language?: string | null
          role?: string
          timezone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["user_id"]
          },
        ]
      }
      usage_logs: {
        Row: {
          calls_per_hour: number
          failed_calls: number
          id: string
          model: string | null
          successful_calls: number
          timestamp: string
          tokens_input: number
          tokens_output: number
          user_id: string
        }
        Insert: {
          calls_per_hour?: number
          failed_calls?: number
          id?: string
          model?: string | null
          successful_calls?: number
          timestamp?: string
          tokens_input?: number
          tokens_output?: number
          user_id: string
        }
        Update: {
          calls_per_hour?: number
          failed_calls?: number
          id?: string
          model?: string | null
          successful_calls?: number
          timestamp?: string
          tokens_input?: number
          tokens_output?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "dashboard_metrics"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      dashboard_metrics: {
        Row: {
          active_orchestrations: number | null
          credits_allowed: number | null
          credits_used: number | null
          current_plan: Database["public"]["Enums"]["billing_plan_type"] | null
          success_rate: number | null
          total_invocations_month: number | null
          user_id: string | null
        }
        Insert: {
          active_orchestrations?: never
          credits_allowed?: never
          credits_used?: never
          current_plan?: never
          success_rate?: never
          total_invocations_month?: never
          user_id?: string | null
        }
        Update: {
          active_orchestrations?: never
          credits_allowed?: never
          credits_used?: never
          current_plan?: never
          success_rate?: never
          total_invocations_month?: never
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      increment_usage: {
        Args: {
          p_user_id: string
          p_success?: boolean
          p_tokens_input?: number
          p_tokens_output?: number
          p_model?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      billing_plan_type: "free" | "starter" | "pro" | "enterprise"
      invocation_status: "success" | "failed" | "in_progress" | "timeout"
      orchestration_status: "active" | "paused" | "failed" | "archived"
      payment_status_type: "paid" | "pending" | "failed" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      billing_plan_type: ["free", "starter", "pro", "enterprise"],
      invocation_status: ["success", "failed", "in_progress", "timeout"],
      orchestration_status: ["active", "paused", "failed", "archived"],
      payment_status_type: ["paid", "pending", "failed", "cancelled"],
    },
  },
} as const
