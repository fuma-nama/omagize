import {useQuery} from "@tanstack/react-query";
import {users} from "./model";

export type UserType = {
    id: string
    username: string
    bannerUrl?: string
    avatarUrl?: string
    description?: string
}

export function fetchUser(): UserType {
    return users[0]
}

export function useUserQuery() {
    return useQuery(["user"], () => fetchUser())
}