import {useQuery} from "@tanstack/react-query";
import {delay, events, groups, members, notifications, users} from "./model";
import {UserType} from "./UserAPI";
import {UploadImage} from "../utils/ImageUtils";
import {Reset} from "./AccountAPI";

export type Group = {
    id: string
    name: string
    icon?: string
    banner?: string
    /**
     * true if the user is the owner of group
     */
    owner: boolean
}

export type GroupDetail = Group & {
    memberCount: number,
    admins: Member[], //admins of the group
    membersPreview: Member[] //first 6 members of the group
    events: GroupEvent[]
}

export type Member = UserType & {
    role?: number
}

export type MentionNotification = {
    id: string
    type: "mention"
    author: Member
    url?: string
    date: Date
}

export type GroupNotification = MentionNotification

/**
 * Let group members join your Birthdays, parties, and more!
 */
export type GroupEvent = {
    id: number
    image?: string
    name: string
    description?: string
    startAt: Date
    endAt: Date
    place?: string
    group: string
    author: UserType
}

export function fetchGroup(id: string): Group {
    return groups.find(g => g.id === id)
}

export function fetchGroupDetail(id: string): GroupDetail {
    return {
        memberCount: members.length,
        admins: [members[0]],
        membersPreview: members,
        events: events,
        ...groups.find(g => g.id === id)
    }
}

export async function createGroupEvent(
    image: UploadImage | null,
    name: string,
    description: string | null,
    startAt: Date, endAt: Date,
    place: string | null,
    group: string,
) {
    await delay(3000)
}

export function fetchGroupNotifications(id: string): GroupNotification[] {
    return notifications
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

export async function clearGroupNotifications() {
    await delay(3000)
}

export function useGroupDetailQuery(id: string) {
    return useQuery(["group_detail", id], () => fetchGroupDetail(id))
}