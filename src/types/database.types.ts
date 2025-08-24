export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string | null
          id: string
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_admin_logs_admin_id"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_date: string
          created_at: string | null
          customer_id: string
          id: string
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          service_id: string
          service_options: string[] | null
          special_request: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          time_slot_end: string
          time_slot_start: string
          validation_status: string | null
        }
        Insert: {
          booking_date: string
          created_at?: string | null
          customer_id: string
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          service_id: string
          service_options?: string[] | null
          special_request?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          time_slot_end: string
          time_slot_start: string
          validation_status?: string | null
        }
        Update: {
          booking_date?: string
          created_at?: string | null
          customer_id?: string
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          service_id?: string
          service_options?: string[] | null
          special_request?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          time_slot_end?: string
          time_slot_start?: string
          validation_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_bookings_customer_id"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_bookings_service_id"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          booking_id: string | null
          created_at: string | null
          id: string
          provider_id: string | null
          reason: string
          resolved_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          provider_id?: string | null
          reason: string
          resolved_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          provider_id?: string | null
          reason?: string
          resolved_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_disputes_booking_id"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_disputes_provider_id"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          booking_id: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          service_provider_id: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          service_provider_id?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          service_provider_id?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_notifications_booking_id"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_notifications_service_provider_id"
            columns: ["service_provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_notifications_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          booking_id: string | null
          commission: number
          commission_retrieved: boolean | null
          created_at: string | null
          customer_id: string | null
          id: string
          net_amount: number | null
          payment_method: Json | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          payment_type: Database["public"]["Enums"]["payment_type"] | null
          provider_id: string | null
          transaction_date: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          commission?: number
          commission_retrieved?: boolean | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          net_amount?: number | null
          payment_method?: Json | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          payment_type?: Database["public"]["Enums"]["payment_type"] | null
          provider_id?: string | null
          transaction_date?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          commission?: number
          commission_retrieved?: boolean | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          net_amount?: number | null
          payment_method?: Json | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          payment_type?: Database["public"]["Enums"]["payment_type"] | null
          provider_id?: string | null
          transaction_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_payment_transactions_booking_id"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_payment_transactions_provider_id"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_locations: {
        Row: {
          address: string
          contact_info: Json | null
          coordinates: Json | null
          created_at: string | null
          location_id: string
          provider_id: string
          updated_at: string | null
        }
        Insert: {
          address: string
          contact_info?: Json | null
          coordinates?: Json | null
          created_at?: string | null
          location_id: string
          provider_id: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          contact_info?: Json | null
          coordinates?: Json | null
          created_at?: string | null
          location_id?: string
          provider_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_provider_locations_provider_id"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_subscriptions: {
        Row: {
          auto_renew: boolean | null
          created_at: string | null
          end_date: string
          grace_end_date: string | null
          id: string
          plan_id: string | null
          provider_id: string | null
          start_date: string
          status: string | null
          trial_end_date: string | null
          updated_at: string | null
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string | null
          end_date: string
          grace_end_date?: string | null
          id?: string
          plan_id?: string | null
          provider_id?: string | null
          start_date?: string
          status?: string | null
          trial_end_date?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string | null
          end_date?: string
          grace_end_date?: string | null
          id?: string
          plan_id?: string | null
          provider_id?: string | null
          start_date?: string
          status?: string | null
          trial_end_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_provider_subscriptions_plan_id"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_provider_subscriptions_provider_id"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      refunds: {
        Row: {
          amount: number
          created_at: string | null
          customer_id: string
          id: string
          payment_id: string | null
          processed_at: string | null
          reason: string | null
          status: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          customer_id: string
          id?: string
          payment_id?: string | null
          processed_at?: string | null
          reason?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          customer_id?: string
          id?: string
          payment_id?: string | null
          processed_at?: string | null
          reason?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_refunds_customer_id"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_refunds_payment_id"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      review: {
        Row: {
          created_at: string | null
          customer_id: string | null
          id: string
          review: number
          review_text: string | null
          service_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          review: number
          review_text?: string | null
          service_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          review?: number
          review_text?: string | null
          service_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_review_customer_id"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_review_service_id"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          category_id: string
          created_at: string | null
          name: string | null
          sector_id: string | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          name?: string | null
          sector_id?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          name?: string | null
          sector_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_service_categories_sector_id"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "service_sectors"
            referencedColumns: ["sector_id"]
          },
        ]
      }
      service_options: {
        Row: {
          created_at: string | null
          duration: number | null
          name: string
          option_id: string
          price: number
          service_id: string
        }
        Insert: {
          created_at?: string | null
          duration?: number | null
          name: string
          option_id: string
          price: number
          service_id: string
        }
        Update: {
          created_at?: string | null
          duration?: number | null
          name?: string
          option_id?: string
          price?: number
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_service_options_service_id"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_providers: {
        Row: {
          business_name: string
          company_id: string | null
          contact_info: string | null
          created_at: string | null
          description: string | null
          id: string
          location: Json | null
          name: string
          service_id: string | null
          user_id: string | null
        }
        Insert: {
          business_name: string
          company_id?: string | null
          contact_info?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: Json | null
          name: string
          service_id?: string | null
          user_id?: string | null
        }
        Update: {
          business_name?: string
          company_id?: string | null
          contact_info?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: Json | null
          name?: string
          service_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_service_providers_service_id"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_sectors: {
        Row: {
          created_at: string | null
          name: string | null
          sector_id: string
        }
        Insert: {
          created_at?: string | null
          name?: string | null
          sector_id: string
        }
        Update: {
          created_at?: string | null
          name?: string | null
          sector_id?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          availability: Json | null
          category_id: string | null
          commission_rate: number | null
          created_at: string | null
          date: string | null
          description: string | null
          duration_minutes: number
          id: string
          location: string
          name: string
          photos: Json[] | null
          price: number | null
          provider_id: string | null
          service_name: string | null
          service_type: Database["public"]["Enums"]["service_type"] | null
        }
        Insert: {
          availability?: Json | null
          category_id?: string | null
          commission_rate?: number | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          duration_minutes: number
          id?: string
          location: string
          name: string
          photos?: Json[] | null
          price?: number | null
          provider_id?: string | null
          service_name?: string | null
          service_type?: Database["public"]["Enums"]["service_type"] | null
        }
        Update: {
          availability?: Json | null
          category_id?: string | null
          commission_rate?: number | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          location?: string
          name?: string
          photos?: Json[] | null
          price?: number | null
          provider_id?: string | null
          service_name?: string | null
          service_type?: Database["public"]["Enums"]["service_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_services_category_id"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "fk_services_provider_id"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          duration_days: number
          features: Json
          id: string
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration_days: number
          features: Json
          id?: string
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration_days?: number
          features?: Json
          id?: string
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          payment_methods: Json | null
          phone_number: string | null
          preferences: Json | null
          profile_picture: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          payment_methods?: Json | null
          phone_number?: string | null
          preferences?: Json | null
          profile_picture?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          payment_methods?: Json | null
          phone_number?: string | null
          preferences?: Json | null
          profile_picture?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      wish_list: {
        Row: {
          created_at: string | null
          customer_id: string | null
          id: string
          service_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          service_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          service_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_wishlist_customer_id"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_wishlist_service_id"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      booking_status: "pending" | "confirmed" | "canceled" | "completed"
      payment_status: "pending" | "done" | "no_payment"
      payment_type: "online" | "cash"
      service_type:
        | "accommodation"
        | "culinary experiences"
        | "Tours and Activities"
        | "Aesthetic and Well-being Services"
      user_role: "admin" | "business" | "customer"
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
    Enums: {
      booking_status: ["pending", "confirmed", "canceled", "completed"],
      payment_status: ["pending", "done", "no_payment"],
      payment_type: ["online", "cash"],
      service_type: [
        "accommodation",
        "culinary experiences",
        "Tours and Activities",
        "Aesthetic and Well-being Services",
      ],
      user_role: ["admin", "business", "customer"],
    },
  },
} as const
