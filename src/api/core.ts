export const api = "http://localhost:8080"

type Options = RequestInit & {
    /**
     * throw an error if status code is not equal to 200
     *
     * default: true
     */
    errorOnFail?: boolean
}

export async function call(url: string, init?: Options) {
    return fetch(`${api}${url}`, init).then(r => handle(r, init))
}

export async function callReturnText(url: string, init?: Options) {
    return call(url, init).then(res => res.text())
}

export async function callReturn<T>(url: string, init?: Options): Promise<T> {
    return call(url, init).then(res => res.json())
}

async function handle(res: Response, options: Options) {
    if (!res.ok && (options.errorOnFail ?? true)) {
        throw new Error(await res.text())
    }

    return res
}