import {Message} from "./MessageAPI";
import {UserType} from "./UserAPI";
import {Group, GroupEvent, GroupNotification, Member} from "./GroupAPI";

export function delay(timeout: number) {
    return new Promise(re => {
        setTimeout(re, timeout)
    })
}

export const users: UserType[] = [
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
        author: users[0],
        date: new Date(Date.now())
    }
]

export const members: Member[] = users.map(user => ({
    ...user
}))

export const groups: Group[] = [
    {
        id: "54352234532456325433",
        name: "Study Group",
        icon: "https://img.duotegame.com/article/contents/2022/07/15/small_2022071554302800.jpg",
        banner: "https://img.moelong.com/images/LycorisRecoiltwnews/LycorisRecoiltwnews09.webp",
        owner: true
    },
    {
        id: "5435234532456335333",
        name: "My Funny Chat Group",
        icon: "https://img.duotegame.com/article/contents/2022/07/15/small_2022071554302800.jpg",
        owner: false
    },
]
const modalMessages = [
    {
        author: members[0],
        content: "It is normal",
        timestamp: new Date(Date.now())
    },
    {
        author: members[1],
        content: "Kane is a gay",
        timestamp: new Date(Date.now())
    },
    {
        author: members[0],
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

export const events: GroupEvent[] = [
    {
        id: 432,
        image: "https://img.moelong.com/images/LycorisRecoiltwnews/LycorisRecoiltwnews09.webp",
        name: "My Birthday",
        author: users[0],
        place: "Hong Kong",
        group: groups[0].id,
        startAt: startDate,
        endAt: endDate
    },
    {
        id: 433,
        image: "https://cdn.mos.cms.futurecdn.net/ZoSDiWzgFVGqSAKhtxJtaM.jpg",
        name: "Cyberpunk: Edgerunners Released",
        author: users[0],
        group: groups[0].id,
        startAt: startDate,
        endAt: endDate
    }
]