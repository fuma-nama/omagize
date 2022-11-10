import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Popover,
  PopoverBody,
  PopoverContent,
  Portal,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { Snowflake, useMemberQuery, useUserInfo } from '@omagize/api';
import { PopoverTrigger } from 'components/PopoverTrigger';
import { ReactElement, ReactNode } from 'react';
import { BiChat } from 'react-icons/bi';
import { useColors } from 'variables/colors';

export function UserPopup(props: { user: Snowflake; children: ReactElement }) {
  const { textColorPrimary, textColorSecondary } = useColors();
  const query = useUserInfo(props.user);

  const user = query.data;
  return (
    <Popup trigger={props.children}>
      {query.isLoading && <Spinner />}
      <Banner
        banner={user?.bannerUrl}
        avatar={user?.avatarUrl}
        name={user?.username}
      />
      <Flex direction="column" p={2} ml={4}>
        <Text fontSize="xl" fontWeight="600" color={textColorPrimary}>
          {user?.username}
        </Text>
        <Text color={textColorSecondary}>{user?.description}</Text>
        <HStack mt={3}>
          <Button leftIcon={<BiChat />} variant="brand">
            Chat
          </Button>
        </HStack>
      </Flex>
    </Popup>
  );
}

export function MemberPopup(props: {
  user: Snowflake;
  group: Snowflake;
  children: ReactElement;
}) {
  const { textColorPrimary, textColorSecondary } = useColors();
  const query = useMemberQuery(props.group, props.user);

  const user = query.data;
  return (
    <Popup trigger={props.children}>
      {query.isLoading && <Spinner />}
      <Banner
        banner={user?.bannerUrl}
        avatar={user?.avatarUrl}
        name={user?.username}
      />
      <Flex direction="column" p={2} ml={4}>
        <Text fontSize="xl" fontWeight="600" color={textColorPrimary}>
          {user?.username}
        </Text>
        <Text color={textColorSecondary}>{user?.description}</Text>
        <HStack mt={3}>
          <Button leftIcon={<BiChat />} variant="brand">
            Chat
          </Button>
        </HStack>
      </Flex>
    </Popup>
  );
}

function Popup(props: { trigger: ReactElement; children: ReactNode }) {
  const { cardBg } = useColors();

  return (
    <Popover>
      <PopoverTrigger>{props.trigger}</PopoverTrigger>
      <Portal>
        <PopoverContent bg={cardBg} overflow="hidden">
          <PopoverBody p={0}>{props.children}</PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}

function Banner(props: { banner?: string; avatar?: string; name?: string }) {
  const { brand, cardBg } = useColors();

  return (
    <>
      {props.banner != null ? (
        <Image src={props.banner} w="full" h={100} objectFit="cover" />
      ) : (
        <Box bg={brand} w="full" h={100} />
      )}
      <Avatar
        src={props.avatar}
        name={props.name}
        borderColor={cardBg}
        borderWidth={3}
        ml={5}
        mt={-10}
        w={20}
        h={20}
      />
    </>
  );
}
