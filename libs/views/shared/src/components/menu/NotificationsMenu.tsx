import { Flex, Icon, Menu, MenuButton, MenuList, Text } from '@chakra-ui/react';
import { MdNotificationsNone } from 'react-icons/md';
import { BiNotificationOff } from 'react-icons/bi';
import { useNavbarColors } from '@omagize/ui/theme';
import { useUserNotificationsQuery } from '@omagize/data-access-api';
import { Repeat, Placeholder, QueryStatusLayout } from '@omagize/ui/components';
import { NotificationSkeleton, UserNotificationItem } from '../items';

export function NotificationsMenu() {
  const { iconColor, textColorPrimary, menuBg, shadow, textColorBrand } = useNavbarColors();
  const query = useUserNotificationsQuery();

  return (
    <Menu
      styleConfig={{
        'min-width': '0',
      }}
    >
      <MenuButton p="0px">
        <Icon mt="6px" as={MdNotificationsNone} color={iconColor} w="18px" h="18px" me="10px" />
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
          <Text fontSize="sm" fontWeight="500" color={textColorBrand} ms="auto" cursor="pointer">
            Mark all read
          </Text>
        </Flex>
        <Flex flexDirection="column">
          <QueryStatusLayout
            query={query}
            watch={query.data}
            placeholder={<Placeholder icon={<BiNotificationOff />}>No Notifcations</Placeholder>}
            error="Failed to fetch Notifications"
            skeleton={
              <Repeat times={2}>
                <NotificationSkeleton />
              </Repeat>
            }
          >
            {query.data?.map((n) => (
              <UserNotificationItem key={n.id} {...n} />
            ))}
          </QueryStatusLayout>
        </Flex>
      </MenuList>
    </Menu>
  );
}
