import {Location, matchRoutes} from "react-router-dom";

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