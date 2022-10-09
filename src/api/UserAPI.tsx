import {useQuery} from "@tanstack/react-query";
import {delay, events, users} from "./model";
import {Reset, useLoginQuery} from "./AccountAPI";
import {DateObject, Snowflake} from "./utils/types";
import {callReturn, withDefaultForm} from "./utils/core";
import {SelfUser} from "./types/Auth";
import {FriendsData} from "./types/Friend";
import {GroupEvent} from "./types/GroupEvents";

export type RawUser = {
    id: Snowflake
    username: string
    bannerHash?: number
    avatarHash?: number
    description?: string
    createdAt: DateObject
}

export type RawFriend = RawUser
export type RawFriendRequest = {
    user: RawUser
    message?: string
}

export type RawFriendsData = {
    friends: RawFriend[],
    requests: RawFriendRequest[]
}

export type RawSelfUser = RawUser & {}

export async function updateProfile(name?: string, avatar?: Blob | Reset, banner?: Blob | Reset): Promise<SelfUser> {
    const data = new FormData()
    if (!!name) {
        data.append('name', name)
    }
    if (!!avatar) {
        data.append('avatar', avatar)
    }
    if (!!banner) {
        data.append('banner', banner)
    }

    return callReturn<RawSelfUser>("/user/profile", withDefaultForm({
        method: "POST",
        body: data,
    })).then(res =>
        new SelfUser(res)
    )
}

export function fetchGroupEvents(): GroupEvent[] {
    return events.map( e => GroupEvent(e))
}

export function fetchFriends(): FriendsData {
    return new FriendsData({
        friends: [
            ...users
        ],
        requests: [
            {
                user: users[0],
                message: "I seen you in Gay Party"
            }
        ]
    })
}

export async function sendFriendRequest(friendID: string) {
    if (friendID === "000000") throw new Error("Friend ID doesn't exist")
    await delay(2000)
}

export async function acceptFriendRequest(friendID: string) {
    await delay(2000)
}

export async function denyFriendRequest(friendID: string) {
    await delay(2000)
}

export function useSelfUser() {
    const query = useLoginQuery()

    if (query.isLoading) {
        throw "Client must login before accessing self user"
    }
    return query.data.user
}

export function useGroupEventsQuery() {
    return useQuery(
        ["all_group_event"],
        () => fetchGroupEvents()
    )
}

export function useFriendsQuery() {
    return useQuery(
        ["friends"],
        () => fetchFriends()
    )
}