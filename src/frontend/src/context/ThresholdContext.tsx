import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface RiskThresholds {
  quality: number;
  delay: number;
  failure: number;
}

const DEFAULT_THRESHOLDS: RiskThresholds = {
  quality: 70,
  delay: 70,
  failure: 70,
};

const STORAGE_KEY = "scr-settings";

function loadThresholdsFromStorage(): RiskThresholds {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_THRESHOLDS;
    const parsed = JSON.parse(raw) as { thresholds?: Partial<RiskThresholds> };
    return { ...DEFAULT_THRESHOLDS, ...(parsed.thresholds ?? {}) };
  } catch {
    return DEFAULT_THRESHOLDS;
  }
}

interface ThresholdContextValue {
  thresholds: RiskThresholds;
  compositeThreshold: number;
  setThresholds: (t: RiskThresholds) => void;
}

const ThresholdContext = createContext<ThresholdContextValue>({
  thresholds: DEFAULT_THRESHOLDS,
  compositeThreshold: DEFAULT_THRESHOLDS.quality,
  setThresholds: () => undefined,
});

export function ThresholdProvider({ children }: { children: React.ReactNode }) {
  const [thresholds, setThresholdsState] = useState<RiskThresholds>(
    loadThresholdsFromStorage,
  );
  const queryClient = useQueryClient();

  // Sync from storage changes (e.g. settings page saves)
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) {
        setThresholdsState(loadThresholdsFromStorage());
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setThresholds = useCallback(
    (t: RiskThresholds) => {
      setThresholdsState(t);
      queryClient.invalidateQueries({ queryKey: ["risk-alerts"] });
    },
    [queryClient],
  );

  // Composite threshold = minimum of the three (most sensitive)
  const compositeThreshold = Math.min(
    thresholds.quality,
    thresholds.delay,
    thresholds.failure,
  );

  return (
    <ThresholdContext.Provider
      value={{ thresholds, compositeThreshold, setThresholds }}
    >
      {children}
    </ThresholdContext.Provider>
  );
}

export function useThresholds() {
  return useContext(ThresholdContext);
}
