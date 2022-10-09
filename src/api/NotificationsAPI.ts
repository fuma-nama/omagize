import {delay, groups, notifications} from "./model";
import {Member} from "./GroupAPI";
import {useQuery} from "@tanstack/react-query";

export type MentionNotification = {
    id: string
    type: "mention"
    author: Member
    url?: string
    date: Date
}

export type GroupNotification = MentionNotification

export type UserNotification = GroupNotification & { group: string } | LoginNotification
export type LoginNotification = {
    id: string
    type: 'login'
    time: Date
    from: string //from ip address
}

export function fetchGroupNotifications(id: string): GroupNotification[] {
    return notifications
}

export function useGroupNotificationsQuery(id: string) {
    return useQuery(["group_notifications", id], () => fetchGroupNotifications(id))
}

export async function clearGroupNotifications() {
    await delay(3000)
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

export function useUserNotificationsQuery() {
    return useQuery(
        ["user_notifications"],
        () => fetchUserNotifications()
    )
}

export async function clearUserNotifications() {
    await delay(2000)
}