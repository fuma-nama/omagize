/* eslint-disable */

import { NavLink, useLocation } from 'react-router-dom';
// chakra imports
import { Box, Flex, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import {layouts} from "layouts";

export function SidebarLinks(props: {
	routes: RoutesType[];
}) {
	//   Chakra color mode
	let location = useLocation();
	const { routes } = props;

	// verifies if routeName is the one active (in browser input)
	const activeRoute = (routeName: string) => {
		return location.pathname.includes(routeName);
	};

	// this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
	const createLinks = (
		routes: RoutesType[], 
	) => {
		return routes.map(
			(
				route: RoutesType,
				index: number
			) => {
				const exists = layouts.some(layout => layout.path === route.layout)
				if (exists) {
					return <Link key={index} route={route} active={activeRoute(route.path.toLowerCase())} />
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
