import {useQuery} from "@tanstack/react-query";
import {groups} from "./model";

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

export type Member = {
    id: string
    username: string
    avatar?: string
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
        memberCount: 2,
        activeMembers: [
            {
                id: "4324232344324543",
                username: "MONEY",
                avatar: "https://img.duotegame.com/article/contents/2022/07/15/small_2022071554302800.jpg",
            },
            {
                id: "4324232344324443",
                username: "Kane",
            }
        ],
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