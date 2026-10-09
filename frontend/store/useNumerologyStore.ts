import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProfile } from '@/core/types';

interface NumerologyStoreState {
  profile: UserProfile;
  customRemedies: string[];
  reportSections: Record<string, boolean>;
  isHydrated: boolean;
  setProfile: (updates: Partial<UserProfile>) => void;
  resetProfile: () => void;
  addCustomRemedy: (remedy: string) => void;
  removeCustomRemedy: (index: number) => void;
  toggleReportSection: (sectionKey: string) => void;
  selectAllReportSections: () => void;
  deselectAllReportSections: () => void;
  selectedProfession: string;
  setSelectedProfession: (profId: string) => void;
  setHydrated: (hydrated: boolean) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Rahul Sharma',
  mobile: '9876543210',
  dob: '1995-10-23',
  birthTime: '10:30',
  image: '',
  consent: true
};

const DEFAULT_REPORT_SECTIONS: Record<string, boolean> = {
  userDetail: true,
  destiny: true,
  combination: true,
  missing: true,
  repeating: true,
  yogas: true,
  nameNumerology: true,
  matchMaking: true,
  mobile: true,
  profession: true,
  pinPassword: true,
  yearly: true,
  vastu: true,
  time: true,
  numberMeanings: true,
  events: true,
  help: true,
  remedies: true
};

export const useNumerologyStore = create<NumerologyStoreState>()(
  persist(
    (set) => ({
      profile: DEFAULT_PROFILE,
      customRemedies: [
        'Place a natural brass bell at the entrance and ring it every morning with positive prayer.'
      ],
      reportSections: DEFAULT_REPORT_SECTIONS,
      selectedProfession: 'tech_entrepreneur',
      isHydrated: false,

      setSelectedProfession: (profId) => set({ selectedProfession: profId }),

      setProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates }
        })),

      resetProfile: () =>
        set(() => ({
          profile: {
            name: '',
            mobile: '',
            dob: '',
            birthTime: '',
            image: '',
            consent: false
          }
        })),

      addCustomRemedy: (remedy) =>
        set((state) => ({
          customRemedies: [...state.customRemedies, remedy.trim()]
        })),

      removeCustomRemedy: (index) =>
        set((state) => ({
          customRemedies: state.customRemedies.filter((_, i) => i !== index)
        })),

      toggleReportSection: (sectionKey) =>
        set((state) => ({
          reportSections: {
            ...state.reportSections,
            [sectionKey]: !state.reportSections[sectionKey]
          }
        })),

      selectAllReportSections: () =>
        set((state) => {
          const allTrue = Object.keys(state.reportSections).reduce((acc, k) => {
            acc[k] = true;
            return acc;
          }, {} as Record<string, boolean>);
          return { reportSections: allTrue };
        }),

      deselectAllReportSections: () =>
        set((state) => {
          const allFalse = Object.keys(state.reportSections).reduce((acc, k) => {
            acc[k] = false;
            return acc;
          }, {} as Record<string, boolean>);
          return { reportSections: allFalse };
        }),

      setHydrated: (hydrated) => set({ isHydrated: hydrated })
    }),
    {
      name: 'numerotalk-user-store',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      }
    }
  )
);
