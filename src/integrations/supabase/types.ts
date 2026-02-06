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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          article: string | null
          created_at: string
          download_link: string | null
          id: string
          movie_name: string
          poster_url: string | null
          updated_at: string
        }
        Insert: {
          article?: string | null
          created_at?: string
          download_link?: string | null
          id?: string
          movie_name: string
          poster_url?: string | null
          updated_at?: string
        }
        Update: {
          article?: string | null
          created_at?: string
          download_link?: string | null
          id?: string
          movie_name?: string
          poster_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      episodes: {
        Row: {
          created_at: string
          download_link: string | null
          duration: string | null
          episode_number: number
          id: string
          season_id: string
          title: string
          video_link: string | null
        }
        Insert: {
          created_at?: string
          download_link?: string | null
          duration?: string | null
          episode_number: number
          id?: string
          season_id: string
          title: string
          video_link?: string | null
        }
        Update: {
          created_at?: string
          download_link?: string | null
          duration?: string | null
          episode_number?: number
          id?: string
          season_id?: string
          title?: string
          video_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "episodes_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      movie_requests: {
        Row: {
          created_at: string
          id: string
          language: string
          movie_name: string
          status: string
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          language: string
          movie_name: string
          status?: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          language?: string
          movie_name?: string
          status?: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      movies: {
        Row: {
          category: string | null
          created_at: string
          download_link: string | null
          id: string
          info: string | null
          is_featured: boolean | null
          language: string | null
          normal_print_link: string | null
          poster_url: string | null
          quality: string | null
          release_date: string | null
          title: string
          updated_at: string
          video_link: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          download_link?: string | null
          id?: string
          info?: string | null
          is_featured?: boolean | null
          language?: string | null
          normal_print_link?: string | null
          poster_url?: string | null
          quality?: string | null
          release_date?: string | null
          title: string
          updated_at?: string
          video_link?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          download_link?: string | null
          id?: string
          info?: string | null
          is_featured?: boolean | null
          language?: string | null
          normal_print_link?: string | null
          poster_url?: string | null
          quality?: string | null
          release_date?: string | null
          title?: string
          updated_at?: string
          video_link?: string | null
        }
        Relationships: []
      }
      seasons: {
        Row: {
          created_at: string
          id: string
          season_number: number
          series_id: string
          title: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          season_number: number
          series_id: string
          title?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          season_number?: number
          series_id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seasons_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "web_series"
            referencedColumns: ["id"]
          },
        ]
      }
      software_games: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          download_count: number | null
          download_link: string | null
          file_size: string | null
          icon_url: string | null
          id: string
          name: string
          platform: Database["public"]["Enums"]["platform_type"]
          reputation: number | null
          updated_at: string
          version: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          download_count?: number | null
          download_link?: string | null
          file_size?: string | null
          icon_url?: string | null
          id?: string
          name: string
          platform?: Database["public"]["Enums"]["platform_type"]
          reputation?: number | null
          updated_at?: string
          version?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          download_count?: number | null
          download_link?: string | null
          file_size?: string | null
          icon_url?: string | null
          id?: string
          name?: string
          platform?: Database["public"]["Enums"]["platform_type"]
          reputation?: number | null
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      watch_history: {
        Row: {
          created_at: string
          duration_seconds: number | null
          id: string
          last_watched_at: string
          movie_id: string
          progress_seconds: number
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          id?: string
          last_watched_at?: string
          movie_id: string
          progress_seconds?: number
          user_id: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          id?: string
          last_watched_at?: string
          movie_id?: string
          progress_seconds?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watch_history_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
        ]
      }
      watchlist: {
        Row: {
          added_at: string
          id: string
          movie_id: string
          user_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          movie_id: string
          user_id: string
        }
        Update: {
          added_at?: string
          id?: string
          movie_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watchlist_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
        ]
      }
      web_series: {
        Row: {
          category: string | null
          created_at: string
          id: string
          info: string | null
          language: string | null
          poster_url: string | null
          release_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          info?: string | null
          language?: string | null
          poster_url?: string | null
          release_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          info?: string | null
          language?: string | null
          poster_url?: string | null
          release_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      platform_type:
        | "windows"
        | "mac"
        | "android_apps"
        | "android_games"
        | "pc_games"
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
      app_role: ["admin", "user"],
      platform_type: [
        "windows",
        "mac",
        "android_apps",
        "android_games",
        "pc_games",
      ],
    },
  },
} as const
