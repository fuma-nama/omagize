// Chakra Imports
import {
  Box,
  BoxProps,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  ChakraProps,
  Flex,
  FlexProps,
  Link,
  Skeleton,
  SkeletonText,
  useColorModeValue,
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { getActiveLayout, RootLayout } from '@omagize/utils/route-utils';
import AdminNavbarLinks from './NavbarLinksAdmin';

export function AdminNavbar(
  props: {
    brandText: string;
    layoutes: RootLayout[];
  } & ChakraProps
) {
  const { brandText, layoutes } = props;
  const mainText = useColorModeValue('navy.700', 'white');
  const secondaryText = useColorModeValue('gray.700', 'white');
  const active = getActiveLayout(useLocation(), layoutes);

  if (active.navbar != null) {
    return active.navbar;
  }

  return (
    <NavbarBox>
      <Box>
        <Breadcrumb display={{ base: 'none', '3sm': 'flex' }}>
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
          fontSize={{ base: '24px', '3sm': '34px' }}
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
      <AdminNavbarLinks />
    </NavbarBox>
  );
}

export function NavbarBox({
  box,
  bar,
  children,
}: {
  box?: BoxProps;
  bar?: FlexProps;
  children: ReactNode;
}) {
  const navbarBg = useColorModeValue('rgba(244, 247, 254, 0.2)', 'rgba(11,20,55,0.5)');
  const breakpoint = '2sm';

  return (
    <Box top={0} zIndex="sticky" pos="sticky" p={{ [breakpoint]: '12px' }} px={{ lg: '20px' }}>
      <Flex
        bg={navbarBg}
        backdropFilter="blur(20px)"
        borderRadius={{ [breakpoint]: '16px' }}
        lineHeight="25.6px"
        py="8px"
        px="10px"
        w="full"
        {...box}
      >
        <Flex w="100%" direction="row" gap={2} justify="space-between" align="center" {...bar}>
          {children}
        </Flex>
      </Flex>
    </Box>
  );
}
