import { Icon } from '@chakra-ui/react';
import { MdPerson, MdHome } from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import NFTMarketplace from 'views/admin/marketplace';
import Profile from 'views/admin/profile';

// Auth Imports

import { BsSearch } from 'react-icons/bs';

const routes: RoutesType[] = [
  {
    name: 'Main Dashboard',
    layout: '/user',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'Explore',
    layout: '/user',
    path: '/explore',
    icon: <Icon as={BsSearch} width="20px" height="20px" color="inherit" />,
    component: <NFTMarketplace />,
  },
  {
    name: 'Profile',
    layout: '/user',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
    hidden: true,
  },
];

export default routes;
