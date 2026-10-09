export interface SampleProfile {
  id: string;
  name: string;
  dob: string;
  birthTime?: string;
  notes: string;
}

export const SAMPLE_PROFILES: SampleProfile[] = [
  {
    id: 'profile_a',
    name: 'Aarav Sharma',
    dob: '1985-05-15',
    birthTime: '06:30',
    notes: 'Mulank 6, Bhagyank 3 - Strong Venus and Jupiter alignment'
  },
  {
    id: 'profile_b',
    name: 'Priya Verma',
    dob: '1992-11-28',
    birthTime: '14:15',
    notes: 'Mulank 1, Bhagyank 6 - Sun and Venus dynamics'
  },
  {
    id: 'profile_c',
    name: 'Rohan Gupta',
    dob: '2001-08-04',
    birthTime: '21:45',
    notes: 'Mulank 4, Bhagyank 6 - Rahu and Venus axis'
  }
];
