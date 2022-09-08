import {Location, matchRoutes, useLocation} from "react-router-dom";

export function useActiveRoute<T extends IRoute>(routes: T[]): T | null {
    const location = useLocation()
    return getActiveRoute(location, routes)
}

export function getActiveRoute<T extends IRoute>(location: Location, routes: T[]): T | null {
    const matches = matchRoutes(routes
        .map(route => ({
            path: route.layout + route.path
        })), location.pathname)
    if (matches == null) return null

    return routes.find(route =>
        matches.some(match =>
            match.route.path === route.layout + route.path
        )
    )
}