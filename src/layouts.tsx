import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import {ReactNode} from "react";
import ChatLayout from "./layouts/chat";

export const layouts: LayoutType[] = [
    {
        path: "/auth",
        component: <AuthLayout />,
        index: "/auth/signin",
        requireLogin: false
    },
    {
        path: "/user",
        component: <AdminLayout />,
        index: "/user/default",
        requireLogin: true,
    },
    {
        path: "/chat",
        component: <ChatLayout />,
        requireLogin: true
    }
]

export type LayoutType = {
    path: string
    component: ReactNode
    index?: string
    default?: string
    requireLogin: boolean
}