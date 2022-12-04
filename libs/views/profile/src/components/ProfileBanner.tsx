// Chakra imports
import {
  Avatar,
  Box,
  Flex,
  IconButton,
  SimpleGrid,
  Skeleton,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Card, CustomCardProps } from '@omagize/ui/components';
import { useSelfUser } from '@omagize/data-access-api';
import { EditIcon } from '@chakra-ui/icons';
import { useUserStore } from '@omagize/data-access-store';
import { useColors } from '@omagize/ui/theme';
import { EditAccountModal } from '@omagize/views/shared';

export default function ProfileBanner(props: CustomCardProps) {
  const user = useSelfUser();
  const [groups, friends] = useUserStore((s) => [s.groups, s.relations]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Chakra Color Mode
  const { textColorPrimary, textColorSecondary, borderColor, brand } = useColors();
  const avatarSize = '120px';

  return (
    <Card alignItems="center" {...props}>
      <Box
        bg={brand}
        bgImg={user.bannerUrl}
        bgSize="cover"
        borderRadius="16px"
        h="200px"
        w="100%"
      />
      <Avatar
        mx="auto"
        src={user.avatarUrl}
        h={avatarSize}
        w={avatarSize}
        mt="-60px"
        border="4px solid"
        borderColor={borderColor}
      />
      <Flex direction="row" pos="relative" mt="10px">
        <Text color={textColorPrimary} fontWeight="bold" fontSize="xl">
          {user.username}
        </Text>
        <IconButton
          minH="30px"
          h="full"
          aria-label="Edit Profile"
          pos="absolute"
          left="100%"
          ml={2}
          icon={<EditIcon />}
          onClick={onOpen}
        />
      </Flex>
      <EditAccountModal isOpen={isOpen} onClose={onClose} />

      <Text color={textColorSecondary} fontSize="sm">
        {user.description}
      </Text>
      <SimpleGrid columns={2} mx="auto" mt="26px" gap={5}>
        <Flex alignItems="center" flexDirection="column">
          {groups ? (
            <Text color={textColorPrimary} fontSize="2xl" fontWeight="700">
              {groups.length}
            </Text>
          ) : (
            <Skeleton w="60px" h="30px" />
          )}

          <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
            Joined Groups
          </Text>
        </Flex>
        <Flex alignItems="center" flexDirection="column">
          {friends ? (
            <Text color={textColorPrimary} fontSize="2xl" fontWeight="700">
              {friends.length}
            </Text>
          ) : (
            <Skeleton w="60px" h="30px" />
          )}
          <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
            Friends
          </Text>
        </Flex>
      </SimpleGrid>
    </Card>
  );
}
