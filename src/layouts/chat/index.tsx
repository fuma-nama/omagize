// Chakra imports
import {Portal, Box, useDisclosure, Flex, useCallbackRef} from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin';
import {useContext} from 'react';
import {Outlet} from 'react-router-dom';
import routes from 'routes';
import {PageContext} from "contexts/PageContext";
import {useActiveRoute} from "utils/RouteUtil";
import PageLayout from "../PageLayout";

export default function ChatLayout() {
	document.documentElement.dir = 'ltr';

	return (
		<PageLayout>
			<Content />
		</PageLayout>
	);
}

function Content({...rest}) {
	const {info} = useContext(PageContext)
	const activeRoute = useActiveRoute(routes)

	return <Flex
		direction='column'
		float='right'
		overflow='hidden'
		position='relative'
		w='full'
		h='full'
		transition='all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)'
		transitionDuration='.2s, .2s, .35s'
		transitionProperty='top, bottom, width'
		transitionTimingFunction='linear, linear, ease'>
		<Navbar
			brandText={activeRoute?.name || info?.title}
			{...rest}
		/>
		<Outlet />
	</Flex>
}