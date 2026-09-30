// Dibuat dari skema Supabase (generate_typescript_types). Update file ini kalau skema berubah.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      admin_emails: {
        Row: { created_at: string; email: string };
        Insert: { created_at?: string; email: string };
        Update: { created_at?: string; email?: string };
        Relationships: [];
      };
      bookings: {
        Row: {
          channel: string;
          code: string;
          created_at: string;
          end_date: string | null;
          estimated_total: number | null;
          guest_name: string;
          id: string;
          item_title: string;
          kind: string;
          location: string | null;
          notes: string | null;
          quantity: number;
          start_date: string | null;
          status: string;
          tour_id: string | null;
          unit_id: string | null;
          updated_at: string;
          vehicle_id: string | null;
        };
        Insert: {
          channel?: string;
          code?: string;
          created_at?: string;
          end_date?: string | null;
          estimated_total?: number | null;
          guest_name: string;
          id?: string;
          item_title: string;
          kind: string;
          location?: string | null;
          notes?: string | null;
          quantity?: number;
          start_date?: string | null;
          status?: string;
          tour_id?: string | null;
          unit_id?: string | null;
          updated_at?: string;
          vehicle_id?: string | null;
        };
        Update: {
          channel?: string;
          code?: string;
          created_at?: string;
          end_date?: string | null;
          estimated_total?: number | null;
          guest_name?: string;
          id?: string;
          item_title?: string;
          kind?: string;
          location?: string | null;
          notes?: string | null;
          quantity?: number;
          start_date?: string | null;
          status?: string;
          tour_id?: string | null;
          unit_id?: string | null;
          updated_at?: string;
          vehicle_id?: string | null;
        };
        Relationships: [
          { foreignKeyName: "bookings_tour_id_fkey"; columns: ["tour_id"]; isOneToOne: false; referencedRelation: "tours"; referencedColumns: ["id"] },
          { foreignKeyName: "bookings_unit_id_fkey"; columns: ["unit_id"]; isOneToOne: false; referencedRelation: "fleet_units"; referencedColumns: ["id"] },
          { foreignKeyName: "bookings_vehicle_id_fkey"; columns: ["vehicle_id"]; isOneToOne: false; referencedRelation: "vehicles"; referencedColumns: ["id"] },
        ];
      };
      fleet_units: {
        Row: {
          created_at: string;
          id: string;
          km: number;
          next_service: string | null;
          notes: string | null;
          plate: string;
          status: string;
          updated_at: string;
          vehicle_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          km?: number;
          next_service?: string | null;
          notes?: string | null;
          plate: string;
          status?: string;
          updated_at?: string;
          vehicle_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          km?: number;
          next_service?: string | null;
          notes?: string | null;
          plate?: string;
          status?: string;
          updated_at?: string;
          vehicle_id?: string;
        };
        Relationships: [
          { foreignKeyName: "fleet_units_vehicle_id_fkey"; columns: ["vehicle_id"]; isOneToOne: false; referencedRelation: "vehicles"; referencedColumns: ["id"] },
        ];
      };
      photos: {
        Row: {
          alt: string;
          created_at: string;
          id: string;
          position: string | null;
          scope: string;
          sort: number;
          storage_path: string | null;
          tour_id: string | null;
          url: string;
        };
        Insert: {
          alt?: string;
          created_at?: string;
          id?: string;
          position?: string | null;
          scope: string;
          sort?: number;
          storage_path?: string | null;
          tour_id?: string | null;
          url: string;
        };
        Update: {
          alt?: string;
          created_at?: string;
          id?: string;
          position?: string | null;
          scope?: string;
          sort?: number;
          storage_path?: string | null;
          tour_id?: string | null;
          url?: string;
        };
        Relationships: [
          { foreignKeyName: "photos_tour_id_fkey"; columns: ["tour_id"]; isOneToOne: false; referencedRelation: "tours"; referencedColumns: ["id"] },
        ];
      };
      reviews: {
        Row: {
          country: string | null;
          created_at: string;
          guest_name: string;
          id: string;
          published: boolean;
          quote: string;
          rating: number;
          review_date: string | null;
          service: string | null;
          sort: number;
          source: string;
          updated_at: string;
        };
        Insert: {
          country?: string | null;
          created_at?: string;
          guest_name: string;
          id?: string;
          published?: boolean;
          quote: string;
          rating?: number;
          review_date?: string | null;
          service?: string | null;
          sort?: number;
          source?: string;
          updated_at?: string;
        };
        Update: {
          country?: string | null;
          created_at?: string;
          guest_name?: string;
          id?: string;
          published?: boolean;
          quote?: string;
          rating?: number;
          review_date?: string | null;
          service?: string | null;
          sort?: number;
          source?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          google_rating: number | null;
          google_review_count: number | null;
          google_reviews_url: string | null;
          id: number;
          updated_at: string;
        };
        Insert: {
          google_rating?: number | null;
          google_review_count?: number | null;
          google_reviews_url?: string | null;
          id?: number;
          updated_at?: string;
        };
        Update: {
          google_rating?: number | null;
          google_review_count?: number | null;
          google_reviews_url?: string | null;
          id?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      tours: {
        Row: {
          active: boolean;
          area: string;
          badge: string | null;
          categories: string[];
          created_at: string;
          duration: string;
          excluded: string[];
          facts: string[];
          featured: boolean;
          highlights: Json;
          id: string;
          included: string[];
          itinerary: Json;
          pickup: string;
          price_from: number;
          slug: string;
          sort: number;
          summary: string;
          summary_id: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          area?: string;
          badge?: string | null;
          categories?: string[];
          created_at?: string;
          duration?: string;
          excluded?: string[];
          facts?: string[];
          featured?: boolean;
          highlights?: Json;
          id?: string;
          included?: string[];
          itinerary?: Json;
          pickup?: string;
          price_from?: number;
          slug: string;
          sort?: number;
          summary?: string;
          summary_id?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          area?: string;
          badge?: string | null;
          categories?: string[];
          created_at?: string;
          duration?: string;
          excluded?: string[];
          facts?: string[];
          featured?: boolean;
          highlights?: Json;
          id?: string;
          included?: string[];
          itinerary?: Json;
          pickup?: string;
          price_from?: number;
          slug?: string;
          sort?: number;
          summary?: string;
          summary_id?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      vehicles: {
        Row: {
          active: boolean;
          badge: string | null;
          category: string;
          created_at: string;
          highlights: string[];
          id: string;
          image_url: string | null;
          included: string[];
          name: string;
          price_per_day: number | null;
          price_with_driver: number | null;
          seats: number;
          slug: string;
          sort: number;
          subtitle: string;
          tint: string;
          transmission: string;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          badge?: string | null;
          category: string;
          created_at?: string;
          highlights?: string[];
          id?: string;
          image_url?: string | null;
          included?: string[];
          name: string;
          price_per_day?: number | null;
          price_with_driver?: number | null;
          seats?: number;
          slug: string;
          sort?: number;
          subtitle?: string;
          tint?: string;
          transmission?: string;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          badge?: string | null;
          category?: string;
          created_at?: string;
          highlights?: string[];
          id?: string;
          image_url?: string | null;
          included?: string[];
          name?: string;
          price_per_day?: number | null;
          price_with_driver?: number | null;
          seats?: number;
          slug?: string;
          sort?: number;
          subtitle?: string;
          tint?: string;
          transmission?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      create_booking: {
        Args: {
          p_end_date: string | null;
          p_estimated_total: number | null;
          p_guest_name: string;
          p_item_title: string;
          p_kind: string;
          p_location: string | null;
          p_notes: string | null;
          p_quantity: number;
          p_start_date: string | null;
          p_tour_slug: string | null;
          p_vehicle_slug: string | null;
        };
        Returns: string;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

type PublicTables = Database["public"]["Tables"];
export type Tables<T extends keyof PublicTables> = PublicTables[T]["Row"];
export type TablesInsert<T extends keyof PublicTables> = PublicTables[T]["Insert"];
export type TablesUpdate<T extends keyof PublicTables> = PublicTables[T]["Update"];
