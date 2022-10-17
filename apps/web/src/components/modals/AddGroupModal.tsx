import {
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { createGroup, joinGroup } from '@omagize/api';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { MdCreate } from 'react-icons/md';
import { RiTicketFill } from 'react-icons/ri';
import { useColors } from 'variables/colors';
import CreateGroupModal, { CreateGroupForm, GroupOptions } from './CreateGroup';

export function AddGroupModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [tabIndex, setTabIndex] = useState(0);
  const JoinGroupContent = useJoinGroupContent();
  const CreateGroupContent = useCreateGroupContent();

  const createMutation = useMutation(
    ['create_group'],
    (options: GroupOptions) =>
      createGroup(options.name, options.icon, options.banner),
    {
      onSuccess() {
        onClose();
      },
    }
  );
  const joinMutation = useMutation(
    ['join_group'],
    (code: string) => joinGroup(code),
    {
      onSuccess() {
        onClose();
      },
    }
  );

  const tabs = [
    {
      text: 'Join Group',
      body: JoinGroupContent.component,
      footer: (
        <Button
          variant="brand"
          onClick={() => joinMutation.mutate(JoinGroupContent.code)}
          isLoading={joinMutation.isLoading}
        >
          Join
        </Button>
      ),
    },
    {
      text: 'Create Group',
      body: CreateGroupContent.component,
      footer: (
        <Button
          variant="brand"
          onClick={() => createMutation.mutate(CreateGroupContent.options)}
          isLoading={createMutation.isLoading}
        >
          Create
        </Button>
      ),
    },
  ];

  return (
    <>
      <CreateGroupModal isOpen={false} onClose={onClose} />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <ButtonGroup>
              {tabs.map((tab, i) => (
                <Button
                  key={i}
                  variant={tabIndex === i && 'brand'}
                  onClick={() => setTabIndex(i)}
                >
                  {tab.text}
                </Button>
              ))}
            </ButtonGroup>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>{tabs[tabIndex].body}</ModalBody>
          <ModalFooter gap={2}>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            {tabs[tabIndex].footer}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function useCreateGroupContent() {
  const [options, setOptions] = useState<GroupOptions>({ name: '' });
  const { brand } = useColors();

  return {
    options,
    component: (
      <>
        <HStack>
          <Icon as={MdCreate} color={brand} w="30px" h="30px" />
          <Text fontSize="xl" fontWeight="600">
            Create your own group
          </Text>
        </HStack>

        <CreateGroupForm
          value={options}
          onChange={(v) => setOptions((prev) => ({ ...prev, ...v }))}
          isError={false}
        />
      </>
    ),
  };
}

function useJoinGroupContent() {
  const [code, setCode] = useState('');
  const { brand } = useColors();

  return {
    code,
    component: (
      <Flex direction="column" gap={3}>
        <HStack>
          <Icon as={RiTicketFill} color={brand} w="30px" h="30px" />
          <Text fontSize="xl" fontWeight="600">
            Use your invite code
          </Text>
        </HStack>
        <Text>
          An invite code looks like: <b>3821696</b>
        </Text>

        <Input
          variant="main"
          value={code}
          placeholder="Your invite code..."
          onChange={(e) => setCode(e.target.value)}
        />
      </Flex>
    ),
  };
}
