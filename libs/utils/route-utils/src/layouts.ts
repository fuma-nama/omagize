import { ReactNode, ReactElement } from 'react';
import { Location, matchRoutes } from 'react-router-dom';

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

export function getActiveLayout(location: Location, layoutes: RootLayout[]): NormalLayout | null {
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

export function getActiveSidebarItem(items: SidebarItem[], location: Location): SidebarItem | null {
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

export type NormalLayout = IndexRoute | NestedLayout;

export type NestedLayout = Layout & {
  path?: string;
  subLayouts?: NormalLayout[];
  index?: false;
};

export type IndexRoute = Layout & {
  index: true;
};

export type Layout = {
  component?: ReactNode;
  navbar?: ReactElement;
};

export type RootLayout = NormalLayout & {
  loggedIn: boolean;
};

export interface SidebarItem {
  name: string;
  icon?: JSX.Element;
  path: string;
}
