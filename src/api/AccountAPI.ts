import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
export type Reset = 'reset'

export function loggedIn() {
    return true
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

export function useLoggedInQuery() {
    return useQuery(["logged_in"], () => loggedIn())
}