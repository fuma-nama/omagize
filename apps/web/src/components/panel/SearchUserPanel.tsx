import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUserInfo, Keys, searchUser, User } from '@omagize/api';
import { useColors } from 'variables/colors';
import { Flex, FlexProps, Icon } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/system';
import { SmallUserItem } from 'components/card/user/UserItem';
import { BiCheckCircle, BiErrorCircle, BiSearch } from 'react-icons/bi';
import { Placeholder } from 'components/layout/Container';

export function useSearchUsernameQuery() {
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

export function useSearchUserIdQuery() {
  const [search, setSearch] = useState<string>(null);

  const query = useQuery(Keys.user(search), () => fetchUserInfo(search), {
    enabled: search != null,
    retry: false,
  });

  return {
    query,
    setSearch,
  };
}

export function ResultPlaceholder() {
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
