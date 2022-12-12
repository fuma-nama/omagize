import {
  Avatar,
  Box,
  Center,
  Collapse,
  HStack,
  SkeletonCircle,
  SkeletonText,
  Spacer,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Group } from '@omagize/api';
import { Card, HorizontalCollapse } from '@omagize/ui/components';
import { useItemHoverBg } from '@omagize/ui/theme';

export function ChatGroupItem({
  active,
  group,
  onSelect,
}: {
  group: Group;
  active: boolean;
  onSelect: () => void;
}) {
  const cardBg = useColorModeValue('gray.200', 'navy.900');
  const hover = useItemHoverBg();
  const activeColor = 'brand.400';

  return (
    <Card
      overflow="hidden"
      onClick={onSelect}
      p={0}
      flexDirection="column"
      cursor="pointer"
      bg={cardBg}
      {...(active && hover)}
    >
      <Collapse in={active}>
        <HStack p={3} bgImg={group.bannerUrl} bgColor={active ? activeColor : 'black'}>
          <Avatar name={group.name} src={group.iconUrl} size="sm" />
        </HStack>
      </Collapse>

      <HStack p={3}>
        <HorizontalCollapse in={!active}>
          <Avatar name={group.name} src={group.iconUrl} size="sm" />
        </HorizontalCollapse>
        <Text mt={3} fontSize="lg" fontWeight="bold" lineHeight={1}>
          {group.name}
        </Text>
        <Spacer />
        {group.channel.unreadMentions.length > 0 && (
          <Center pos="relative" color="white" bg={activeColor} w="30px" h="30px" rounded="full">
            {group.channel.unreadMentions.length}
          </Center>
        )}
      </HStack>
    </Card>
  );
}

export function ChatGroupSkeleton() {
  return (
    <Box mr="10px">
      <Card bg="black" overflow="hidden">
        <SkeletonCircle size="10" />
        <SkeletonText mt="3" noOfLines={2} spacing="4" />
      </Card>
    </Box>
  );
}
