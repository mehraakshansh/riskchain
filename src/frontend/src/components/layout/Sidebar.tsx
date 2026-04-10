import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  FileBarChart2,
  FlaskConical,
  LayoutDashboard,
  Network,
  Settings,
  Users,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/suppliers", label: "Suppliers", icon: Users },
  { to: "/network", label: "Network", icon: Network },
  { to: "/simulator", label: "Simulator", icon: FlaskConical },
  { to: "/reports", label: "Reports", icon: FileBarChart2 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      data-ocid="sidebar"
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200 shrink-0 h-full",
        collapsed ? "w-12" : "w-48",
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center border-b border-sidebar-border h-12 shrink-0 px-3 gap-2",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <Activity className="text-primary shrink-0" size={14} />
            <span className="text-xs font-mono font-bold text-foreground tracking-wider truncate">
              SCRI
            </span>
          </div>
        )}
        {collapsed && <Activity className="text-primary" size={14} />}
        <button
          type="button"
          onClick={onToggle}
          data-ocid="sidebar-toggle"
          className="text-muted-foreground hover:text-foreground transition-colors p-0.5 shrink-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            data-ocid={`nav-${label.toLowerCase()}`}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-xs font-mono text-sidebar-foreground",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
              "border-l-2 border-transparent",
              collapsed && "justify-center",
            )}
            activeProps={{
              className:
                "border-l-primary text-primary bg-sidebar-accent !border-l-2 border-l-[oklch(0.75_0.15_190)]",
            }}
            title={collapsed ? label : undefined}
          >
            <Icon size={14} className="shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div
        className={cn(
          "border-t border-sidebar-border p-3",
          collapsed ? "flex justify-center" : "",
        )}
      >
        {!collapsed && (
          <p className="text-[9px] font-mono text-muted-foreground/50 uppercase tracking-widest">
            v1.0.0
          </p>
        )}
      </div>
    </aside>
  );
}
