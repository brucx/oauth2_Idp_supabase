export interface Database {
  public: {
    Tables: {
      oauth_clients: {
        Row: {
          id: string
          client_id: string
          client_secret: string
          name: string
          redirect_uri: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          client_secret: string
          name: string
          redirect_uri: string
          created_at?: string
          updated_at?: string
        }
      }
      authorization_codes: {
        Row: {
          id: string
          code: string
          client_id: string
          user_id?: string
          redirect_uri: string
          scope?: string
          state: string
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          client_id: string
          user_id?: string
          redirect_uri: string
          scope?: string
          state: string
          expires_at: string
          created_at?: string
        }
      }
    }
  }
}