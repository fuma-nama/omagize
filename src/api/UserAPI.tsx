import {useQuery} from "@tanstack/react-query";

export type UserType = {
    id: string
    username: string
    bannerUrl?: string
    avatarUrl?: string
}

export function fetchUser(): UserType {
    return {
        id: "432423423432423",
        username: "MONEY",
        avatarUrl: "https://img.duotegame.com/article/contents/2022/07/15/small_2022071554302800.jpg",
        bannerUrl: "https://img.moelong.com/images/LycorisRecoiltwnews/LycorisRecoiltwnews09.webp"
    }
}

export function useUserQuery() {
    return useQuery(["user"], () => fetchUser())
}