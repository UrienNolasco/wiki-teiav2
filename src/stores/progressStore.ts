import { create } from "zustand";
import { persist } from "zustand/middleware";

type LastWorkshopState = {
  lastWorkshopId: string | null;
  lastViewedAt: Date | null;
  setLastWorkshop: (workshopId: string) => void;
  clearLastWorkshop: () => void;
};

export const useLastWorkshopStore = create<LastWorkshopState>()(
  persist(
    (set) => ({
      lastWorkshopId: null,
      lastViewedAt: null,
      setLastWorkshop: (workshopId) => {
        set({
          lastWorkshopId: workshopId,
          lastViewedAt: new Date(),
        });
      },
      clearLastWorkshop: () =>
        set({ lastWorkshopId: null, lastViewedAt: null }),
    }),
    {
      name: "last-workshop-storage",
    }
  )
);
