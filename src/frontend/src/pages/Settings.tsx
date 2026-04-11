import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { type RiskThresholds, useThresholds } from "@/context/ThresholdContext";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NotificationPrefs {
  emailAlerts: boolean;
  highRiskOnly: boolean;
  dailyDigest: boolean;
  simulationResults: boolean;
  supplierChanges: boolean;
}

interface AppSettings {
  thresholds: RiskThresholds;
  refreshInterval: number;
  notifications: NotificationPrefs;
}

const DEFAULT_SETTINGS: AppSettings = {
  thresholds: { quality: 70, delay: 70, failure: 70 },
  refreshInterval: 10,
  notifications: {
    emailAlerts: true,
    highRiskOnly: false,
    dailyDigest: true,
    simulationResults: true,
    supplierChanges: false,
  },
};

const REFRESH_OPTIONS = [
  { value: 5, label: "5s — Realtime" },
  { value: 10, label: "10s — Standard" },
  { value: 30, label: "30s — Economy" },
] as const;

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem("scr-settings");
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      thresholds: { ...DEFAULT_SETTINGS.thresholds, ...parsed.thresholds },
      refreshInterval:
        parsed.refreshInterval ?? DEFAULT_SETTINGS.refreshInterval,
      notifications: {
        ...DEFAULT_SETTINGS.notifications,
        ...parsed.notifications,
      },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function persistSettings(s: AppSettings) {
  localStorage.setItem("scr-settings", JSON.stringify(s));
}

// ─── SliderRow ────────────────────────────────────────────────────────────────

interface SliderRowProps {
  label: string;
  description: string;
  value: number;
  onChange: (v: number) => void;
  ocid: string;
}

function barColor(value: number): string {
  if (value >= 70) return "bg-destructive";
  if (value >= 40) return "bg-warning";
  return "bg-success";
}

function textColor(value: number): string {
  if (value >= 70) return "text-destructive";
  if (value >= 40) return "text-warning";
  return "text-success";
}

function SliderRow({
  label,
  description,
  value,
  onChange,
  ocid,
}: SliderRowProps) {
  return (
    <div className="space-y-1.5" data-ocid={ocid}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold">{label} Risk Threshold</p>
          <p className="text-[10px] text-muted-foreground">{description}</p>
        </div>
        <span
          className={`text-sm font-mono font-bold tabular-nums ${textColor(value)}`}
        >
          {value}
        </span>
      </div>
      <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-150 ${barColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 appearance-none cursor-pointer bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
        data-ocid={`${ocid}-range`}
      />
      <div className="flex justify-between text-[9px] text-muted-foreground/50 font-mono">
        <span>0 — Low alert</span>
        <span>50 — Balanced</span>
        <span>100 — High alert</span>
      </div>
    </div>
  );
}

// ─── NotifRow ─────────────────────────────────────────────────────────────────

interface NotifRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function NotifRow({
  id,
  label,
  description,
  checked,
  onChange,
}: NotifRowProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="space-y-0.5 min-w-0 flex-1">
        <Label htmlFor={id} className="text-xs font-medium cursor-pointer">
          {label}
        </Label>
        <p className="text-[10px] text-muted-foreground">{description}</p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        data-ocid={`notif-${id}`}
      />
    </div>
  );
}

// ─── Settings Page ────────────────────────────────────────────────────────────

