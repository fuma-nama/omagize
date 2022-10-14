import { Location, matchRoutes, Route, useLocation } from 'react-router-dom';
import routes from '../routes';
import React from 'react';
import { NormalLayout, RootLayout } from 'layouts';

export function useActiveRoute<T extends IRoute>(routes: T[]): T | null {
  const location = useLocation();
  return getActiveRoute(location, routes);
}

type MatchRoute = (
  | {
      index?: false;
      path?: string;
      children?: MatchRoute[];
    }
  | {
      index: true;
    }
) & {
  layout: NormalLayout;
};

export function getActiveLayout(
  location: Location,
  layoutes: RootLayout[]
): NormalLayout | null {
  function map(layout: NormalLayout): MatchRoute {
    if (layout.index === true) {
      return {
        layout: layout,
        index: true,
      };
    } else {
      return {
        layout: layout,
        path: layout.path,
        children: layout.subLayouts?.map((c) => map(c)),
      };
    }
  }

  const routes = layoutes.map((layout) => map(layout));
  const matches = matchRoutes(routes, location.pathname);

  console.log(matches);
  if (matches == null || matches.length === 0) return null;

  return matches[matches.length - 1].route.layout;
}

export function getActiveRoute<T extends IRoute>(
  location: Location,
  routes: T[]
): T | null {
  const matches = matchRoutes(
    routes.map((route) => ({
      path: route.layout + route.path,
    })),
    location.pathname
  );
  if (matches == null) return null;

  return routes.find((route) =>
    matches.some((match) => match.route.path === route.layout + route.path)
  );
}

export function getRoutesByLayout(layout: string): any {
  const mapper = (route: IRoute, key: number) => {
    if (route.layout === layout) {
      return (
        <Route
          path={route.path.substring(1)}
          element={route.component}
          key={key}
        />
      );
    } else {
      return null;
    }
  };

  return routes.map(mapper);
}
