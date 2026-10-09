import { DbProfile, DbReport, DbCustomRemedy } from '@/backend';

export const backendService = {
  // --- AUTH ---
  async register(email: string, password: string, name?: string) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    return res.json();
  },

  async login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async logout() {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    return res.json();
  },

  async getMe() {
    const res = await fetch('/api/auth/me');
    if (!res.ok) return null;
    return res.json();
  },

  // --- PROFILES CRM ---
  async getProfiles(): Promise<{ profiles: DbProfile[] }> {
    const res = await fetch('/api/profiles');
    return res.json();
  },

  async createProfile(data: Partial<DbProfile>): Promise<{ profile: DbProfile }> {
    const res = await fetch('/api/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateProfile(id: string, data: Partial<DbProfile>): Promise<{ profile: DbProfile }> {
    const res = await fetch(`/api/profiles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteProfile(id: string) {
    const res = await fetch(`/api/profiles/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // --- REPORTS CLOUD STORAGE ---
  async getReports(): Promise<{ reports: DbReport[] }> {
    const res = await fetch('/api/reports');
    return res.json();
  },

  async saveReport(data: {
    profile_id?: string;
    title: string;
    sections: Record<string, boolean>;
    pdf_base64?: string;
    is_public?: boolean;
  }): Promise<{ report: DbReport }> {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getReport(idOrShareToken: string): Promise<{ report: DbReport }> {
    const res = await fetch(`/api/reports/${idOrShareToken}`);
    return res.json();
  },

  async deleteReport(id: string) {
    const res = await fetch(`/api/reports/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // --- CUSTOM REMEDIES ---
  async getCustomRemedies(): Promise<{ remedies: DbCustomRemedy[] }> {
    const res = await fetch('/api/remedies/custom');
    return res.json();
  },

  async addCustomRemedy(text: string, category = 'General', profile_id?: string): Promise<{ remedy: DbCustomRemedy }> {
    const res = await fetch('/api/remedies/custom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, category, profile_id }),
    });
    return res.json();
  },

  async deleteCustomRemedy(id: string) {
    const res = await fetch(`/api/remedies/custom/${id}`, { method: 'DELETE' });
    return res.json();
  },
};
