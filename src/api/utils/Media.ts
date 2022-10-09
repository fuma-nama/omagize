import {api} from "./core";
import {Snowflake} from "./types";

enum MediaType {
    Banner = "banners", Avatars = "avatars", Icons = "icons"
}

export function toAvatarUrl(user: Snowflake, hash?: string | number): string | null {
    return asUrl(MediaType.Avatars, user, hash)
}

export function toIconUrl(group: Snowflake, hash?: string | number): string | null {
    return asUrl(MediaType.Icons, group, hash)
}

export function toBannerUrl(userOrGroup: Snowflake, hash?: string | number): string | null {
    return asUrl(MediaType.Banner, userOrGroup, hash)
}

export function asUrl(type: MediaType, id: Snowflake, hash?: string | number): string | null {
    if (!!hash) {
        return `${api}/media/${type}/${id}/${hash}.webp`
    } else {
        return null
    }
}