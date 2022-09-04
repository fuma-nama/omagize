import {useQuery} from "@tanstack/react-query";
import {groups} from "./model";

export type Group = {
    id: string
    name: string
    icon?: string
    banner?: string
}

export function fetchGroup(id: string): Group {
    return groups.find(g => g.id === id)
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