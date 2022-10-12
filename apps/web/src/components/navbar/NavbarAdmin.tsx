// Chakra Imports
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Link,
  Skeleton,
  SkeletonText,
  useColorModeValue,
} from '@chakra-ui/react';
import AdminNavbarLinks from 'components/navbar/NavbarLinksAdmin';
import { ChakraProps } from '@chakra-ui/system/src/system.types';
import { getActiveRoute } from '../../utils/RouteUtil';
import { useLocation } from 'react-router-dom';
import routes, { dynamicRoutes } from 'routes';

export default function AdminNavbar(
  props: {
    brandText: string;
  } & ChakraProps
) {
  const { brandText } = props;

  // Here are all the props that may change depending on navbar's type or state.(secondary, variant, scrolled)
  let mainText = useColorModeValue('navy.700', 'white');
  let secondaryText = useColorModeValue('gray.700', 'white');
  let navbarBackdrop = 'blur(20px)';
  let navbarBg = useColorModeValue(
    'rgba(244, 247, 254, 0.2)',
    'rgba(11,20,55,0.5)'
  );
  const route = getActiveRoute(useLocation(), [...dynamicRoutes, ...routes]);

  return (
    <Box
      zIndex="sticky"
      pos="sticky"
      bg={navbarBg}
      backdropFilter={navbarBackdrop}
      backgroundPosition="center"
      backgroundSize="cover"
      borderRadius="16px"
      transitionDelay="0s, 0s, 0s, 0s"
      transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
      transition-property="box-shadow, background-color, filter, border"
      transitionTimingFunction="linear, linear, linear, linear"
      alignItems={{ xl: 'center' }}
      display="flex"
      justifyContent={{ xl: 'center' }}
      lineHeight="25.6px"
      mx="auto"
      pb="8px"
      px={{
        sm: '15px',
        md: '10px',
      }}
      ps={{
        xl: '12px',
      }}
      pt="8px"
      top={0}
      w="full"
    >
      <Flex
        w="100%"
        flexDirection={{
          sm: 'column',
          md: 'row',
        }}
        alignItems={{ xl: 'center' }}
      >
        <Box mb={{ sm: '8px', md: '0px' }}>
          <Breadcrumb>
            <BreadcrumbItem color={secondaryText} fontSize="sm" mb="5px">
              <BreadcrumbLink href="#" color={secondaryText}>
                Pages
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem color={secondaryText} fontSize="sm">
              <BreadcrumbLink href="#" color={secondaryText}>
                {brandText || <Skeleton w="200px" height="20px" rounded="lg" />}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Link
            color={mainText}
            href="#"
            bg="inherit"
            borderRadius="inherit"
            fontWeight="bold"
            fontSize="34px"
            _hover={{ color: { mainText } }}
            _active={{
              bg: 'inherit',
              transform: 'none',
              borderColor: 'transparent',
            }}
            _focus={{
              boxShadow: 'none',
            }}
          >
            {brandText || <SkeletonText w="full" noOfLines={2} />}
          </Link>
        </Box>
        <Box ms="auto" w={{ sm: '100%', md: 'unset' }}>
          {route?.navbar || <AdminNavbarLinks />}
        </Box>
      </Flex>
    </Box>
  );
}
