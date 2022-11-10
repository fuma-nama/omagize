// chakra imports
import { Box, Flex, Stack } from '@chakra-ui/react';
//   Custom components
import Brand from 'components/sidebar/components/Brand';
import Links from 'components/sidebar/components/Links';
import SidebarCard from 'components/sidebar/components/SidebarCard';
import { ChatGroup, ChatGroupSkeleton } from '../../card/ChatGroup';
import { useContext } from 'react';
import { PageContext } from 'contexts/PageContext';
import ActionBar from './ActionBar';
import { useUserStore } from 'stores/UserStore';

// FUNCTIONS

function SidebarContent({ items }: { items: SidebarItem[] }) {
  const groups = useUserStore((s) => s.groups);
  const { selectedGroup } = useContext(PageContext);

  // SIDEBAR
  return (
    <>
      <Flex
        direction="column"
        height="100%"
        pt="25px"
        borderRadius="30px"
        overflow="auto"
      >
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
                <ChatGroup
                  key={group.id}
                  group={group}
                  active={selectedGroup === group.id}
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
    </>
  );
}

export default SidebarContent;
