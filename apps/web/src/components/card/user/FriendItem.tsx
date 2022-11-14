import { Avatar, Button, Flex, HStack, IconButton, Text, useToken } from '@chakra-ui/react';
import { useColors } from '../../../variables/colors';
import Card from '../Card';
import FadeImage from '../utils/FadeImage';
import { ChatIcon, CloseIcon } from '@chakra-ui/icons';
import { deleteFriend, Relation } from '@omagize/api';
import { useConfirmDialog } from 'components/modals/dialogs/Dialog';
import { useMutation } from '@tanstack/react-query';
import { UserPopup } from 'components/modals/popup/UserPopup';
import { PopoverTrigger } from 'components/PopoverTrigger';

export function FriendItem({ friend }: { friend: Relation }) {
  const [brand] = useToken('color', ['brand.400']);
  const { textColorPrimary } = useColors();
  const user = friend.user;
  const deleteMutation = useMutation(() => deleteFriend(friend.user.id));
  const dialog = useConfirmDialog(
    {
      header: 'Confirm',
      message: 'Do you sure you want to end the friendship?',
    },
    (onClose) => (
      <Button
        isLoading={deleteMutation.isLoading}
        variant="danger"
        onClick={() => {
          deleteMutation.mutateAsync().then(() => {
            onClose();
          });
        }}
      >
        Yes
      </Button>
    )
  );

  return (
    <UserPopup user={friend.user.id}>
      <Card overflow="hidden" pos="relative">
        {dialog.modal}
        <FadeImage
          direction="to left"
          src={user.bannerUrl}
          placeholder={brand}
          percent={60}
          opacity={50}
        />

        <HStack gap="10px" pos="relative" align="start">
          <PopoverTrigger>
            <Avatar name={user.username} src={user.avatarUrl} variant="normal" />
          </PopoverTrigger>
          <Flex direction="column">
            <PopoverTrigger>
              <Text color={textColorPrimary} fontSize="xl" fontWeight="bold">
                {user.username}
              </Text>
            </PopoverTrigger>

            <Text color={textColorPrimary}>{user.description}</Text>
          </Flex>
        </HStack>
        <HStack ml="auto" align="end">
          <Button leftIcon={<ChatIcon />} variant="action">
            Chat
          </Button>
          <IconButton
            aria-label="Delete"
            icon={<CloseIcon />}
            variant="danger"
            onClick={dialog.onOpen}
          />
        </HStack>
      </Card>
    </UserPopup>
  );
}
