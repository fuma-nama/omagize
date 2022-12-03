import {
  Avatar,
  Button,
  Flex,
  HStack,
  IconButton,
  PopoverTrigger,
  Text,
  useToken,
} from '@chakra-ui/react';
import { Card, FadeImage, useConfirmDialog, UserPopup } from '@omagize/ui/components';
import { ChatIcon, CloseIcon } from '@chakra-ui/icons';
import { deleteFriend, Relation } from '@omagize/api';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useColors } from '@omagize/ui/theme';

export function FriendItem({ friend }: { friend: Relation }) {
  const [brand] = useToken('color', ['brand.400']);
  const { textColorPrimary } = useColors();
  const user = friend.user;
  const navigate = useNavigate();
  const deleteMutation = useMutation(() => deleteFriend(friend.user.id));

  const deleteDialog = useConfirmDialog(
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
  const onChat = () => navigate(`/user/chat/users/${user.id}`);

  return (
    <UserPopup user={friend.user.id}>
      <Card overflow="hidden" pos="relative">
        {deleteDialog.modal}
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
          <Button leftIcon={<ChatIcon />} variant="action" onClick={onChat}>
            Chat
          </Button>
          <IconButton
            aria-label="Delete"
            icon={<CloseIcon />}
            variant="danger"
            onClick={deleteDialog.onOpen}
          />
        </HStack>
      </Card>
    </UserPopup>
  );
}
