import { Location, matchRoutes, useLocation } from 'react-router-dom';
import items from '../sidebar';
import { NormalLayout, RootLayout } from 'layouts';

export function useActiveSidebarItem(): SidebarItem | null {
  const location = useLocation();
  return getActiveSidebarItem(location);
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

  if (matches == null || matches.length === 0) return null;

  return matches[matches.length - 1].route.layout;
}

export function getActiveSidebarItem(location: Location): SidebarItem | null {
  const matches = matchRoutes(
    items.map((item) => ({
      item,
      path: item.path,
    })),
    location.pathname
  );
  if (matches == null || matches.length === 0) return null;

  return matches[matches.length - 1].route.item;
}
