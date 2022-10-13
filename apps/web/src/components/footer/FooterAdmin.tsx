/*eslint-disable*/

import {
  Flex,
  Link,
  List,
  ListItem,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

export function Content() {
  const textColor = useColorModeValue('gray.400', 'white');

  return (
    <Text
      color={textColor}
      textAlign={{
        base: 'center',
        xl: 'start',
      }}
      mb={{ base: '20px', xl: '0px' }}
    >
      {' '}
      &copy; {new Date().getFullYear()}
      <Text as="span" fontWeight="500" ms="4px">
        Omagize Web. All Rights Reserved. Made by
        <Link
          mx="3px"
          color={textColor}
          href="https://github.com/SonMooSans"
          target="_blank"
          fontWeight="700"
        >
          MONEY
        </Link>
      </Text>
    </Text>
  );
}

export default function Footer() {
  const textColor = useColorModeValue('gray.400', 'white');
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
        xl: 'row',
      }}
      alignItems={{
        base: 'center',
        xl: 'start',
      }}
      justifyContent="space-between"
      px={{ base: '30px', md: '50px' }}
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
            <Link fontWeight="500" color={textColor} href={item.href}>
              {item.label}
            </Link>
          </ListItem>
        ))}
      </List>
    </Flex>
  );
}
