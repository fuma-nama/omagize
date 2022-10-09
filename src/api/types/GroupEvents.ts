import {User} from "./User";
import {RawGroupEvent} from "../GroupAPI";

export type GroupEvent = {
    id: number
    image?: string
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
        startAt: new Date(raw.startAt),
        endAt: new Date(raw.endAt),
        author: new User(raw.author)
    }
}