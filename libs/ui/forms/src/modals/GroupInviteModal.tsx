import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  Input,
  FormLabel,
} from '@chakra-ui/react';
import {
  dispatchGroupInvite,
  Group,
  GroupInvite,
  modifyGroupInvite,
  useGroupInviteQuery,
} from '@omagize/api';
import { QueryStatus, LoadingPanel, DatePicker, SwitchField } from '@omagize/ui/components';
import { onlyDate } from '@omagize/utils/common';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

type Options = {
  expireEnabled: boolean;
  once?: boolean;
  expire?: Date;
};

function getExpireDateMin() {
  const min = onlyDate(new Date(Date.now()));
  min.setDate(min.getDate() + 1);

  return min;
}

export function GroupInviteModal({
  group,
  isOpen,
  onClose,
}: {
  group: Group;
  isOpen: boolean;
  onClose: () => void;
}) {
  const query = useGroupInviteQuery(group.id, {
    enabled: isOpen,
  });
  const [options, setOptions] = useState<Partial<Options>>({});

  const invite = query.data;
  const value: Options = {
    once: invite?.once,
    expire: invite?.expireAt ?? getExpireDateMin(),
    expireEnabled: invite?.expireAt != null,
    ...options,
  };

  const mutation = useMutation(
    ['regenerate_group_invite', group.id],
    () => modifyGroupInvite(group.id, value.once, value.expireEnabled ? value.expire : null),
    {
      onSuccess(invite) {
        setOptions({});
        dispatchGroupInvite(invite);
      },
    }
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Invite Peoples</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <QueryStatus
            query={query}
            error="Failed to get Invite code"
            loading={<LoadingPanel size="sm" />}
          >
            <InviteForm
              invite={invite}
              options={value}
              onChange={(v) => setOptions((prev) => ({ ...prev, ...v }))}
            />
          </QueryStatus>
        </ModalBody>
        <ModalFooter gap={2}>
          <Button variant="action" isLoading={mutation.isLoading} onClick={() => mutation.mutate()}>
            Create new Code
          </Button>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function InviteForm({
  invite,
  options,
  onChange,
}: {
  invite: GroupInvite;
  options: Options;
  onChange: (options: Partial<Options>) => void;
}) {
  return (
    <FormControl>
      <FormLabel htmlFor="code" fontWeight="600" fontSize="lg">
        Invite Code
      </FormLabel>
      <Input id="code" variant="main" disabled value={invite.code} mb="10px" />
      <SwitchField
        label="Once only"
        id="once"
        desc="The invite can only be used once"
        isChecked={options.once}
        onChange={(e) => onChange({ once: e.target.checked })}
      />
      <SwitchField
        label="Expire"
        id="expire"
        isChecked={options.expireEnabled}
        onChange={(e) =>
          onChange({
            expireEnabled: e.target.checked,
          })
        }
      />
      <DatePicker
        minDate={getExpireDateMin()}
        toggler={{
          disabled: !options.expireEnabled,
        }}
        value={options.expire ?? getExpireDateMin()}
        onChange={(v: Date) => onChange({ expire: v })}
      />
    </FormControl>
  );
}
