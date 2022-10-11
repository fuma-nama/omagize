import {Member} from "./Group";
import {RawNotification} from "../NotificationsAPI";

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

//function GroupNotification(raw: RawNotification): UserNotification {}
