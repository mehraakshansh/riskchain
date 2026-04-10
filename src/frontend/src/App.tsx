import { Layout } from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const DashboardPage = lazy(() => import("@/pages/Dashboard"));
const SuppliersPage = lazy(() => import("@/pages/Suppliers"));
const NetworkPage = lazy(() => import("@/pages/Network"));
const SimulatorPage = lazy(() => import("@/pages/Simulator"));
const ReportsPage = lazy(() => import("@/pages/Reports"));
const SettingsPage = lazy(() => import("@/pages/Settings"));

function PageLoader() {
  return (
    <div className="space-y-3 p-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-4 gap-3">
        {["a", "b", "c", "d"].map((k) => (
          <Skeleton key={k} className="h-20" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster />
    </>
  ),
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: Layout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <DashboardPage />
    </Suspense>
  ),
});

const suppliersRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/suppliers",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <SuppliersPage />
    </Suspense>
  ),
});

const networkRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/network",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <NetworkPage />
    </Suspense>
  ),
});

const simulatorRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/simulator",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <SimulatorPage />
    </Suspense>
  ),
});

const reportsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/reports",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ReportsPage />
    </Suspense>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/settings",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <SettingsPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    dashboardRoute,
    suppliersRoute,
    networkRoute,
    simulatorRoute,
    reportsRoute,
    settingsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
