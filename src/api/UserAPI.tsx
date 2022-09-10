import {useQuery} from "@tanstack/react-query";
import {users} from "./model";

export type UserType = {
    id: string
    username: string
    bannerUrl?: string
    avatarUrl?: string
    description?: string
}

export type SelfUser = UserType & {
    createdAt: Date
    email: string
}

export function fetchUser(): SelfUser {
    return {
        email: "xred379@gmail.com",
        createdAt: new Date(Date.now()),
        ...users[0]
    }
}

export function useUserQuery() {
    return useQuery(["user"], () => fetchUser())
}