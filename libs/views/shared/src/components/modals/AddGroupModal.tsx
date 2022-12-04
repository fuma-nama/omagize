import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
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
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useModalContext,
} from '@chakra-ui/react';
import { createGroup, joinGroup } from '@omagize/api';
import { TabButton } from '@omagize/ui/components';
import { useColors } from '@omagize/ui/theme';
import { useMutation } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { MdCreate } from 'react-icons/md';
import { RiTicketFill } from 'react-icons/ri';
import { CreateGroupForm, GroupOptions } from './CreateGroup';

export function AddGroupModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <Tabs>
          <ModalHeader as={TabList}>
            <TabButton roundedBottom={0}>Join Group</TabButton>
            <TabButton roundedBottom={0}>Create Group</TabButton>
          </ModalHeader>
          <TabPanels>
            <TabPanel as={Flex} flexDirection="column" gap={3}>
              <JoinGroupContent />
            </TabPanel>
            <TabPanel as={Flex} flexDirection="column" gap={3}>
              <CreateGroupContent />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ModalContent>
    </Modal>
  );
}

function CreateGroupContent() {
  const { onClose } = useModalContext();
  const [options, setOptions] = useState<GroupOptions>({ name: '' });
  const { brand } = useColors();
  const mutation = useMutation(
    ['create_group'],
    (options: GroupOptions) => createGroup(options.name, options.icon, options.banner),
    {
      onSuccess() {
        onClose();
      },
    }
  );

  return (
    <>
      <ModalBody>
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
      </ModalBody>

      <ContentFooter>
        <Button
          variant="brand"
          onClick={() => mutation.mutate(options)}
          disabled={mutation.isLoading || options.name.trim().length === 0}
          isLoading={mutation.isLoading}
        >
          Create
        </Button>
      </ContentFooter>
    </>
  );
}

function JoinGroupContent() {
  const { onClose } = useModalContext();
  const [code, setCode] = useState('');
  const { brand } = useColors();
  const mutation = useMutation(['join_group'], (code: string) => joinGroup(code), {
    onSuccess() {
      onClose();
    },
  });

  return (
    <>
      <ModalBody flexDirection="column">
        <HStack>
          <Icon as={RiTicketFill} color={brand} w="30px" h="30px" />
          <Text fontSize="xl" fontWeight="600">
            Use your invite code
          </Text>
        </HStack>
        <Text>
          An invite code looks like: <b>3821696</b>
        </Text>

        <FormControl isInvalid={mutation.isError}>
          <Input
            mt={3}
            variant="main"
            value={code}
            placeholder="Your invite code..."
            onChange={(e) => setCode(e.target.value)}
          />
          <FormErrorMessage>{mutation.error?.toString()}</FormErrorMessage>
        </FormControl>
      </ModalBody>
      <ContentFooter>
        <Button
          variant="brand"
          onClick={() => mutation.mutate(code)}
          isLoading={mutation.isLoading}
          disabled={mutation.isLoading || code.trim().length === 0}
        >
          Join
        </Button>
      </ContentFooter>
    </>
  );
}

function ContentFooter({ children }: { children: ReactNode }) {
  const { onClose } = useModalContext();

  return (
    <ModalFooter gap={2}>
      <Button onClick={onClose}>Close</Button>
      {children}
    </ModalFooter>
  );
}
