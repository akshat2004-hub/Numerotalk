export interface DbProfile {
  id: string;
  user_id: string;
  name: string;
  mobile?: string | null;
  dob: string; // YYYY-MM-DD
  birth_time?: string | null;
  image_url?: string | null;
  is_self: boolean;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbReport {
  id: string;
  user_id: string;
  profile_id?: string | null;
  share_token: string;
  title: string;
  sections: Record<string, boolean>;
  pdf_storage_url?: string | null;
  is_public: boolean;
  created_at: string;
}

export interface DbCustomRemedy {
  id: string;
  user_id: string;
  profile_id?: string | null;
  text: string;
  category?: string;
  created_at: string;
}
