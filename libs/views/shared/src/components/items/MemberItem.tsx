import { HStack, Flex, Text } from '@chakra-ui/layout';
import { PopoverTrigger, Avatar } from '@chakra-ui/react';
import { useToken } from '@chakra-ui/system';
import { Member, Snowflake } from '@omagize/api';
import { Card, CustomCardProps, FadeImage, MemberPopup } from '@omagize/ui/components';
import { useColors } from '@omagize/ui/theme';

export function MemberItem({
  member,
  group,
  ...props
}: { member: Member; group: Snowflake } & CustomCardProps) {
  const [brand] = useToken('color', ['brand.400']);
  const { textColorPrimary } = useColors();
  const image = member.bannerUrl ?? member.avatarUrl;

  return (
    <MemberPopup group={group} user={member.id}>
      <Card overflow="hidden" pos="relative" {...props}>
        <FadeImage direction="to left" src={image} placeholder={brand} percent={60} opacity={50} />

        <HStack gap="5px" pos="relative" align="start">
          <PopoverTrigger>
            <Avatar
              name={member.username}
              src={member.avatarUrl}
              variant="normal"
              cursor="pointer"
            />
          </PopoverTrigger>
          <Flex direction="column">
            <PopoverTrigger>
              <Text color={textColorPrimary} fontSize="xl" fontWeight="bold" cursor="pointer">
                {member.username}
              </Text>
            </PopoverTrigger>
            <Text color={textColorPrimary}>{member.description}</Text>
          </Flex>
        </HStack>
      </Card>
    </MemberPopup>
  );
}
