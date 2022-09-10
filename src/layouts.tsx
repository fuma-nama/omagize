import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import {ReactNode} from "react";
import SidebarLayout from "./layouts/SidebarLayout";
import ChatLayout from "./layouts/chat";
import {Navigate} from "react-router-dom";

export const layouts: RootLayout[] = [
    {
        type: 'auto',
        path: "/auth",
        component: <AuthLayout />,
        index: "/auth/signin",
        requireLogin: false
    },
    {
        type: 'normal',
        path: '/user',
        component: <SidebarLayout />,
        subLayouts: [
            {
                index: true,
                component: <Navigate to='/user/default' />,
            },
            {
                path: 'chat',
                component: <ChatLayout />,
                routes: '/user/chat'
            },
            {
                path: '*',
                component: <AdminLayout />,
                routes: '/user'
            }
        ],
        requireLogin: true
    }
]


export type NestedLayout = {
    index?: boolean
    path?: string
    component: ReactNode
    subLayouts?: NestedLayout[]
    routes?: string
}

export type AutoLayout = {
    path: string
    component: ReactNode
    index?: string
    default?: string
    requireLogin: boolean
}

export type RootLayout = LayoutType & {
    requireLogin: boolean
}

export type LayoutType =
    AutoLayout & { type: 'auto' }
    | NestedLayout & { type: 'normal' }