import {useQuery} from "@tanstack/react-query";

export function loggedIn() {
    return true
}

export function useLoggedInQuery() {
    return useQuery(["logged_in"], () => loggedIn())
}