import {User} from "./User";
import {RawGroupEvent} from "../GroupAPI";
import {toBannerUrl} from "../utils/Media";
import {Snowflake} from "../utils/types";

export type GroupEvent = {
    id: Snowflake
    imageUrl?: string
    name: string
    description?: string
    startAt: Date
    endAt?: Date
    place?: string
    group: string
    author: User
}

export function GroupEvent(raw: RawGroupEvent): GroupEvent {
    return {
        ...raw,
        imageUrl: toBannerUrl(raw.id, raw.imageHash),
        startAt: new Date(raw.startAt),
        endAt: new Date(raw.endAt),
        author: new User(raw.author)
    }
}