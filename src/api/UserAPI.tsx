import {useQuery} from "@tanstack/react-query";
import {delay, events, groups, notifications, users} from "./model";
import {Reset} from "./AccountAPI";
import {GroupEvent, GroupNotification} from "./GroupAPI";

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

export function fetchUser(): SelfUser {
    return {
        email: "xred379@gmail.com",
        createdAt: new Date(Date.now()),
        ...users[0]
    }
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

export function useUserQuery() {
    return useQuery(["user"], () => fetchUser())
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