import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import { ReactNode } from 'react';
import SidebarLayout from './layouts/SidebarLayout';
import ChatLayout from './layouts/chat';
import { Navigate } from 'react-router-dom';

export const layouts: RootLayout[] = [
  {
    type: 'auto',
    path: '/auth',
    component: <AuthLayout />,
    index: '/auth/signin',
    requireLogin: false,
  },
  {
    type: 'normal',
    path: '/user',
    component: <SidebarLayout />,
    subLayouts: [
      {
        index: true,
        component: <Navigate to="/user/default" />,
      },
      {
        path: 'chat',
        component: <ChatLayout />,
        routes: '/user/chat',
      },
      {
        path: '*',
        component: <AdminLayout />,
        routes: '/user',
      },
    ],
    requireLogin: true,
  },
];

export type NormalLayout =
  | (IndexRoute & { index: true })
  | (NestedLayout & { index?: false });

export type NestedLayout = {
  path?: string;
  component: ReactNode;
  subLayouts?: NormalLayout[];
  routes?: string;
};

export type IndexRoute = {
  path?: string;
  component: ReactNode;
};

export type AutoLayout = {
  path: string;
  component: ReactNode;
  index?: string;
  default?: string;
  requireLogin: boolean;
};

export type RootLayout = LayoutType & {
  requireLogin: boolean;
};

export type LayoutType =
  | (AutoLayout & { type: 'auto' })
  | (NormalLayout & { type: 'normal' });
