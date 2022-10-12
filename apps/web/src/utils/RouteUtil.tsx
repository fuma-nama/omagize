import { Location, matchRoutes, Route, useLocation } from 'react-router-dom';
import routes, { dynamicRoutes } from '../routes';
import React from 'react';

export function useActiveRoute<T extends IRoute>(routes: T[]): T | null {
  const location = useLocation();
  return getActiveRoute(location, routes);
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

  return [...routes.map(mapper), ...dynamicRoutes.map(mapper)];
}
