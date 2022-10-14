import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import { ReactNode } from 'react';
import SidebarLayout from './layouts/SidebarLayout';
import ChatLayout from './layouts/chat';
import { Navigate } from 'react-router-dom';
import GroupOverview from 'views/admin/group';
import GroupSettings from 'views/admin/group/settings';
import GroupChat from 'views/admin/chat/group/GroupChat';
import GroupNavbar from 'views/admin/chat/navbar/GroupNavbar';
import SignInCentered from 'views/auth/signIn';
import SignUp from './views/auth/signup';

export const layouts: RootLayout[] = [
  {
    path: '/auth',
    component: <AuthLayout />,
    subLayouts: [
      {
        index: true,
        component: <Navigate to="/auth/signin" />,
      },
      {
        path: 'signin',
        component: <SignInCentered />,
      },
      {
        path: 'signup',
        component: <SignUp />,
      },
    ],
    requireLogin: false,
  },
  {
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
        subLayouts: [
          {
            path: ':group',
            component: <GroupChat />,
            navbar: <GroupNavbar />,
          },
        ],
      },
      {
        path: ':group',
        subLayouts: [
          {
            index: true,
            component: <GroupOverview />,
          },
          {
            path: 'settings',
            component: <GroupSettings />,
          },
        ],
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

export type NormalLayout = IndexRoute | NestedLayout;

export type NestedLayout = Layout & {
  path?: string;
  subLayouts?: NormalLayout[];
  routes?: string;
  index?: false;
};

export type IndexRoute = Layout & {
  index: true;
};

export type Layout = {
  component?: ReactNode;
  navbar?: ReactNode;
};

export type RootLayout = NormalLayout & {
  requireLogin: boolean;
};
