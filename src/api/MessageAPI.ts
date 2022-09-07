import {Member} from "./GroupAPI";
import {messages} from "./model";

export type Message = {
    id: number
    author: Member
    content: string
    timestamp: Date
    order_id: number
}

export function fetchMessages(groupID: string, offset: number): Message[] {
    const start = messages.length - offset - 1
    return messages.slice(start - 20, start)
}

export function fetchMessagesLatest(groupID: string, limit: number = 20): Message[] {
    console.log("latest", messages.slice(messages.length - limit - 1, messages.length))
    return messages.slice(messages.length - limit - 1)
}

/**
 * Find messages sent before the specified message
 */
export function fetchMessagesBefore(groupID: string, message: Message, limit: number = 20): Message[] {
    console.log("before", message)
    const fetched = messages.filter(m => m.order_id < message.order_id)

    return fetched.slice(fetched.length - limit - 1)
}