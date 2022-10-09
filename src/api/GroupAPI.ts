import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {delay, events, groups, members, notifications} from "./model";
import {UserType} from "./UserAPI";
import {UploadImage} from "../utils/ImageUtils";
import {callReturn, withDefault, withDefaultForm} from "./utils/core";
import {Snowflake} from "./utils/types";
import {fetchMessagesBefore, fetchMessagesLatest} from "./MessageAPI";

export type Group = {
    id: Snowflake
    name: string
    iconHash?: string
    bannerHash?: string
    /**
     * true if the user is the owner of group
     */
    owner: boolean
}

export type GroupDetail = Group & {
    memberCount: number,
    admins: Member[], //admins of the group
    events: GroupEvent[],
    /**
     * What does this group about
     */
    introduction?: string
}

export type Member = UserType & {
    role?: number
}

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

export function fetchGroup(id: Snowflake): Group {
    return groups.find(g => g.id === id)
}

export function fetchGroupDetail(id: Snowflake): GroupDetail {
    return {
        memberCount: members.length,
        admins: [members[0]],
        events: events,
        introduction: "A friend Community about Games and Anime\nCreated by MONEY",
        ...groups.find(g => g.id === id)
    }
}

/**
 * Fetch group members starting from specified user
 *
 * @param start
 * @param limit
 */
export function fetchGroupMembers(start: Snowflake | null, limit: number = 10): Member[] {
    return members
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

export function fetchGroups() {
    return callReturn<Group[]>("/groups", withDefault({
        method: "GET"
    }))
}

export async function createGroup(name: string, icon?: UploadImage, banner?: UploadImage) {
    const data = new FormData()
    data.append("name", name)
    if (!!icon) data.append("icon", icon)
    if (!!banner) data.append("banner", banner)

    return callReturn<Group>("/groups", withDefaultForm({
        method: "POST",
        body: data
    }))
}

export function useGroupsQuery() {
    return useQuery(["groups"], () => fetchGroups())
}

export function useGroupMembersQuery(group: Snowflake) {
    return useInfiniteQuery(
        ["groups", group],
        ({ pageParam }) => fetchGroupMembers(pageParam), {
            getPreviousPageParam: (first) => first[0]?.id,
            getNextPageParam: (lastPage) => lastPage[0]?.id
    })
}

export function useGroupQuery(id: string) {
    return useQuery(["group", id], () => fetchGroup(id))
}

export function useGroupDetailQuery(id: string) {
    return useQuery(["group_detail", id], () => fetchGroupDetail(id))
}