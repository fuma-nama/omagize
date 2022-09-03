import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import {ReactNode} from "react";

export const layouts: LayoutType[] = [
    {
        path: "/auth",
        component: <AuthLayout />,
        index: "/auth/sign-in/default"
    },
    {
        path: "/admin",
        component: <AdminLayout />,
        index: "/admin/default"
    }
]

type LayoutType = {
    path: string
    component: ReactNode
    index?: string
    default?: string
}