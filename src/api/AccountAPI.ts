import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {call, callReturn, withDefault} from "./core";
export type Reset = 'reset'

export async function loggedIn() {
    const result = await call("/auth", withDefault({
        method: "HEAD",
        errorOnFail: false
    }))

    return result.ok
}

export function logout() {
}

export function useLogoutMutation() {
    const client = useQueryClient()

    // @ts-ignore
    return useMutation(() => logout(), {
        onSuccess() {
            client.setQueryData(["logged_in"], () => false)
        }
    })
}

type SignUpReturn = {

}

export async function signup(
    options: {
        username: string,
        email: string,
        password: string
    }
) {
    return await callReturn<SignUpReturn>("/signup", withDefault({
        method: "POST",
        body: JSON.stringify(options)
    }))
}

export function useLoggedInQuery() {
    return useQuery(["logged_in"], () => loggedIn())
}