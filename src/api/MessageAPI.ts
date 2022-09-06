import {Member} from "./GroupAPI";

export type Message = {
    id: number
    author: Member
    content: string
    timestamp: Date
}

export function fetchMessages(offset: number): Message[] {
    return [
        {
            id: 43243243,
            author: {
                id: "43242332",
                username: "Kane"
            },
            content: "I am a Gay!",
            timestamp: new Date(Date.now())
        }
    ]
}