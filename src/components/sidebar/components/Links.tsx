/* eslint-disable */

import {matchPath, matchRoutes, NavLink, useLocation} from 'react-router-dom';
// chakra imports
import { Box, Flex, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import {layouts} from "layouts";
import {getActiveRoute} from "../../../utils/RouteUtil";

export function SidebarLinks(props: {
	routes: RoutesType[];
}) {
	//   Chakra color mode
	const { routes } = props;
	const location = useLocation()

	// this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
	const createLinks = (
		routes: RoutesType[], 
	) => {
		const active = getActiveRoute(location, routes)

		return routes.map(
			(
				route: RoutesType,
				index: number
			) => {
				const exists = layouts.some(layout => layout.path === route.layout)

				if (exists) {
					return <Link key={index} route={route} active={active === route} />
				}
			}
		);
	};
	//  BRAND
	return <>{createLinks(routes)}</>
}

function Link(props: {route: RoutesType, active: boolean}) {
	const {route, active} = props
	let activeColor = useColorModeValue('gray.700', 'white');
	let activeIcon = useColorModeValue('brand.500', 'white');
	let textColor = useColorModeValue('secondaryGray.500', 'white');
	let brandColor = useColorModeValue('brand.500', 'brand.400');

	return (
		<NavLink to={route.layout + route.path}>
			<Box>
				<HStack
					spacing={active ? '22px' : '26px'}
					py='5px'
					ps='10px'>
					<Flex w='100%' alignItems='center' justifyContent='center'>
						<Box
							color={active ? activeIcon : textColor}
							me='18px'>
							{route.icon}
						</Box>
						<Text
							me='auto'
							color={active ? activeColor : textColor}
							fontWeight={active ? 'bold' : 'normal'}>
							{route.name}
						</Text>
					</Flex>
					<Box
						h='36px'
						w='4px'
						bg={active ? brandColor : 'transparent'}
						borderRadius='5px'
					/>
				</HStack>
			</Box>
		</NavLink>
	);
}

export default SidebarLinks;
