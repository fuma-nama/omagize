import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import { ReactElement, ReactNode } from 'react';
import PageLayout from './layouts/PageLayout';
import ChatLayout from './layouts/chat';
import { Navigate } from 'react-router-dom';
import { AuthView, EmailVerifiedHandle } from '@omagize/views/auth';
import { GroupChatView, PrivateChatNavbar, PrivateChatView } from '@omagize/views/chat';
import { HomeView } from '@omagize/views/home';
import { MarketplaceView, MyAssets, MyAssetsNavbar } from '@omagize/views/marketplace';
import { ProfileView } from '@omagize/views/profile';
import { GroupNavbar, GroupOverview, GroupSettingsView } from '@omagize/views/group';

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
        component: <AuthView />,
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
            component: <PrivateChatView />,
            navbar: <PrivateChatNavbar />,
          },
          {
            path: ':group',
            component: <GroupChatView />,
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
            component: <HomeView />,
          },
          {
            path: 'explore',
            subLayouts: [
              {
                index: true,
                component: <MarketplaceView />,
              },
              {
                path: 'me',
                component: <MyAssets />,
                navbar: <MyAssetsNavbar />,
              },
            ],
          },
          {
            path: 'profile',
            component: <ProfileView />,
          },
          {
            path: ':group',
            subLayouts: [
              {
                index: true,
                navbar: <GroupNavbar isRoot />,
                component: <GroupOverview />,
              },
              {
                path: 'settings',
                component: <GroupSettingsView />,
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
  navbarLinks?: ReactNode;
  navbar?: ReactElement;
};

export type RootLayout = NormalLayout & {
  loggedIn: boolean;
};
