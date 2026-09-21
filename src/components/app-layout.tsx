import { BrandMark } from "@/components/brand-mark";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Glasses,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  Stethoscope,
  UsersRound,
  WalletCards,
  X,
} from "./icons";
import { clearAuthSession, getAuthToken, getCurrentUser } from "@/lib/app-data";

const navGroups = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard", to: "/", icon: LayoutDashboard },
      { label: "Patients", to: "/patients", icon: UsersRound },
      { label: "Today's visits", to: "/visits", icon: CalendarDays },
    ],
  },
  {
    label: "Shop management",
    items: [
      { label: "Medicines", to: "/medicines", icon: Package },
      { label: "Spectacle orders", to: "/spectacles", icon: Glasses },
      { label: "Payments", to: "/payments", icon: WalletCards },
      { label: "Reports", to: "/reports", icon: CircleDollarSign },
    ],
  },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const closeDrawer = () => setDrawerOpen(false);
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null);
  const [currentDate, setCurrentDate] = useState("");
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "DR";

  useEffect(() => {
    setUser(getCurrentUser());
    setCurrentDate(
      new Date().toLocaleDateString("en-GB", {
        timeZone: "Asia/Kolkata",
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    );
    const isAuthed = Boolean(getAuthToken());
    if (!isAuthed && location.pathname !== "/login") {
      navigate({ to: "/login" });
    }

    const handleSessionCleared = () => navigate({ to: "/login" });
    window.addEventListener("auth-session-cleared", handleSessionCleared);
    return () => window.removeEventListener("auth-session-cleared", handleSessionCleared);
  }, [location.pathname, navigate]);

  const logout = () => {
    clearAuthSession();
  };

  return (
    <div className="app-shell flex">
      {drawerOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-ink/30 md:hidden"
          onClick={closeDrawer}
        />
      )}
      <aside
        className={`app-sidebar fixed inset-y-0 left-0 z-40 flex flex-col px-3 py-4 transition-transform md:static md:translate-x-0 ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-8 flex items-center justify-between px-3">
          <Link to="/" className="flex items-center gap-3" onClick={closeDrawer}>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BrandMark />
            </span>
            <span>
              <span className="block text-sm font-extrabold text-ink">Chirag</span>
              <span className="block text-[10px] font-semibold text-muted-foreground">
                EYE CARE & OPTICS
              </span>
            </span>
          </Link>
          <button
            className="btn-ghost mobile-only"
            onClick={closeDrawer}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 space-y-6" aria-label="Main navigation">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="eyebrow mb-2 px-3">{group.label}</p>
              <div className="space-y-1">
                {group.items.map(({ label, to, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    activeOptions={{ exact: to === "/" }}
                    data-active={
                      location.pathname === to || (to !== "/" && location.pathname.startsWith(to))
                    }
                    className="nav-item"
                    onClick={closeDrawer}
                  >
                    <Icon size={18} strokeWidth={1.8} />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-border pt-3">
          <Link
            to="/settings"
            data-active={location.pathname.startsWith("/settings")}
            className="nav-item"
            onClick={closeDrawer}
          >
            <Settings size={18} strokeWidth={1.8} />
            <span>Settings</span>
          </Link>
          <div className="mt-3 flex items-center gap-3 rounded-lg bg-surface-soft p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-blue text-sm font-bold text-info">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-ink">{user?.name || "Doctor"}</p>
              <p className="truncate text-[11px] text-muted-foreground">Owner account</p>
            </div>
            <button aria-label="Log out" title="Log out" className="btn-ghost p-1" onClick={logout}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
      <div className="app-content flex min-h-screen flex-1 flex-col">
        <header className="flex h-[68px] items-center justify-between border-b border-border bg-card px-4 md:px-8">
          <button
            className="btn-ghost md:hidden"
            aria-label="Open navigation"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={21} />
          </button>
          <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
            <Stethoscope size={17} className="text-info" />
            <span>Good care starts with a clear view.</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              className="relative rounded-md p-2 text-muted-foreground hover:bg-accent"
              aria-label="Notifications"
            >
              <Bell size={19} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-danger" />
            </button>
            <div className="hidden h-6 w-px bg-border sm:block" />
            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold text-ink">{user?.name || "Doctor"}</p>
              <p className="text-[11px] text-muted-foreground">{currentDate}</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {initials}
            </div>
            <button aria-label="Log out" title="Log out" className="btn-ghost p-2" onClick={logout}>
              <LogOut size={17} />
            </button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1440px] flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export function InlineLink({
  to,
  children,
}: {
  to: "/patients" | "/visits" | "/reports";
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 text-sm font-bold text-info hover:underline"
    >
      {children}
      <ChevronRight size={15} />
    </Link>
  );
}
