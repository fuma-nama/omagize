import {useQuery} from "@tanstack/react-query";
import {delay, events, groups, notifications, users} from "./model";
import {Reset, useLoginQuery} from "./AccountAPI";
import {GroupEvent, GroupNotification} from "./GroupAPI";
import {DateObject} from "./CustomTypes";
import {callReturn, withDefault, withDefaultForm} from "./core";

export type UserNotification = GroupNotification & { group: string } | LoginNotification
export type LoginNotification = {
    id: string
    type: 'login'
    time: Date
    from: string //from ip address
}

export type UserType = {
    id: string
    username: string
    bannerUrl?: string
    avatarUrl?: string
    description?: string
    createdAt: DateObject
}

export type Friend = UserType
export type FriendRequest = {
    user: UserType
    message?: string
}

export type FriendsData = {
    friends: Friend[],
    requests: FriendRequest[]
}

export type SelfUser = UserType & {}

export async function updateProfile(current: SelfUser, name?: string, avatar?: Blob | Reset, banner?: Blob | Reset): Promise<SelfUser> {
    const data = new FormData()
    if (!!name) {
        data.append('name', name)
    }
    if (!!avatar) {
        console.log(avatar)
        data.append('avatar', avatar)
    }
    if (!!banner) {
        data.append('banner', banner)
    }

    return callReturn<SelfUser>("/user/profile", withDefaultForm({
        method: "POST",
        body: data,
    }))
}

export function fetchUserNotifications(): UserNotification[] {
    return [
        ...notifications.map(n => ({
            ...n,
            group: groups[0].id
        })),
        {
            id: "32423432",
            type: "login",
            time: new Date(Date.now()),
            from: "Hong Kong"
        }
    ]
}

export async function clearUserNotifications() {
    await delay(2000)
}

export function fetchGroupEvents(): GroupEvent[] {
    return events
}

export function fetchFriends(): FriendsData {
    return {
        friends: [
            ...users
        ],
        requests: [
            {
                user: users[0],
                message: "I seen you in Gay Party"
            }
        ]
    }
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

export function useUserNotificationsQuery() {
    return useQuery(
        ["user_notifications"],
        () => fetchUserNotifications()
    )
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