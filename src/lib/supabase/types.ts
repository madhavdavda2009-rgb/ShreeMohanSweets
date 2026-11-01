// Generated from the Supabase schema. Regenerate after changing supabase/migrations.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Table<Row, Insert = Partial<Row>, Relationships = []> = {
  Row: Row;
  Insert: Insert;
  Update: Partial<Row>;
  Relationships: Relationships;
};

type Relationship<Column extends string, Target extends string> = {
  foreignKeyName: `${string}_fkey`;
  columns: [Column];
  isOneToOne: false;
  referencedRelation: Target;
  referencedColumns: ["id"];
};

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.18" };
  public: {
    Tables: {
      categories: Table<{ id: number; name: string }>;
      contact_messages: Table<
        { id: number; name: string; email: string; message: string; created_at: string },
        { name: string; email: string; message: string }
      >;
      offers: Table<
        {
          id: number;
          description: string;
          discount: number;
          start_date: string;
          end_date: string;
          active: boolean;
          created_at: string;
        },
        { description: string; discount?: number; start_date?: string; end_date?: string; active?: boolean }
      >;
      order_items: Table<
        { id: number; order_id: number; product_id: number; quantity: number; weight: string | null; price: number },
        never,
        [Relationship<"order_id", "orders">, Relationship<"product_id", "products">]
      >;
      orders: Table<
        {
          id: number;
          customer_id: string | null;
          customer_name: string;
          phone: string;
          address: string;
          payment_method: string;
          total_amount: number;
          status: string;
          stock_applied: boolean;
          access_token: string;
          created_at: string;
        },
        never
      >;
      payments: Table<
        { id: number; order_id: number; amount: number; method: string; status: string; created_at: string },
        never,
        [Relationship<"order_id", "orders">]
      >;
      products: Table<
        {
          id: number;
          name: string;
          price: number;
          category_id: number | null;
          image: string | null;
          featured: boolean;
          stock_quantity: number;
          stock_status: string;
          created_at: string;
        },
        {
          name: string;
          price?: number;
          category_id?: number | null;
          image?: string | null;
          featured?: boolean;
          stock_quantity?: number;
          stock_status?: string;
        },
        [Relationship<"category_id", "categories">]
      >;
      profiles: Table<{ id: string; name: string; phone: string; created_at: string }, never>;
      reviews: Table<
        { id: number; customer_name: string; rating: number; review_text: string; created_at: string },
        { customer_name: string; rating: number; review_text: string }
      >;
    };
    Views: { [_ in never]: never };
    Functions: {
      dashboard_stats: { Args: never; Returns: Json };
      get_order: { Args: { p_order_id: number; p_token: string }; Returns: Json };
      is_admin: { Args: never; Returns: boolean };
      place_order: {
        Args: {
          p_address: string;
          p_customer_name: string;
          p_lines: Json;
          p_payment_method: string;
          p_phone: string;
        };
        Returns: { access_token: string; order_id: number }[];
      };
      track_order: {
        Args: { p_order_id: number; p_phone: string };
        Returns: { access_token: string; created_at: string; id: number; status: string; total_amount: number }[];
      };
      update_order_status: { Args: { p_order_id: number; p_status: string }; Returns: undefined };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
