import { Flex, Icon, Menu, MenuButton, MenuList, Text } from '@chakra-ui/react';
import React from 'react';
import { useNavbarColors } from 'variables/colors';
import { useUserNotificationsQuery } from '@omagize/api';
import { ArrayHolder } from 'utils/Container';
import { NotificationSkeleton } from '../../card/notification/Notification';
import UserNotificationItem from '../../card/notification/UserNotification';
import { MdNotificationsNone } from 'react-icons/md';

export default function NotificationsMenu() {
  const { iconColor, textColorPrimary, menuBg, shadow, textColorBrand } =
    useNavbarColors();
  const query = useUserNotificationsQuery();

  return (
    <Menu
      styleConfig={{
        'min-width': '0',
      }}
    >
      <MenuButton p="0px">
        <Icon
          mt="6px"
          as={MdNotificationsNone}
          color={iconColor}
          w="18px"
          h="18px"
          me="10px"
        />
      </MenuButton>
      <MenuList
        boxShadow={shadow}
        borderRadius="20px"
        bg={menuBg}
        border="none"
        w={{ base: '300px', md: '100%' }}
      >
        <Flex w="100%" mb="20px" p="20px" pb={0}>
          <Text fontSize="md" fontWeight="600" color={textColorPrimary}>
            Notifications
          </Text>
          <Text
            fontSize="sm"
            fontWeight="500"
            color={textColorBrand}
            ms="auto"
            cursor="pointer"
          >
            Mark all read
          </Text>
        </Flex>
        <Flex flexDirection="column">
          <ArrayHolder
            array={query.data}
            placeholder="No Notifications"
            skeleton={
              <>
                <NotificationSkeleton />
                <NotificationSkeleton />
              </>
            }
          >
            {() =>
              query.data.map((n) => <UserNotificationItem key={n.id} {...n} />)
            }
          </ArrayHolder>
        </Flex>
      </MenuList>
    </Menu>
  );
}
