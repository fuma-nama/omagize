import { Icon } from '@chakra-ui/react';
import {  MdPerson, MdHome, MdLock, MdOutlineShoppingCart } from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import NFTMarketplace from 'views/admin/marketplace';
import Profile from 'views/admin/profile';

// Auth Imports
import SignInCentered from 'views/auth/signIn';
import GroupOverview from "./views/admin/group";
import GroupChat from "./views/admin/chat/group/GroupChat";
import GroupNavbar from "./views/admin/chat/navbar/GroupNavbar";
import SignUp from "./views/auth/signup";

const routes: RoutesType[] = [
	{
		name: 'Main Dashboard',
		layout: '/user',
		path: '/default',
		icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
		component: <MainDashboard />
	},
	{
		name: 'NFT Marketplace',
		layout: '/user',
		path: '/nft-marketplace',
		icon: <Icon as={MdOutlineShoppingCart} width='20px' height='20px' color='inherit' />,
		component: <NFTMarketplace />,
	},
	{
		name: 'Profile',
		layout: '/user',
		path: '/profile',
		icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
		component: <Profile />,
		hidden: true
	},
	{
		name: 'Sign In',
		layout: '/auth',
		path: '/signin',
		component: <SignInCentered />,
		hidden: true
	},
	{
		name: 'Sign Up',
		layout: '/auth',
		path: '/signup',
		component: <SignUp />,
		hidden: true
	},
];

export const dynamicRoutes: DynamicRoute[] = [
	{
		layout: '/user',
		path: '/:group',
		component: <GroupOverview />,
	},
	{
		layout: '/user/chat',
		path: '/:group',
		component: <GroupChat />,
		navbar: <GroupNavbar />
	}
]

export default routes;
