import {RawGroup, RawGroupDetail, RawGroupEvent, RawMember} from "../GroupAPI";
import {Snowflake} from "../utils/types";
import {toBannerUrl, toIconUrl} from "../utils/Media";
import {User} from "./User";
import {GroupEvent} from "./GroupEvents";

export type Group = {
    id: Snowflake
    name: string
    iconHash?: string
    bannerHash?: string
    /**
     * true if the user is the owner of group
     */
    owner: Snowflake

    iconUrl?: string
    bannerUrl?: string
}

export function Group(raw: RawGroup): Group {
    return {
        ...raw,
        iconUrl: toIconUrl(raw.id, raw.iconHash),
        bannerUrl: toBannerUrl(raw.id, raw.bannerHash)
    }
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

export function GroupDetail(raw: RawGroupDetail): GroupDetail {
    return {
        ...Group(raw),
        admins: raw.admins.map(r => new Member(r)),
        events: raw.events.map(e => GroupEvent(e)),
        memberCount: raw.memberCount,
        introduction: raw.introduction
    }
}

export class Member extends User {
    constructor(raw: RawMember) {
        super(raw);
    }
}
