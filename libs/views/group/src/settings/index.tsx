import {
  Button,
  ButtonGroup,
  Flex,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { GroupDetail, updateGroup, UpdateGroupOptions, useGroupDetailQuery } from '@omagize/api';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { InfoContent } from './Info';
import { RolePanel } from './RolePanel';
import { TabButton, SaveBar, Card, LoadingPanel, SwitchField } from '@omagize/ui/components';
import { useSelected } from '@omagize/utils/route-utils';

export type SettingsProps = {
  value: UpdateGroupOptions;
  onChange: (e: Partial<UpdateGroupOptions>) => void;
  group: GroupDetail;
};

export function GroupSettingsView() {
  const { selectedGroup } = useSelected();
  const query = useGroupDetailQuery(selectedGroup);

  const [value, setValue] = useState<UpdateGroupOptions>({});
  const onChange = (d: Partial<UpdateGroupOptions>) => setValue((prev) => ({ ...prev, ...d }));

  if (query.isLoading || query.isError) return <LoadingPanel size="sm" />;
  return (
    <Tabs variant="soft-rounded" mb="50px">
      <TabList>
        <TabButton fontSize="xl" px={5}>
          Info
        </TabButton>
        <TabButton fontSize="xl" px={5}>
          Roles
        </TabButton>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Flex direction={{ base: 'column', lg: 'row' }} gap={3} align="stretch">
            <Info value={value} onChange={onChange} group={query.data} />
            <EditOptions value={value} onChange={onChange} group={query.data} />
          </Flex>
          <GroupSaveBar value={value} group={query.data} reset={() => setValue({})} />
        </TabPanel>
        <TabPanel>
          <RolePanel groupId={selectedGroup} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

function GroupSaveBar({
  value,
  group,
  reset,
}: {
  value: UpdateGroupOptions;
  group: GroupDetail;
  reset: () => void;
}) {
  const mutation = useMutation(['update_settings', group.id], () => updateGroup(group.id, value), {
    onSuccess() {
      reset();
    },
  });

  return (
    <SaveBar isOpen={Object.entries(value).length !== 0}>
      <ButtonGroup isDisabled={mutation.isLoading} ml="auto">
        <Button
          rounded="full"
          colorScheme="green"
          isLoading={mutation.isLoading}
          onClick={() => mutation.mutate()}
        >
          Save
        </Button>
        <Button rounded="full" onClick={reset}>
          Discard
        </Button>
      </ButtonGroup>
    </SaveBar>
  );
}

function Info({ value, onChange, group }: SettingsProps) {
  return (
    <Card w={{ base: '100%', lg: '700px' }}>
      <InfoContent value={value} onChange={onChange} group={group} />
    </Card>
  );
}

function EditOptions({ value, onChange }: SettingsProps) {
  return (
    <Flex direction="column" gap={5} w={{ base: '100%', lg: '400px' }} p={5}>
      <Text fontSize="2xl" fontWeight="600" mb="10px">
        Options
      </Text>
      <SwitchField
        id="mentions"
        label="Allow Mention Everyone"
        isChecked={value.mentionEveryone === true}
        onChange={(e) => onChange({ mentionEveryone: e.target.checked })}
      />
    </Flex>
  );
}
