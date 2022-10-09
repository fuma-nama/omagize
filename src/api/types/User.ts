import {Snowflake} from "../utils/types";
import {RawUser} from "../UserAPI";
import {toAvatarUrl, toBannerUrl} from "../utils/Media";

export class User {
    id: Snowflake
    username: string
    bannerHash?: number
    avatarHash?: number
    description?: string
    createdAt: Date

    avatarUrl?: string
    bannerUrl?: string

    constructor(raw: RawUser) {
        this.id = raw.id
        this.username = raw.username
        this.bannerHash = raw.bannerHash
        this.avatarHash = raw.avatarHash
        this.description = raw.description
        this.createdAt = new Date(raw.createdAt)

        this.avatarUrl = toAvatarUrl(this.id, this.avatarHash)
        this.bannerUrl = toBannerUrl(this.id, this.bannerHash)
    }
}

