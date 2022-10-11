import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {callReturn, ReturnOptions, withDefault} from "./utils/core";
import {RawSelfUser} from "./UserAPI";
import {LoginPayload} from "./types/Auth";
export type Reset = 'reset'

export const LoginKey = ["login"]

export type RawLoginPayload = {
    account: RawAccount,
    user: RawSelfUser
    token: string
}

export type RawAccount = {
    email: string
}

export async function auth(): Promise<LoginPayload | null> {
    return await callReturn<RawLoginPayload | null>("/auth", withDefault<ReturnOptions<RawLoginPayload>>({
        method: "POST",
        allowed: {
            401: () => null
        }
    })).then(res =>
        LoginPayload(res)
    )
}

export async function login(options: {
    email: string,
    password: string
}): Promise<LoginPayload | null> {
    return await callReturn<RawLoginPayload>("/login", withDefault({
        method: "POST",
        body: JSON.stringify(options),
        errorOnFail: true
    })).then(res =>
        LoginPayload(res)
    )
}

export function logout() {
}

export function useLogoutMutation() {
    const client = useQueryClient()

    // @ts-ignore
    return useMutation(() => logout(), {
        onSuccess() {
            client.setQueryData(LoginKey, () => null)
        }
    })
}

export async function signup(
    options: {
        username: string,
        email: string,
        password: string
    }
): Promise<LoginPayload> {
    return await callReturn<RawLoginPayload>("/signup", withDefault({
        method: "POST",
        body: JSON.stringify(options),
        errorOnFail: true
    })).then(res =>
        LoginPayload(res)
    )
}

export function useLoginQuery() {
    return useQuery(LoginKey, () => auth(), {
        refetchOnReconnect: false,
        refetchOnMount: false,
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: false,
        refetchInterval: false
    })
}