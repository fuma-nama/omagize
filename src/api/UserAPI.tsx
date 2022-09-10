import {useQuery} from "@tanstack/react-query";
import {delay, users} from "./model";
import {Reset} from "./AccountAPI";

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

export async function updateProfile(name?: string, avatar?: File | Reset, banner?: File | Reset): Promise<SelfUser> {
    await delay(2000)
    return {
        ...fetchUser(),
        username: name,
    }
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