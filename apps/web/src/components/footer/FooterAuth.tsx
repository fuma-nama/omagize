/* eslint-disable */

import {
  Flex,
  Link,
  List,
  ListItem,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Content } from './FooterAdmin';

export default function Footer() {
  let textColor = useColorModeValue('gray.400', 'white');
  let linkColor = useColorModeValue({ base: 'gray.400', lg: 'white' }, 'white');

  const items = [
    {
      label: 'Support',
      href: 'https://discord.com/invite/QmgmFhg',
    },
    {
      label: 'Github',
      href: 'https://github.com/SonMooSans/omagize',
    },
  ];
  return (
    <Flex
      zIndex="3"
      flexDirection={{
        base: 'column',
        lg: 'row',
      }}
      alignItems={{
        base: 'center',
        xl: 'start',
      }}
      justifyContent="space-between"
      px={{ base: '30px', md: '0px' }}
      pb="30px"
    >
      <Content />
      <List display="flex">
        {items.map((item, i) => (
          <ListItem
            key={i}
            me={{
              base: '20px',
              md: '44px',
            }}
          >
            <Link fontWeight="500" color={linkColor} href={item.href}>
              {item.label}
            </Link>
          </ListItem>
        ))}
      </List>
    </Flex>
  );
}
