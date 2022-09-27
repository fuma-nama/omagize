import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {call, callReturn, ReturnOptions, withDefault} from "./core";
import {UserType} from "./UserAPI";
export type Reset = 'reset'

export const LoginKey = ["login"]

type LoginPayload = {
    self: UserType
    token: string
}

export async function auth(): Promise<LoginPayload | null> {
    return await callReturn<LoginPayload | null>("/auth", withDefault<ReturnOptions<LoginPayload>>({
        method: "POST",
        allowed: {
            401: () => null
        }
    }))
}

export async function login(options: {
    email: string,
    password: string
}) {
    return await callReturn<LoginPayload>("/login", withDefault({
        method: "POST",
        body: JSON.stringify(options),
        errorOnFail: true
    }))
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
    return await callReturn<LoginPayload>("/signup", withDefault({
        method: "POST",
        body: JSON.stringify(options),
        errorOnFail: true
    }))
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