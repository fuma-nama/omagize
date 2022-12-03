// Chakra imports
import { Avatar, Flex, Text } from '@chakra-ui/react';
import { Group } from '@omagize/api';
import { useUserStore } from '@omagize/data-access-store';
import { Card, CardButton, CustomCardProps, FadeImage } from '@omagize/ui/components';
import { useColors } from '@omagize/ui/theme';
import { useSelected } from '@omagize/utils/route-utils';

export default function OwnedGroups(props: CustomCardProps) {
  const { ...rest } = props;
  // Chakra Color Mode
  const { textColorPrimary, textColorSecondary } = useColors();

  const groups = useUserStore((s) => s.groups);
  return (
    <Card {...rest}>
      <Text color={textColorPrimary} fontWeight="bold" fontSize="2xl" mt="10px" mb="4px">
        Owned Groups
      </Text>
      <Text color={textColorSecondary} fontSize="md" me="26px" mb="40px">
        All groups which is owned by you
      </Text>
      <Flex direction="column" gap={3}>
        {groups
          ?.filter((group) => group.owner)
          ?.map((group) => (
            <GroupItem key={group.id} group={group} />
          ))}
      </Flex>
    </Card>
  );
}

function GroupItem({ group }: { group: Group }) {
  const { brand, borderColor } = useColors();
  const { setSelectedGroup } = useSelected();

  return (
    <CardButton
      color="white"
      bg="black"
      pos="relative"
      overflow="hidden"
      onClick={() => setSelectedGroup(group.id)}
      _hover={{
        bg: 'brand.400',
      }}
    >
      <FadeImage
        src={group.bannerUrl}
        placeholder={brand}
        direction="to left"
        image={{
          filter: 'auto',
          brightness: 0.9,
        }}
      />

      <Flex direction={{ base: 'column', lg: 'row' }} pos="relative" gap={2}>
        <Avatar
          name={group.name}
          src={group.iconUrl}
          border="4px solid"
          w="100px"
          h="100px"
          borderColor={borderColor}
        />
        <Text fontSize="2xl" fontWeight="bold" mt="10px" maxW={{ base: '80%', lg: '40%' }}>
          {group.name}
        </Text>
      </Flex>
    </CardButton>
  );
}
