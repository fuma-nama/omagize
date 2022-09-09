import {useQuery} from "@tanstack/react-query";
import {delay, groups, members} from "./model";
import {UserType} from "./UserAPI";

export type Group = {
    id: string
    name: string
    icon?: string
    banner?: string
}

export type GroupDetail = Group & {
    memberCount: number,
    activeMembers: Member[] //Should be always a 5-length array
}

export type Member = UserType & {
    role?: number
}

export type MentionNotification = {
    type: "mention"
    author: Member
    url?: string
    date: Date
}

export type GroupNotification = MentionNotification

export function fetchGroup(id: string): Group {
    return groups.find(g => g.id === id)
}

export function fetchGroupDetail(id: string): GroupDetail {
    return {
        memberCount: members.length,
        activeMembers: members,
        ...groups.find(g => g.id === id)
    }
}

export function fetchGroupNotifications(id: string): GroupNotification[] {
    return [
        {
            type: "mention",
            author: {
                id: "4324232344324543",
                username: "MONEY",
            },
            date: new Date(Date.now())
        }
    ]
}

export function fetchGroups(): Group[] {
    return groups
}

export async function createGroup(name: string, icon?: File, banner?: File) {
    await delay(3000)
}

export function useGroupsQuery() {
    return useQuery(["groups"], () => fetchGroups())
}

export function useGroupQuery(id: string) {
    return useQuery(["group", id], () => fetchGroup(id))
}

export function useGroupNotificationsQuery(id: string) {
    return useQuery(["group_notifications", id], () => fetchGroupNotifications(id))
}

export function useGroupDetailQuery(id: string) {
    return useQuery(["group_detail", id], () => fetchGroupDetail(id))
}