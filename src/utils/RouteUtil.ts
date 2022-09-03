import {Location, matchRoutes} from "react-router-dom";

export function getActiveRoute(location: Location, routes: RoutesType[]): RoutesType | null {

    const [match] = matchRoutes(routes.map(route => ({
        path: route.layout + route.path
    })), location.pathname)

    return match? routes.find(route => match.route.path === route.layout + route.path) : null
}

