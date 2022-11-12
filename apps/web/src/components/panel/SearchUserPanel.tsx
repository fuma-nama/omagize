import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUserInfo, Keys, searchUser, User } from '@omagize/api';
import { SearchBar } from 'components/navbar/searchBar/SearchBar';
import { useColors } from 'variables/colors';
import LoadingPanel from 'components/panel/LoadingPanel';
import { Flex, FlexProps, Icon } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/system';
import { SmallUserItem } from 'components/card/user/UserItem';
import { BiCheckCircle, BiSearch } from 'react-icons/bi';
import { Placeholder } from 'components/layout/Container';

function ResultPlaceholder() {
  return (
    <Placeholder icon={<Icon as={BiSearch} w={10} h={10} />} p="25px">
      No Result
    </Placeholder>
  );
}

export function SearchUserIDPanel(props: {
  value?: User;
  onChange: (user: User) => void;
}) {
  const { cardBg } = useColors();
  const [id, setId] = useState('');
  const [search, setSearch] = useState<string>(null);
  const query = useQuery(Keys.user(search), () => fetchUserInfo(id), {
    enabled: search != null,
    retry: false,
  });

  const user = query.data;
  const result =
    user != null ? (
      <SelectedUserItem
        key={user.id}
        user={user}
        selected={user.id === props.value?.id}
        onClick={() => props.onChange(user)}
      />
    ) : (
      <ResultPlaceholder />
    );
  return (
    <>
      <SearchBar
        w="full"
        onSearch={() => setSearch(id)}
        input={{
          bg: cardBg,
          value: id,
          onChange: (e) => setId(e.target.value),
        }}
      />
      {query.isInitialLoading ? <LoadingPanel size="sm" p="25px" /> : result}
    </>
  );
}

export function SearchUserNamePanel(props: {
  value?: User;
  onChange: (user: User) => void;
}) {
  const { cardBg } = useColors();
  const [name, setName] = useState('');
  const [search, setSearch] = useState(null);
  const query = useQuery(['user_name', search], () => searchUser(search, 3), {
    enabled: search != null,
  });

  return (
    <Flex direction="column" gap={2}>
      <SearchBar
        w="full"
        mb={2}
        onSearch={() => {
          if (name.length > 0) {
            setSearch(name);
          }
        }}
        input={{
          bg: cardBg,
          value: name,
          type: 'search',
          onChange: (e) => setName(e.target.value),
        }}
      />
      {query.isInitialLoading && <LoadingPanel size="sm" p="25px" />}
      {query.data?.length === 0 && <ResultPlaceholder />}
      {query.data?.map((user) => (
        <SelectedUserItem
          key={user.id}
          user={user}
          selected={user.id === props.value?.id}
          onClick={() => props.onChange(user)}
        />
      ))}
    </Flex>
  );
}

export function SelectedUserItem({
  user,
  selected,
  ...props
}: { user: User; selected: boolean } & FlexProps) {
  const { textColorPrimary } = useColors();
  const green = useColorModeValue('green.200', 'green.400');

  return (
    <Flex direction="row" cursor="pointer" align="center" {...props}>
      <SmallUserItem
        user={user}
        w="full"
        color="white"
        bg={selected ? green : undefined}
      />
      {selected && (
        <Icon
          w="30px"
          h="30px"
          ml="-40px"
          as={BiCheckCircle}
          zIndex={2}
          color={textColorPrimary}
        />
      )}
    </Flex>
  );
}
