import { Avatar, Box, SkeletonCircle, SkeletonText, Text } from '@chakra-ui/react';
import { Group } from '@omagize/api';
import { Card, FadeImage } from '@omagize/ui/components';

export function ChatGroup({
  active,
  group,
  onSelect,
}: {
  group: Group;
  active: boolean;
  onSelect: () => void;
}) {
  const activeColor = 'brand.400';

  return (
    <Box
      transition="0.2s linear"
      mr={active ? '5px' : '10px'}
      filter="auto"
      brightness={active ? 1 : 0.7}
      onClick={onSelect}
      _hover={{ cursor: 'pointer' }}
    >
      <Card pos="relative" overflow="hidden">
        <FadeImage
          src={group.bannerUrl}
          direction="to left"
          placeholder={activeColor}
          bg={active ? activeColor : 'black'}
          image={{
            filter: 'auto',
            brightness: active ? 0.9 : 0.7,
          }}
        />

        <Box pos="relative" maxW="70%" color="white">
          <Avatar name={group.name} src={group.iconUrl} />
          <Text mt={3} fontSize="lg" fontWeight="bold" lineHeight={1}>
            {group.name}
          </Text>
        </Box>
      </Card>
    </Box>
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
