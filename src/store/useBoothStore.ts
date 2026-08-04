import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { BoothLayout, CaptureSettings, Template } from '@/types/booth.types';

interface BoothState {
  // Camera
  currentDeviceId: string | null;
  mirrorMode: boolean;
  resolution: { width: number; height: number };
  
  // Capture
  layout: BoothLayout;
  countdown: number;
  voiceCountdown: boolean;
  flashAnimation: boolean;
  
  // Template
  activeTemplate: Template | null;
  
  // Actions
  setDeviceId: (id: string | null) => void;
  toggleMirror: () => void;
  setResolution: (w: number, h: number) => void;
  setLayout: (layout: BoothLayout) => void;
  setCountdown: (seconds: number) => void;
  toggleVoiceCountdown: () => void;
  toggleFlash: () => void;
  setTemplate: (template: Template | null) => void;
  reset: () => void;
}

const initialState = {
  currentDeviceId: null,
  mirrorMode: true,
  resolution: { width: 1920, height: 1080 },
  layout: 'strip-4' as BoothLayout,
  countdown: 3,
  voiceCountdown: true,
  flashAnimation: true,
  activeTemplate: null,
};

export const useBoothStore = create<BoothState>()(
  persist(
    (set) => ({
      ...initialState,
      setDeviceId: (id) => set({ currentDeviceId: id }),
      toggleMirror: () => set((s) => ({ mirrorMode: !s.mirrorMode })),
      setResolution: (w, h) => set({ resolution: { width: w, height: h } }),
      setLayout: (layout) => set({ layout }),
      setCountdown: (countdown) => set({ countdown }),
      toggleVoiceCountdown: () => set((s) => ({ voiceCountdown: !s.voiceCountdown })),
      toggleFlash: () => set((s) => ({ flashAnimation: !s.flashAnimation })),
      setTemplate: (template) => set({ activeTemplate: template }),
      reset: () => set(initialState),
    }),
    { name: 'booth-storage', storage: createJSONStorage(() => localStorage) }
  )
);
