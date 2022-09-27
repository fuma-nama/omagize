export const api = "http://localhost:8080"

export type ReturnOptions<T> = Options & {
    /**
     * Map result if status code is not equal to 200
     * You must disable errorOnFail first
     * @param status
     */
    allowed?: {
        [status: number]: (res: Response) => T
    }
}

export type Options = RequestInit & {
    /**
     * throw an error if status code is not equal to 200
     *
     * default: false
     */
    errorOnFail?: boolean
}

export async function call(url: string, init?: Options) {
    return fetch(`${api}${url}`, init).then(r => handle(r, init))
}

export async function callReturnText(url: string, init?: Options) {
    return call(url, init).then(res => res.text())
}

export async function callReturn<T>(url: string, init?: ReturnOptions<T>): Promise<T> {
    return call(url, init).then(res => mapResult<T>(res, init))
}

async function mapResult<T>(res: Response, options: ReturnOptions<T>): Promise<T> {
    if (!res.ok && options.allowed && options.allowed[res.status]) {
        return options.allowed[res.status](res)
    }

    return await res.json() as T
}

async function handle(res: Response, options: Options) {
    if (!res.ok && (options.errorOnFail ?? false)) {
        throw new Error(await res.text())
    }

    return res
}

export function withDefault<T extends Options>(options: T): T {
    return {
        credentials: "include",
        ...options,

        headers: {
            "Content-Type": "application/json",
            ...options.headers
        },
    }
}