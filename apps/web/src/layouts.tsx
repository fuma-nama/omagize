import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import { ReactNode } from 'react';
import PageLayout from './layouts/PageLayout';
import ChatLayout from './layouts/chat';
import { Navigate } from 'react-router-dom';
import GroupOverview from 'views/admin/group';
import GroupSettings from 'views/admin/group/settings';
import GroupChat from 'views/admin/chat/group/GroupChat';
import GroupNavbar from 'views/admin/group/navbar/GroupNavbar';
import SignIn from './views/auth';
import MainDashboard from 'views/admin/default';
import NFTMarketplace from 'views/admin/marketplace';
import Profile from 'views/admin/profile';
import { EmailVerifiedHandle } from 'views/auth/signup/verify';
import PrivateChat from 'views/admin/chat/dm/PrivateChat';

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
        component: <SignIn />,
      },
      {
        path: 'verified',
        component: <EmailVerifiedHandle />,
      },
    ],
    loggedIn: false,
  },
  {
    path: '/user',
    component: <PageLayout />,
    subLayouts: [
      {
        index: true,
        component: <Navigate to="/user/home" />,
      },
      {
        path: 'chat',
        component: <ChatLayout />,
        subLayouts: [
          {
            path: 'users/:user',
            component: <PrivateChat />,
          },
          {
            path: ':group',
            component: <GroupChat />,
            navbar: <GroupNavbar />,
          },
        ],
      },
      {
        path: '*',
        component: <AdminLayout />,
        subLayouts: [
          {
            path: 'home',
            component: <MainDashboard />,
          },
          {
            path: 'explore',
            component: <NFTMarketplace />,
          },
          {
            path: 'profile',
            component: <Profile />,
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
                navbar: <GroupNavbar />,
              },
            ],
          },
        ],
      },
    ],
    loggedIn: true,
  },
];

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
  navbar?: ReactNode;
};

export type RootLayout = NormalLayout & {
  loggedIn: boolean;
};
