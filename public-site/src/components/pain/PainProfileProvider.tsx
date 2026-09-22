'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { EMPTY_PAIN_PROFILE, mergePainProfile, type PainProfile } from '@/lib/pain-profile';

const STORAGE_KEY = 'tjr:pain-profile:v1';
type ProfileContextValue = { profile: PainProfile; isLoaded: boolean; saveOnDevice: boolean; updateProfile: (next: PainProfile) => void; enableDeviceSave: () => void; clearProfile: () => void };
const ProfileContext = createContext<ProfileContextValue | null>(null);

export function PainProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<PainProfile>(EMPTY_PAIN_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveOnDevice, setSaveOnDevice] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) { setProfile(mergePainProfile(JSON.parse(raw))); setSaveOnDevice(true); }
    } catch { /* Corrupt or unavailable storage falls back to session-only use. */ }
    setIsLoaded(true);
  }, []);

  const updateProfile = (next: PainProfile) => {
    const updated = { ...next, updatedAt: new Date().toISOString() };
    setProfile(updated);
    if (saveOnDevice) { try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* keep session state */ } }
  };
  const enableDeviceSave = () => { setSaveOnDevice(true); try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)); } catch { /* keep session state */ } };
  const clearProfile = () => { setProfile(mergePainProfile({})); setSaveOnDevice(false); try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* already cleared in memory */ } };
  const value = { profile, isLoaded, saveOnDevice, updateProfile, enableDeviceSave, clearProfile };
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function usePainProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('usePainProfile must be used inside PainProfileProvider');
  return context;
}
