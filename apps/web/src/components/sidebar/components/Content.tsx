// chakra imports
import { Box, Flex, Stack } from '@chakra-ui/react';
//   Custom components
import Brand from './Brand';
import Links from './Links';
import SidebarCard from './SidebarCard';
import { SidebarItem } from '@omagize/utils/route-utils';
import ActionBar from './ActionBar';
import { useUserStore } from '@omagize/data-access-store';
import { Snowflake } from '@omagize/api';
import { ChatGroupItem, ChatGroupSkeleton } from '@omagize/views/shared';

function SidebarContent({
  items,
  selected: selectedGroup,
  onSelect,
}: {
  items: SidebarItem[];
  selected: Snowflake;
  onSelect: (id: Snowflake) => void;
}) {
  const groups = useUserStore((s) => s.groups);

  // SIDEBAR
  return (
    <Flex direction="column" height="100%" pt="25px" borderRadius="30px" overflow="auto">
      <Brand />
      <Stack direction="column" mt="18px" mb="auto">
        <Box ps="10px">
          <Links items={items} />
        </Box>
        <Box px="10px">
          <ActionBar />
        </Box>

        <Flex direction="column" ps="10px" gap={3}>
          {groups != null ? (
            groups.map((group) => (
              <ChatGroupItem
                key={group.id}
                group={group}
                active={selectedGroup === group.id}
                onSelect={() => onSelect(group.id)}
              />
            ))
          ) : (
            <>
              <ChatGroupSkeleton />
              <ChatGroupSkeleton />
            </>
          )}
        </Flex>
      </Stack>

      <Box
        pos="sticky"
        bottom={0}
        ps="20px"
        pe={{ lg: '16px', '2xl': '20px' }}
        mt="60px"
        mb="40px"
        borderRadius="30px"
      >
        <SidebarCard />
      </Box>
    </Flex>
  );
}

export default SidebarContent;
