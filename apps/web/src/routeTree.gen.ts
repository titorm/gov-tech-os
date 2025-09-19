// @ts-nocheck

// Minimal, valid generated file for TanStack Router. Keep this file small and
// syntactically correct. Ideally the generator should produce this directly.

import { Route as rootRouteImport } from './routes/__root';
import { Route as DashboardRouteImport } from './routes/dashboard';
import { Route as AboutRouteImport } from './routes/about';
import { Route as IndexRouteImport } from './routes/index';

const DashboardRoute = (DashboardRouteImport as any).update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => rootRouteImport as any,
} as any);

const AboutRoute = (AboutRouteImport as any).update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRouteImport as any,
} as any);

const IndexRoute = (IndexRouteImport as any).update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport as any,
} as any);

const rootRouteChildren = {
  IndexRoute,
  AboutRoute,
  DashboardRoute,
} as const;

export const routeTree = (rootRouteImport as any)._addFileChildren(rootRouteChildren) as any;
