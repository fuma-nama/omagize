import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import {ReactNode} from "react";

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
        requireLogin: true
    }
]

type LayoutType = {
    path: string
    component: ReactNode
    index?: string
    default?: string
    requireLogin: boolean
}