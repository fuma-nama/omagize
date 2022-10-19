// Chakra imports
import {
  Avatar,
  AvatarGroup,
  Box,
  Flex,
  Heading,
  Hide,
  HStack,
  Image,
  Show,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

// Assets
import {
  Member,
  useGroupDetailQuery,
  useGroupMembersQuery,
} from '@omagize/api';
import { useContext } from 'react';
import { PageContext } from 'contexts/PageContext';
import { GroupDetail } from '@omagize/api';
import { useColors } from 'variables/colors';

export default function Banner() {
  const { selectedGroup } = useContext(PageContext);
  const query = useGroupDetailQuery(selectedGroup);
  if (query.isLoading) return <></>;

  return <Content group={query.data} />;
}

function Content({ group }: { group: GroupDetail }) {
  const bg = useColorModeValue('brand.300', 'brand.400');
  const membersQuery = useGroupMembersQuery(group.id);
  const loaded = membersQuery.isSuccess;

  return (
    <Box
      color="white"
      pos="relative"
      overflow="hidden"
      borderRadius="30px"
      bg={group.bannerUrl ? null : bg}
      p={{ base: '10px', '3sm': '20px' }}
    >
      {group.bannerUrl && (
        <Image
          pos="absolute"
          src={group.bannerUrl}
          objectFit="cover"
          top="0"
          left="0"
          w="full"
          h="full"
          filter="auto"
          blur="sm"
          brightness={0.5}
        />
      )}
      {loaded && (
        <>
          <Show above="3sm">
            <BannerContent
              group={group}
              members={membersQuery.data?.pages[0]}
            />
          </Show>
          <Hide above="3sm">
            <BannerSmallContent
              group={group}
              members={membersQuery.data?.pages[0]}
            />
          </Hide>
        </>
      )}
    </Box>
  );
}

type BannerContentProps = {
  group: GroupDetail;
  members: Member[];
};
function BannerContent({ group, members }: BannerContentProps) {
  return (
    <Flex direction="row" gap="20px" my="20px" pos="relative">
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
            {members.map((member) => (
              <Avatar
                key={member.id}
                src={member.avatarUrl}
                name={member.username}
              />
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
    <Flex direction="column" gap="20px" pos="relative">
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

      <HStack
        color={textColorPrimary}
        bg={cardBg}
        w="full"
        rounded="2xl"
        minH="40px"
      >
        <AvatarGroup max={5}>
          {members.map((member) => (
            <Avatar
              key={member.id}
              src={member.avatarUrl}
              name={member.username}
            />
          ))}
        </AvatarGroup>
        <Text fontWeight="bold">{group.memberCount} Members</Text>
      </HStack>
    </Flex>
  );
}
