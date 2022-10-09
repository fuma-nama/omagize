import {Message} from "./MessageAPI";
import {RawUser} from "./UserAPI";
import {RawGroup, RawGroupEvent, RawMember} from "./GroupAPI";
import {GroupNotification} from "./types/Notifications";
import {Member} from "./types/Group";

export function delay(timeout: number) {
    return new Promise(re => {
        setTimeout(re, timeout)
    })
}

export const users: RawUser[] = [
    {
        id: "432423423432423",
        username: "MONEY",
        description: "Kane is a gay",
        createdAt: Date.now()
    },
    {
        id: "132423423432453",
        username: "Kane",
        createdAt: Date.now()
    }
]

export const notifications: GroupNotification[] = [
    {
        id: "43434343",
        type: "mention",
        author: new Member(users[0]),
        date: new Date(Date.now())
    }
]

export const members: RawMember[] = users.map(user => ({
    ...user
}))

export const groups: RawGroup[] = [
    {
        id: "54352234532456325433",
        name: "Study Group",
        iconHash: "https://img.duotegame.com/article/contents/2022/07/15/small_2022071554302800.jpg",
        bannerHash: "https://img.moelong.com/images/LycorisRecoiltwnews/LycorisRecoiltwnews09.webp",
        owner: users[0].id
    },
    {
        id: "5435234532456335333",
        name: "My Funny Chat Group",
        iconHash: "https://img.duotegame.com/article/contents/2022/07/15/small_2022071554302800.jpg",
        owner: users[0].id
    },
]
const modalMessages = [
    {
        author: new Member(members[0]),
        content: "It is normal",
        timestamp: new Date(Date.now())
    },
    {
        author: new Member(members[1]),
        content: "Kane is a gay",
        timestamp: new Date(Date.now())
    },
    {
        author: new Member(members[0]),
        content: "Oh, nice to meet you.\nI am a gay",
        timestamp: new Date(Date.now())
    }
]

export const messages: Message[] = [...Array(100)]
    .map((_, i) => ({
        id: i,
        ...modalMessages[Math.floor(Math.random() * modalMessages.length)]
    }))
    .map((m, i) => ({
        ...m,
        order_id: i,
        content: m.content + i
    })
)

const startDate = new Date(Date.now())
const endDate = new Date(Date.now())
endDate.setDate(endDate.getDate() + 1)

export const events: RawGroupEvent[] = [
    {
        id: 432,
        image: "https://img.moelong.com/images/LycorisRecoiltwnews/LycorisRecoiltwnews09.webp",
        name: "My Birthday",
        author: users[0],
        place: "Hong Kong",
        group: groups[0].id,
        startAt: startDate.getTime(),
        endAt: endDate.getTime()
    },
    {
        id: 433,
        image: "https://cdn.mos.cms.futurecdn.net/ZoSDiWzgFVGqSAKhtxJtaM.jpg",
        name: "Cyberpunk: Edgerunners Released",
        author: users[0],
        group: groups[0].id,
        startAt: startDate.getTime(),
        endAt: endDate.getTime()
    }
]