export default function Settings() {
  const { thresholds: ctxThresholds, setThresholds: setCtxThresholds } =
    useThresholds();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<AppSettings>(() => {
    const loaded = loadSettings();
    // Sync initial thresholds from context (which reads from localStorage)
    return { ...loaded, thresholds: ctxThresholds };
  });
  const [dirty, setDirty] = useState(false);

  function updateThreshold(key: keyof RiskThresholds, value: number) {
    setDirty(true);
    const newThresholds = { ...settings.thresholds, [key]: value };
    setSettings((prev) => ({ ...prev, thresholds: newThresholds }));
    // Immediately update context so risk alerts re-query in real time
    setCtxThresholds(newThresholds);
  }

  function updateNotif(key: keyof NotificationPrefs, value: boolean) {
    setDirty(true);
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
  }

  function handleSave() {
    persistSettings(settings);
    setCtxThresholds(settings.thresholds);
    queryClient.invalidateQueries({ queryKey: ["risk-alerts"] });
    setDirty(false);
    toast.success("Settings saved", {
      description: "Your preferences have been persisted to this browser.",
      duration: 3000,
    });
  }

  function handleReset() {
    setSettings(DEFAULT_SETTINGS);
    persistSettings(DEFAULT_SETTINGS);
    setCtxThresholds(DEFAULT_SETTINGS.thresholds);
    queryClient.invalidateQueries({ queryKey: ["risk-alerts"] });
    setDirty(false);
    toast("Settings reset", {
      description: "Defaults restored.",
      duration: 3000,
    });
  }

  return (
    <div className="max-w-2xl space-y-5" data-ocid="settings-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-mono font-bold uppercase tracking-widest">
            Settings
          </h2>
          <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
            Risk thresholds, refresh interval &amp; notification preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          {dirty && (
            <Badge
              variant="outline"
              className="text-[10px] font-mono text-warning border-warning/40"
            >
              Unsaved
            </Badge>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 text-xs text-muted-foreground border border-border rounded hover:border-primary/50 hover:text-foreground transition-smooth"
            data-ocid="settings-reset"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded hover:opacity-90 transition-smooth font-semibold"
            data-ocid="settings-save"
          >
            Save settings
          </button>
        </div>
      </div>

      {/* Risk Thresholds */}
      <section
        className="rounded border border-border bg-card p-4 space-y-4"
        data-ocid="risk-thresholds-section"
      >
        <div>
          <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-muted-foreground">
            Risk Thresholds
          </p>
          <p className="text-[10px] text-muted-foreground/70 mt-0.5">
            Alerts trigger when a supplier's risk score exceeds these values
            (0–100).
          </p>
        </div>
        <Separator />
        <SliderRow
          label="Quality"
          description="Defect rate, inspection failures, product compliance"
          value={settings.thresholds.quality}
          onChange={(v) => updateThreshold("quality", v)}
          ocid="threshold-quality"
        />
        <SliderRow
          label="Delay"
          description="Late deliveries, lead time overruns, logistics failures"
          value={settings.thresholds.delay}
          onChange={(v) => updateThreshold("delay", v)}
          ocid="threshold-delay"
        />
        <SliderRow
          label="Failure"
          description="Equipment failures, supply interruptions, operational risk"
          value={settings.thresholds.failure}
          onChange={(v) => updateThreshold("failure", v)}
          ocid="threshold-failure"
        />
      </section>

      {/* Data Refresh Interval */}
      <section
        className="rounded border border-border bg-card p-4 space-y-3"
        data-ocid="refresh-section"
      >
        <div>
          <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-muted-foreground">
            Data Refresh Interval
          </p>
          <p className="text-[10px] text-muted-foreground/70 mt-0.5">
            How often the dashboard polls for updated risk scores and alerts.
          </p>
        </div>
        <Separator />
        <div className="flex items-center gap-2" data-ocid="refresh-selector">
          {REFRESH_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setDirty(true);
                setSettings((prev) => ({
                  ...prev,
                  refreshInterval: opt.value,
                }));
              }}
              className={`flex-1 py-2 text-xs font-medium rounded border transition-smooth ${
                settings.refreshInterval === opt.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/20 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }`}
              data-ocid={`refresh-${opt.value}s`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground/60">
          Current: polling every{" "}
          <span className="font-mono font-semibold text-foreground">
            {settings.refreshInterval}s
          </span>
          . Lower intervals improve real-time accuracy but increase network
          usage.
        </p>
      </section>

      {/* Notification Preferences */}
      <section
        className="rounded border border-border bg-card p-4 space-y-1"
        data-ocid="notifications-section"
      >
        <div className="mb-2">
          <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-muted-foreground">
            Notification Preferences
          </p>
          <p className="text-[10px] text-muted-foreground/70 mt-0.5">
            UI-level notification controls. Email delivery requires the email
            extension.
          </p>
        </div>
        <Separator className="mb-2" />
        <NotifRow
          id="emailAlerts"
          label="Risk Alert Notifications"
          description="Show in-app notifications when risk thresholds are breached"
          checked={settings.notifications.emailAlerts}
          onChange={(v) => updateNotif("emailAlerts", v)}
        />
        <Separator />
        <NotifRow
          id="highRiskOnly"
          label="High Risk Only"
          description="Suppress medium and low alerts — only surface critical risk events"
          checked={settings.notifications.highRiskOnly}
          onChange={(v) => updateNotif("highRiskOnly", v)}
        />
        <Separator />
        <NotifRow
          id="dailyDigest"
          label="Daily Portfolio Digest"
          description="Summarize portfolio risk changes at end of each business day"
          checked={settings.notifications.dailyDigest}
          onChange={(v) => updateNotif("dailyDigest", v)}
        />
        <Separator />
        <NotifRow
          id="simulationResults"
          label="Simulation Completion Alerts"
          description="Notify when a disruption simulation finishes computing results"
          checked={settings.notifications.simulationResults}
          onChange={(v) => updateNotif("simulationResults", v)}
        />
        <Separator />
        <NotifRow
          id="supplierChanges"
          label="Supplier Risk Category Changes"
          description="Alert when a supplier's risk tier changes (e.g. low → high)"
          checked={settings.notifications.supplierChanges}
          onChange={(v) => updateNotif("supplierChanges", v)}
        />
      </section>

      {/* System Info */}
      <section className="rounded border border-border bg-card p-4">
        <p className="text-[10px] font-mono font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          System
        </p>
        <div className="space-y-1.5 text-[10px] font-mono">
          {[
            ["Version", "1.0.0"],
            ["Build", "2026-04-10"],
            ["Risk Engine", "ML Composite v2 (Q×0.4 + D×0.35 + F×0.25)"],
            ["Active Interval", `${settings.refreshInterval}s`],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center gap-3">
              <span className="text-muted-foreground/60 w-32 shrink-0">
                {k}
              </span>
              <span className="text-muted-foreground">{v}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
