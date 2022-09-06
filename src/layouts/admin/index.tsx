// Chakra imports
import {Portal, Box, useDisclosure, Flex} from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin';
import Sidebar from 'components/sidebar/Sidebar';
import { SidebarContext } from 'contexts/SidebarContext';
import {useContext, useState} from 'react';
import {Outlet, useLocation} from 'react-router-dom';
import routes from 'routes';
import {PageContext, PageContextProvider} from "contexts/PageContext";
import {getActiveRoute} from "utils/RouteUtil";

// Custom Chakra theme
export default function Dashboard(props: { [x: string]: any }) {
	// states and functions
	const [ toggleSidebar, setToggleSidebar ] = useState(false);
	document.documentElement.dir = 'ltr';

	return (
		<Box h='full'>
			<PageContextProvider>
				<SidebarContext.Provider
					value={{
						toggleSidebar,
						setToggleSidebar
					}}>
					<Content {...props} />
				</SidebarContext.Provider>
			</PageContextProvider>
		</Box>
	);
}

function Content({...rest}) {
	const location = useLocation()
	const {info} = useContext(PageContext)
	const activeRoute = getActiveRoute(location, routes)

	return <>
		<Sidebar routes={routes} display='none' {...rest} />
		<Box
			float='right'
			minHeight='100vh'
			height='100%'
			overflow='auto'
			position='relative'
			maxHeight='100%'
			p={{ base: '20px', md: '30px' }}
			w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
			maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
			transition='all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)'
			transitionDuration='.2s, .2s, .35s'
			transitionProperty='top, bottom, width'
			transitionTimingFunction='linear, linear, ease'>
			<Navbar
				brandText={activeRoute?.name || info?.title}
				{...rest}
			/>
			<Box mx='auto' pe='20px' minH='full' mt='50px'>
				<Outlet />
			</Box>
			<Box>
				<Footer />
			</Box>
		</Box>
	</>
}