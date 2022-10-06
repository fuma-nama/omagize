import {api} from "./core";

export function toAvatarUrl(hash?: string | number): string | null {
    if (!!hash) {
        return `${api}/media/avatars/${hash}`
    } else {
        return null
    }
}

export function toBannerUrl(hash?: string | number): string | null {
    if (!!hash) {
        return `${api}/media/banners/${hash}`
    } else {
        return null
    }
}