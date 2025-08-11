import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TabType = "home" | "progress" | "settings";
export type ModalType = "progress-sheet" | "settings-sheet" | null;

interface NavigationState {
  // Current active tab
  activeTab: TabType;

  // Modal/sheet states
  activeModal: ModalType;
  isProgressSheetOpen: boolean;
  isSettingsSheetOpen: boolean;

  // Sheet animation states
  progressSheetHeight: number;
  settingsSheetHeight: number;

  // Navigation actions
  setActiveTab: (tab: TabType) => void;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  openProgressSheet: () => void;
  closeProgressSheet: () => void;
  openSettingsSheet: () => void;
  closeSettingsSheet: () => void;
  setProgressSheetHeight: (height: number) => void;
  setSettingsSheetHeight: (height: number) => void;

  // Gesture handling
  isGestureActive: boolean;
  setGestureActive: (active: boolean) => void;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set, get) => ({
      // Initial state
      activeTab: "home",
      activeModal: null,
      isProgressSheetOpen: false,
      isSettingsSheetOpen: false,
      progressSheetHeight: 0,
      settingsSheetHeight: 0,
      isGestureActive: false,

      // Tab navigation
      setActiveTab: (tab: TabType) => {
        set({ activeTab: tab });

        // Auto-open corresponding sheet for non-home tabs
        if (tab === "progress") {
          get().openProgressSheet();
        } else if (tab === "settings") {
          get().openSettingsSheet();
        } else {
          get().closeModal();
        }
      },

      // Modal management
      openModal: (modal: ModalType) => {
        set({
          activeModal: modal,
          isProgressSheetOpen: modal === "progress-sheet",
          isSettingsSheetOpen: modal === "settings-sheet",
        });
      },

      closeModal: () => {
        set({
          activeModal: null,
          isProgressSheetOpen: false,
          isSettingsSheetOpen: false,
          activeTab: "home", // Return to home when closing modals
        });
      },

      // Progress sheet
      openProgressSheet: () => {
        set({
          activeModal: "progress-sheet",
          isProgressSheetOpen: true,
          isSettingsSheetOpen: false,
          activeTab: "progress",
        });
      },

      closeProgressSheet: () => {
        set({
          activeModal: null,
          isProgressSheetOpen: false,
          activeTab: "home",
        });
      },

      // Settings sheet
      openSettingsSheet: () => {
        set({
          activeModal: "settings-sheet",
          isSettingsSheetOpen: true,
          isProgressSheetOpen: false,
          activeTab: "settings",
        });
      },

      closeSettingsSheet: () => {
        set({
          activeModal: null,
          isSettingsSheetOpen: false,
          activeTab: "home",
        });
      },

      // Sheet height management for smooth animations
      setProgressSheetHeight: (height: number) => {
        set({ progressSheetHeight: height });
      },

      setSettingsSheetHeight: (height: number) => {
        set({ settingsSheetHeight: height });
      },

      // Gesture handling
      setGestureActive: (active: boolean) => {
        set({ isGestureActive: active });
      },
    }),
    {
      name: "activegotchi-navigation",
      version: 1,
      partialize: (state) => ({
        activeTab: state.activeTab,
        // Don't persist modal states - always start with clean state
      }),
    }
  )
);
