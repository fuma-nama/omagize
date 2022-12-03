import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUserInfo, searchUser, User } from '@omagize/api';
import {
  Box,
  Flex,
  FlexProps,
  Icon,
  ModalBody,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/system';
import { BiCheckCircle, BiErrorCircle, BiSearch } from 'react-icons/bi';
import { useColors } from '@omagize/ui/theme';
import { SmallUserItem } from '@omagize/ui/items';
import { Placeholder } from '@omagize/ui/components';
import {
  SearchBar,
  TabButton,
  QueryStatusLayout,
  LoadingPanel,
  QueryStatus,
} from '@omagize/ui/components';
import { Keys } from '@omagize/data-access-api';

export enum Tab {
  ByName = 0,
  ById = 1,
}

export function SearchPanel({
  value,
  onChange,
  invalid,
}: {
  value: User;
  onChange: (user: User) => void;
  invalid?: boolean;
}) {
  const [tab, setTab] = useState<Tab>(0);
  const [search, setSearch] = useState('');

  const nameQuery = useSearchUsernameQuery();
  const idQuery = useSearchUserIdQuery();

  const { cardBg } = useColors();

  const onSearch = () => {
    if (search.trim().length === 0) return;

    switch (tab) {
      case Tab.ByName: {
        nameQuery.setSearch(search);
        break;
      }
      case Tab.ById: {
        idQuery.setSearch(search);
        break;
      }
    }
  };

  const userItem = (user: User) => (
    <SelectedUserItem
      key={user.id}
      user={user}
      selected={user.id === value?.id}
      onClick={() => onChange(user)}
      invalid={invalid}
    />
  );

  return (
    <>
      <Box w="full" px={4}>
        <SearchBar
          w="full"
          onSearch={onSearch}
          input={{
            bg: cardBg,
            value: search,
            type: 'search',
            onChange: (e) => setSearch(e.target.value),
          }}
        />
      </Box>
      <ModalBody>
        <Tabs
          variant="soft-rounded"
          index={tab}
          onChange={setTab}
          display="flex"
          flexDirection="column"
        >
          <TabList>
            <TabButton>By Name</TabButton>
            <TabButton>User ID</TabButton>
          </TabList>

          <TabPanels overflow="auto" minH="100px">
            <TabPanel px={0}>
              <QueryStatusLayout
                query={nameQuery.query}
                watch={nameQuery.query.data}
                placeholder={<ResultPlaceholder />}
                loading={nameQuery.query.isInitialLoading && <LoadingPanel size="sm" />}
                container={(c) => <Flex direction="column" children={c} />}
                error="Failed to search users"
              >
                {nameQuery.query.data?.map((user) => userItem(user))}
              </QueryStatusLayout>
            </TabPanel>
            <TabPanel px={0}>
              <QueryStatus
                query={idQuery.query}
                loading={idQuery.query.isInitialLoading && <LoadingPanel size="sm" />}
                error="Failed to search user"
              >
                {idQuery.query.data && userItem(idQuery.query.data)}
              </QueryStatus>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ModalBody>
    </>
  );
}

function useSearchUsernameQuery() {
  const [search, setSearch] = useState<string>(null);

  const query = useQuery(['user_name', search], () => searchUser(search, 3, true), {
    enabled: search != null,
    retry: false,
  });

  return {
    query,
    setSearch,
  };
}

function useSearchUserIdQuery() {
  const [search, setSearch] = useState<string>(null);

  const query = useQuery(Keys.searchUser(search), () => fetchUserInfo(search), {
    enabled: search != null,
    retry: false,
  });

  return {
    query,
    setSearch,
  };
}

function ResultPlaceholder() {
  return (
    <Placeholder icon={<Icon as={BiSearch} w={10} h={10} />} p="25px">
      No Result
    </Placeholder>
  );
}

export function SelectedUserItem({
  user,
  selected,
  invalid,
  ...props
}: { user: User; selected: boolean; invalid?: boolean } & FlexProps) {
  const { textColorPrimary } = useColors();
  const green = useColorModeValue('green.200', 'green.400');
  const red = useColorModeValue('red.200', 'red.400');

  return (
    <Flex direction="row" cursor="pointer" align="center" {...props}>
      <SmallUserItem
        user={user}
        w="full"
        color="white"
        bg={selected ? (invalid ? red : green) : undefined}
      />
      {selected && (
        <Icon
          w="30px"
          h="30px"
          ml="-40px"
          as={invalid ? BiErrorCircle : BiCheckCircle}
          zIndex={2}
          color={textColorPrimary}
        />
      )}
    </Flex>
  );
}
