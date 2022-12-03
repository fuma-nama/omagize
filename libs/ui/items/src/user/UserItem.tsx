import { Avatar, Flex, HStack, PopoverTrigger, StackProps, Text, useToken } from '@chakra-ui/react';
import { CustomCardProps, TagCard, Card, FadeImage, UserPopup } from '@omagize/ui/components';
import { User } from '@omagize/api';
import { useColors } from '@omagize/ui/theme';

export function UserItem({ user, ...props }: { user: User } & CustomCardProps) {
  const [brand] = useToken('color', ['brand.400']);
  const { textColorPrimary } = useColors();
  const image = user.bannerUrl ?? user.avatarUrl;

  return (
    <UserPopup user={user.id}>
      <Card overflow="hidden" pos="relative" {...props}>
        <FadeImage direction="to left" src={image} placeholder={brand} percent={60} opacity={50} />

        <HStack gap="5px" pos="relative" align="start">
          <PopoverTrigger>
            <Avatar name={user.username} src={user.avatarUrl} variant="normal" />
          </PopoverTrigger>
          <Flex direction="column">
            <PopoverTrigger>
              <Text color={textColorPrimary} fontSize="xl" fontWeight="bold" cursor="pointer">
                {user.username}
              </Text>
            </PopoverTrigger>
            <Text color={textColorPrimary}>{user.description}</Text>
          </Flex>
        </HStack>
      </Card>
    </UserPopup>
  );
}

export function SmallUserItem({ user, ...props }: { user: User } & StackProps) {
  const { textColorPrimary, textColorSecondary, globalBg } = useColors();
  return (
    <TagCard overflow="hidden" pos="relative" bg={globalBg} {...props}>
      <Avatar name={user.username} src={user.avatarUrl} variant="normal" />
      <Flex direction="column">
        <Text color={textColorPrimary} fontSize="xl" fontWeight="bold">
          {user.username}
        </Text>
        <Text color={textColorSecondary}>{user.description}</Text>
      </Flex>
    </TagCard>
  );
}

export function UserItemSkeleton() {
  return <></>;
}
