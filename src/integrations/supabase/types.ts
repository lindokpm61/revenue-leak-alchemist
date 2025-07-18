export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          properties: Json | null
          submission_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          properties?: Json | null
          submission_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          properties?: Json | null
          submission_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_logs: {
        Row: {
          created_at: string
          data_sent: Json | null
          error: string | null
          id: string
          n8n_execution_id: string | null
          results: Json | null
          status: string
          updated_at: string
          workflow_type: string
        }
        Insert: {
          created_at?: string
          data_sent?: Json | null
          error?: string | null
          id?: string
          n8n_execution_id?: string | null
          results?: Json | null
          status?: string
          updated_at?: string
          workflow_type: string
        }
        Update: {
          created_at?: string
          data_sent?: Json | null
          error?: string | null
          id?: string
          n8n_execution_id?: string | null
          results?: Json | null
          status?: string
          updated_at?: string
          workflow_type?: string
        }
        Relationships: []
      }
      crm_persons: {
        Row: {
          created_at: string
          crm_person_id: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          crm_person_id: string
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          crm_person_id?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_engagement_events: {
        Row: {
          campaign_id: string | null
          created_at: string
          email_id: string | null
          engagement_score_delta: number | null
          event_type: string
          id: string
          temp_id: string | null
          timestamp: string
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          email_id?: string | null
          engagement_score_delta?: number | null
          event_type: string
          id?: string
          temp_id?: string | null
          timestamp?: string
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          email_id?: string | null
          engagement_score_delta?: number | null
          event_type?: string
          id?: string
          temp_id?: string | null
          timestamp?: string
        }
        Relationships: []
      }
      email_sequence_queue: {
        Row: {
          clicked_at: string | null
          contact_data: Json | null
          contact_email: string
          conversion_completed_at: string | null
          created_at: string | null
          id: string
          n8n_execution_id: string | null
          opened_at: string | null
          revenue_attributed: number | null
          scheduled_for: string
          sent_at: string | null
          sequence_type: string
          status: string | null
          temp_id: string | null
        }
        Insert: {
          clicked_at?: string | null
          contact_data?: Json | null
          contact_email: string
          conversion_completed_at?: string | null
          created_at?: string | null
          id?: string
          n8n_execution_id?: string | null
          opened_at?: string | null
          revenue_attributed?: number | null
          scheduled_for: string
          sent_at?: string | null
          sequence_type: string
          status?: string | null
          temp_id?: string | null
        }
        Update: {
          clicked_at?: string | null
          contact_data?: Json | null
          contact_email?: string
          conversion_completed_at?: string | null
          created_at?: string | null
          id?: string
          n8n_execution_id?: string | null
          opened_at?: string | null
          revenue_attributed?: number | null
          scheduled_for?: string
          sent_at?: string | null
          sequence_type?: string
          status?: string | null
          temp_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_sequence_queue_temp_id_fkey"
            columns: ["temp_id"]
            isOneToOne: false
            referencedRelation: "temporary_submissions"
            referencedColumns: ["temp_id"]
          },
        ]
      }
      email_sequences: {
        Row: {
          clicked_at: string | null
          created_at: string | null
          email_step: number
          id: string
          opened_at: string | null
          replied_at: string | null
          sent_at: string | null
          sequence_type: string
          smartlead_campaign_id: string | null
          smartlead_prospect_id: string | null
          status: string | null
          submission_id: string | null
        }
        Insert: {
          clicked_at?: string | null
          created_at?: string | null
          email_step: number
          id?: string
          opened_at?: string | null
          replied_at?: string | null
          sent_at?: string | null
          sequence_type: string
          smartlead_campaign_id?: string | null
          smartlead_prospect_id?: string | null
          status?: string | null
          submission_id?: string | null
        }
        Update: {
          clicked_at?: string | null
          created_at?: string | null
          email_step?: number
          id?: string
          opened_at?: string | null
          replied_at?: string | null
          sent_at?: string | null
          sequence_type?: string
          smartlead_campaign_id?: string | null
          smartlead_prospect_id?: string | null
          status?: string | null
          submission_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_sequences_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      experiment_assignments: {
        Row: {
          assigned_at: string
          experiment_id: string
          id: string
          user_identifier: string
          variant_id: string
        }
        Insert: {
          assigned_at?: string
          experiment_id: string
          id?: string
          user_identifier: string
          variant_id: string
        }
        Update: {
          assigned_at?: string
          experiment_id?: string
          id?: string
          user_identifier?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiment_assignments_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "experiments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "experiment_assignments_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "experiment_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      experiment_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          experiment_id: string
          id: string
          user_identifier: string
          value: number | null
          variant_id: string
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          experiment_id: string
          id?: string
          user_identifier: string
          value?: number | null
          variant_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          experiment_id?: string
          id?: string
          user_identifier?: string
          value?: number | null
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiment_events_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "experiments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "experiment_events_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "experiment_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      experiment_variants: {
        Row: {
          configuration: Json
          created_at: string
          description: string | null
          experiment_id: string
          id: string
          is_control: boolean
          name: string
          traffic_weight: number
          updated_at: string
        }
        Insert: {
          configuration?: Json
          created_at?: string
          description?: string | null
          experiment_id: string
          id?: string
          is_control?: boolean
          name: string
          traffic_weight?: number
          updated_at?: string
        }
        Update: {
          configuration?: Json
          created_at?: string
          description?: string | null
          experiment_id?: string
          id?: string
          is_control?: boolean
          name?: string
          traffic_weight?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiment_variants_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "experiments"
            referencedColumns: ["id"]
          },
        ]
      }
      experiments: {
        Row: {
          configuration: Json
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          results: Json | null
          start_date: string | null
          statistical_significance: number | null
          status: string
          target_metric: string
          traffic_allocation: number
          type: string
          updated_at: string
          winner_variant_id: string | null
        }
        Insert: {
          configuration?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          results?: Json | null
          start_date?: string | null
          statistical_significance?: number | null
          status?: string
          target_metric: string
          traffic_allocation?: number
          type?: string
          updated_at?: string
          winner_variant_id?: string | null
        }
        Update: {
          configuration?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          results?: Json | null
          start_date?: string | null
          statistical_significance?: number | null
          status?: string
          target_metric?: string
          traffic_allocation?: number
          type?: string
          updated_at?: string
          winner_variant_id?: string | null
        }
        Relationships: []
      }
      integration_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          integration_type: string
          response_data: Json | null
          retry_count: number | null
          status: string
          submission_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          integration_type: string
          response_data?: Json | null
          retry_count?: number | null
          status: string
          submission_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          integration_type?: string
          response_data?: Json | null
          retry_count?: number | null
          status?: string
          submission_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integration_logs_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      submissions: {
        Row: {
          average_deal_value: number | null
          company_name: string
          contact_email: string
          created_at: string | null
          crm_opportunity_id: string | null
          crm_person_id: string | null
          current_arr: number | null
          failed_payment_loss: number | null
          failed_payment_rate: number | null
          free_to_paid_conversion: number | null
          hourly_rate: number | null
          id: string
          industry: string | null
          lead_response_loss: number | null
          lead_response_time: number | null
          lead_score: number | null
          leak_percentage: number | null
          manual_hours: number | null
          monthly_free_signups: number | null
          monthly_leads: number | null
          monthly_mrr: number | null
          n8n_triggered: boolean | null
          phone: string | null
          process_inefficiency_loss: number | null
          recovery_potential_70: number | null
          recovery_potential_85: number | null
          selfserve_gap_loss: number | null
          smartlead_campaign_id: string | null
          synced_to_self_hosted: boolean | null
          total_leak: number | null
          twenty_company_id: string | null
          twenty_contact_id: string | null
          updated_at: string | null
          user_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          average_deal_value?: number | null
          company_name: string
          contact_email: string
          created_at?: string | null
          crm_opportunity_id?: string | null
          crm_person_id?: string | null
          current_arr?: number | null
          failed_payment_loss?: number | null
          failed_payment_rate?: number | null
          free_to_paid_conversion?: number | null
          hourly_rate?: number | null
          id?: string
          industry?: string | null
          lead_response_loss?: number | null
          lead_response_time?: number | null
          lead_score?: number | null
          leak_percentage?: number | null
          manual_hours?: number | null
          monthly_free_signups?: number | null
          monthly_leads?: number | null
          monthly_mrr?: number | null
          n8n_triggered?: boolean | null
          phone?: string | null
          process_inefficiency_loss?: number | null
          recovery_potential_70?: number | null
          recovery_potential_85?: number | null
          selfserve_gap_loss?: number | null
          smartlead_campaign_id?: string | null
          synced_to_self_hosted?: boolean | null
          total_leak?: number | null
          twenty_company_id?: string | null
          twenty_contact_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          average_deal_value?: number | null
          company_name?: string
          contact_email?: string
          created_at?: string | null
          crm_opportunity_id?: string | null
          crm_person_id?: string | null
          current_arr?: number | null
          failed_payment_loss?: number | null
          failed_payment_rate?: number | null
          free_to_paid_conversion?: number | null
          hourly_rate?: number | null
          id?: string
          industry?: string | null
          lead_response_loss?: number | null
          lead_response_time?: number | null
          lead_score?: number | null
          leak_percentage?: number | null
          manual_hours?: number | null
          monthly_free_signups?: number | null
          monthly_leads?: number | null
          monthly_mrr?: number | null
          n8n_triggered?: boolean | null
          phone?: string | null
          process_inefficiency_loss?: number | null
          recovery_potential_70?: number | null
          recovery_potential_85?: number | null
          selfserve_gap_loss?: number | null
          smartlead_campaign_id?: string | null
          synced_to_self_hosted?: boolean | null
          total_leak?: number | null
          twenty_company_id?: string | null
          twenty_contact_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      temporary_submissions: {
        Row: {
          archived_at: string | null
          attribution_data: Json | null
          calculator_data: Json | null
          calculator_interactions: number | null
          company_name: string | null
          completion_percentage: number | null
          consultant_data: Json | null
          conversion_completed_at: string | null
          converted_to_user_id: string | null
          created_at: string | null
          current_step: number | null
          email: string | null
          email_engagement_score: number | null
          email_sequences_triggered: Json | null
          expires_at: string | null
          id: string
          industry: string | null
          ip_address: string | null
          last_activity_at: string | null
          last_email_sent_at: string | null
          last_updated: string | null
          lead_score: number | null
          n8n_workflow_status: Json | null
          page_views: number | null
          phone: string | null
          recovery_potential: number | null
          referrer_url: string | null
          return_visits: number | null
          session_id: string | null
          smartlead_campaign_ids: Json | null
          special_handling: boolean | null
          steps_completed: number | null
          temp_id: string
          time_spent_seconds: number | null
          total_revenue_leak: number | null
          twenty_crm_contact_id: string | null
          user_agent: string | null
          user_classification: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          archived_at?: string | null
          attribution_data?: Json | null
          calculator_data?: Json | null
          calculator_interactions?: number | null
          company_name?: string | null
          completion_percentage?: number | null
          consultant_data?: Json | null
          conversion_completed_at?: string | null
          converted_to_user_id?: string | null
          created_at?: string | null
          current_step?: number | null
          email?: string | null
          email_engagement_score?: number | null
          email_sequences_triggered?: Json | null
          expires_at?: string | null
          id?: string
          industry?: string | null
          ip_address?: string | null
          last_activity_at?: string | null
          last_email_sent_at?: string | null
          last_updated?: string | null
          lead_score?: number | null
          n8n_workflow_status?: Json | null
          page_views?: number | null
          phone?: string | null
          recovery_potential?: number | null
          referrer_url?: string | null
          return_visits?: number | null
          session_id?: string | null
          smartlead_campaign_ids?: Json | null
          special_handling?: boolean | null
          steps_completed?: number | null
          temp_id: string
          time_spent_seconds?: number | null
          total_revenue_leak?: number | null
          twenty_crm_contact_id?: string | null
          user_agent?: string | null
          user_classification?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          archived_at?: string | null
          attribution_data?: Json | null
          calculator_data?: Json | null
          calculator_interactions?: number | null
          company_name?: string | null
          completion_percentage?: number | null
          consultant_data?: Json | null
          conversion_completed_at?: string | null
          converted_to_user_id?: string | null
          created_at?: string | null
          current_step?: number | null
          email?: string | null
          email_engagement_score?: number | null
          email_sequences_triggered?: Json | null
          expires_at?: string | null
          id?: string
          industry?: string | null
          ip_address?: string | null
          last_activity_at?: string | null
          last_email_sent_at?: string | null
          last_updated?: string | null
          lead_score?: number | null
          n8n_workflow_status?: Json | null
          page_views?: number | null
          phone?: string | null
          recovery_potential?: number | null
          referrer_url?: string | null
          return_visits?: number | null
          session_id?: string | null
          smartlead_campaign_ids?: Json | null
          special_handling?: boolean | null
          steps_completed?: number | null
          temp_id?: string
          time_spent_seconds?: number | null
          total_revenue_leak?: number | null
          twenty_crm_contact_id?: string | null
          user_agent?: string | null
          user_classification?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      user_company_relationships: {
        Row: {
          analysis_value_score: number | null
          analyzed_company_name: string
          company_arr: number | null
          created_at: string | null
          engagement_context: string | null
          id: string
          relationship_type: string | null
          submission_date: string | null
          submission_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          analysis_value_score?: number | null
          analyzed_company_name: string
          company_arr?: number | null
          created_at?: string | null
          engagement_context?: string | null
          id?: string
          relationship_type?: string | null
          submission_date?: string | null
          submission_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          analysis_value_score?: number | null
          analyzed_company_name?: string
          company_arr?: number | null
          created_at?: string | null
          engagement_context?: string | null
          id?: string
          relationship_type?: string | null
          submission_date?: string | null
          submission_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_company_relationships_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_engagement_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          submission_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          submission_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          submission_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_engagement_events_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          actions_checked_count: number | null
          actual_company_name: string | null
          actual_role: string | null
          business_model: string | null
          checked_actions: Json | null
          companies_analyzed: number | null
          company_name: string | null
          created_at: string | null
          engagement_score: number | null
          engagement_tier: string | null
          enterprise_qualified: boolean | null
          first_submission_date: string | null
          high_intent_lead: boolean | null
          high_value_user: boolean | null
          id: string
          last_action_plan_visit: string | null
          last_analysis_date: string | null
          most_recent_submission_date: string | null
          partnership_qualified: boolean | null
          phone: string | null
          return_visits: number | null
          role: string | null
          total_companies_analyzed: number | null
          total_opportunity: number | null
          total_portfolio_value: number | null
          total_time_spent: number | null
          unique_industries_analyzed: number | null
          updated_at: string | null
          user_classification: string | null
          user_tier: string | null
          user_type: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          actions_checked_count?: number | null
          actual_company_name?: string | null
          actual_role?: string | null
          business_model?: string | null
          checked_actions?: Json | null
          companies_analyzed?: number | null
          company_name?: string | null
          created_at?: string | null
          engagement_score?: number | null
          engagement_tier?: string | null
          enterprise_qualified?: boolean | null
          first_submission_date?: string | null
          high_intent_lead?: boolean | null
          high_value_user?: boolean | null
          id: string
          last_action_plan_visit?: string | null
          last_analysis_date?: string | null
          most_recent_submission_date?: string | null
          partnership_qualified?: boolean | null
          phone?: string | null
          return_visits?: number | null
          role?: string | null
          total_companies_analyzed?: number | null
          total_opportunity?: number | null
          total_portfolio_value?: number | null
          total_time_spent?: number | null
          unique_industries_analyzed?: number | null
          updated_at?: string | null
          user_classification?: string | null
          user_tier?: string | null
          user_type?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          actions_checked_count?: number | null
          actual_company_name?: string | null
          actual_role?: string | null
          business_model?: string | null
          checked_actions?: Json | null
          companies_analyzed?: number | null
          company_name?: string | null
          created_at?: string | null
          engagement_score?: number | null
          engagement_tier?: string | null
          enterprise_qualified?: boolean | null
          first_submission_date?: string | null
          high_intent_lead?: boolean | null
          high_value_user?: boolean | null
          id?: string
          last_action_plan_visit?: string | null
          last_analysis_date?: string | null
          most_recent_submission_date?: string | null
          partnership_qualified?: boolean | null
          phone?: string | null
          return_visits?: number | null
          role?: string | null
          total_companies_analyzed?: number | null
          total_opportunity?: number | null
          total_portfolio_value?: number | null
          total_time_spent?: number | null
          unique_industries_analyzed?: number | null
          updated_at?: string | null
          user_classification?: string | null
          user_tier?: string | null
          user_type?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      abandonment_analytics: {
        Row: {
          abandonment_rate: number | null
          avg_recovery_potential: number | null
          conversion_rate: number | null
          converted_from_step: number | null
          current_step: number | null
          high_value_count: number | null
          progressed_from_step: number | null
          total_at_step: number | null
        }
        Relationships: []
      }
      email_sequence_analytics: {
        Row: {
          click_rate: number | null
          conversion_rate: number | null
          open_rate: number | null
          sequence_type: string | null
          total_clicks: number | null
          total_conversions: number | null
          total_opens: number | null
          total_revenue: number | null
          total_sent: number | null
          week: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      analyze_user_pattern: {
        Args: { user_email: string }
        Returns: {
          user_type: string
          business_model: string
          value_tier: string
          total_companies: number
          unique_industries: number
          total_arr: number
        }[]
      }
      assign_experiment_variant: {
        Args: { p_experiment_id: string; p_user_identifier: string }
        Returns: string
      }
      calculate_engagement_score: {
        Args: { user_events: Json[] }
        Returns: number
      }
      calculate_experiment_significance: {
        Args: { p_experiment_id: string }
        Returns: number
      }
      check_admin_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          user_identifier: string
          action_type: string
          max_per_hour?: number
        }
        Returns: boolean
      }
      cleanup_expired_temp_submissions: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_submissions_with_user_data: {
        Args: { limit_count?: number }
        Returns: {
          id: string
          company_name: string
          contact_email: string
          industry: string
          current_arr: number
          monthly_leads: number
          average_deal_value: number
          lead_response_time: number
          monthly_free_signups: number
          free_to_paid_conversion: number
          monthly_mrr: number
          failed_payment_rate: number
          manual_hours: number
          hourly_rate: number
          lead_response_loss: number
          failed_payment_loss: number
          selfserve_gap_loss: number
          process_inefficiency_loss: number
          total_leak: number
          leak_percentage: number
          recovery_potential_70: number
          recovery_potential_85: number
          lead_score: number
          created_at: string
          updated_at: string
          user_id: string
          user_email: string
          user_registered_date: string
          user_last_login: string
          user_email_verified: boolean
          user_role: string
          user_company_name: string
          user_type: string
          user_total_submissions: number
        }[]
      }
      get_users_with_analytics: {
        Args: { limit_count?: number }
        Returns: {
          user_id: string
          email: string
          created_at: string
          email_confirmed_at: string
          last_sign_in_at: string
          user_role: string
          user_company: string
          user_type: string
          total_submissions: number
          companies_analyzed: number
          first_submission_date: string
          last_submission_date: string
          avg_lead_score: number
          total_pipeline_value: number
          account_status: string
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      link_submissions_to_user: {
        Args: { p_user_id: string; p_user_email: string }
        Returns: number
      }
      perform_database_cleanup: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      track_email_performance: {
        Args: {
          p_sequence_type: string
          p_contact_email: string
          p_event_type: string
          p_revenue_amount?: number
        }
        Returns: undefined
      }
      update_engagement_score: {
        Args: { p_user_id: string; p_event_type: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
