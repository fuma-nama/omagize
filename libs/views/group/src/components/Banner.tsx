// Chakra imports
import {
  Avatar,
  AvatarGroup,
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

import { Member } from '@omagize/api';
import { useGroupDetailQuery, useGroupMembersQuery } from '@omagize/data-access-api';
import { GroupDetail } from '@omagize/api';
import { useColors } from '@omagize/ui/theme';
import { useSelected } from '@omagize/utils/route-utils';
import { MdArrowDropDown } from 'react-icons/md';
import { QueryStatus } from '@omagize/ui/components';

export default function Banner() {
  const { selectedGroup } = useSelected();
  const query = useGroupDetailQuery(selectedGroup);

  return (
    <QueryStatus query={query} loading={null} error="Failed to load Group">
      <Content group={query.data} />
    </QueryStatus>
  );
}

function Content({ group }: { group: GroupDetail }) {
  const bg = useColorModeValue('brand.300', 'brand.400');
  const membersQuery = useGroupMembersQuery(group.id);

  return (
    <Box
      pos="relative"
      cursor="pointer"
      color="white"
      borderRadius="30px"
      bgColor={bg}
      bgImg={group.bannerUrl}
      bgSize="cover"
    >
      <Box
        h="full"
        borderRadius="30px"
        backdropFilter={group.bannerUrl != null && 'auto'}
        backdropBlur="sm"
        backdropBrightness={0.5}
        p={{ base: '10px', '3sm': '20px' }}
      >
        <Box display={{ base: 'none', '3sm': 'block' }}>
          <BannerContent group={group} members={membersQuery.data?.pages[0]} />
        </Box>
        <Box display={{ base: 'block', '3sm': 'none' }}>
          <BannerSmallContent group={group} members={membersQuery.data?.pages[0]} />
        </Box>
      </Box>
      <Icon as={MdArrowDropDown} w="30px" h="30px" pos="absolute" top="20px" right="20px" />
    </Box>
  );
}

type BannerContentProps = {
  group: GroupDetail;
  members?: Member[];
};
function BannerContent({ group, members }: BannerContentProps) {
  return (
    <Flex direction="row" gap="20px" my="20px">
      <Avatar
        variant="border"
        borderWidth={5}
        src={group.iconUrl}
        name={group.name}
        w="100px"
        h="100px"
      />

      <Flex direction="column" align="start" gap="20px">
        <Heading>{group.name}</Heading>
        <HStack mt="10px">
          <AvatarGroup max={5}>
            {members?.map((member) => (
              <Avatar key={member.id} src={member.avatarUrl} name={member.username} />
            ))}
          </AvatarGroup>
          <Text>{group.memberCount} Members</Text>
        </HStack>
      </Flex>
    </Flex>
  );
}

function BannerSmallContent({ group, members }: BannerContentProps) {
  const { cardBg, textColorPrimary } = useColors();

  return (
    <Flex direction="column" gap="20px">
      <HStack>
        <Avatar
          variant="border"
          borderWidth={2}
          src={group.iconUrl}
          name={group.name}
          w="70px"
          h="70px"
        />
        <Text fontSize="xl" fontWeight="bold">
          {group.name}
        </Text>
      </HStack>

      <HStack color={textColorPrimary} bg={cardBg} w="full" rounded="2xl" minH="40px">
        <AvatarGroup max={5}>
          {members?.map((member) => (
            <Avatar key={member.id} src={member.avatarUrl} name={member.username} />
          ))}
        </AvatarGroup>
        <Text fontWeight="bold">{group.memberCount} Members</Text>
      </HStack>
    </Flex>
  );
}
