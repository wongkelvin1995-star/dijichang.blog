export interface PrestigeProfile {
  favoriteBrands: string[];
  compareBrands: string[];
  watchedLines: string[];
  budgetRecords: Array<{ id: string; label: string; monthlyBudget: number; createdAt: string }>;
  businessProfiles: Array<{ id: string; teamSize: number; summary: string; createdAt: string }>;
  readingHistory: Array<{ slug: string; title: string; visitedAt: string }>;
  notes: string;
}

const STORAGE_KEY = 'imperial_prestige_profile_v1';

const defaultProfile: PrestigeProfile = {
  favoriteBrands: [],
  compareBrands: [],
  watchedLines: [],
  budgetRecords: [],
  businessProfiles: [],
  readingHistory: [],
  notes: '',
};

export function loadProfile(): PrestigeProfile {
  if (typeof window === 'undefined') return { ...defaultProfile };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultProfile };
    return { ...defaultProfile, ...JSON.parse(raw) };
  } catch {
    return { ...defaultProfile };
  }
}

export function saveProfile(profile: PrestigeProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // ignore quota errors
  }
}

export function toggleFavoriteBrand(brandId: string): PrestigeProfile {
  const p = loadProfile();
  if (p.favoriteBrands.includes(brandId)) {
    p.favoriteBrands = p.favoriteBrands.filter((id) => id !== brandId);
  } else {
    p.favoriteBrands = [...p.favoriteBrands, brandId];
  }
  saveProfile(p);
  return p;
}

export function clearProfile(): PrestigeProfile {
  const fresh = { ...defaultProfile };
  saveProfile(fresh);
  return fresh;
}
