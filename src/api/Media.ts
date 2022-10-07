import {api} from "./core";
import {UserType} from "./UserAPI";

export type ParsedUser = {
    bannerUrl?: string
    avatarUrl?: string
}

enum MediaType {
    Banner = "banners", Avatars = "avatars"
}

export function toAvatarUrl(hash?: string | number): string | null {
    return asUrl(MediaType.Avatars, hash)
}

export function toBannerUrl(hash?: string | number): string | null {
    return asUrl(MediaType.Banner, hash)
}

export function asUrl(type: MediaType, hash?: string | number): string | null {
    if (!!hash) {
        return `${api}/media/${type}/${hash}.webp`
    } else {
        return null
    }
}

export function withUrls<T extends UserType>(raw: T): T & ParsedUser {
    return {
        ...raw,
        avatarUrl: toAvatarUrl(raw.avatarHash),
        bannerUrl: toBannerUrl(raw.bannerHash)
    }
}