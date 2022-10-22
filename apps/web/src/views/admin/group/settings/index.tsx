import { WarningIcon } from '@chakra-ui/icons';
import {
  Button,
  ButtonGroup,
  Center,
  Flex,
  Slide,
  Text,
} from '@chakra-ui/react';
import {
  GroupDetail,
  updateGroup,
  UpdateGroupOptions,
  useGroupDetailQuery,
} from '@omagize/api';
import { useMutation } from '@tanstack/react-query';
import CustomCard, { TagFlex } from 'components/card/Card';
import SwitchField from 'components/fields/SwitchField';
import LoadingScreen from 'components/layout/LoadingScreen';
import { PageContext } from 'contexts/PageContext';
import { useContext, useEffect, useState } from 'react';
import { useColors } from 'variables/colors';
import { InfoContent } from './Info';

export type SettingsProps = {
  value: UpdateGroupOptions;
  onChange: (e: Partial<UpdateGroupOptions>) => void;
  group: GroupDetail;
};

export default function GroupSettings() {
  const { selectedGroup, setInfo } = useContext(PageContext);
  const query = useGroupDetailQuery(selectedGroup);

  const [value, setValue] = useState<UpdateGroupOptions>({});
  const onChange = (d: Partial<UpdateGroupOptions>) =>
    setValue((prev) => ({ ...prev, ...d }));

  useEffect(
    () => setInfo({ title: query.isLoading ? null : query.data.name }),
    [query.data]
  );

  if (query.isLoading || query.isError) return <LoadingScreen />;
  return (
    <>
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        gap={3}
        mb="50px"
        align="stretch"
      >
        <Info value={value} onChange={onChange} group={query.data} />
        <EditOptions value={value} onChange={onChange} group={query.data} />
      </Flex>
      <SaveBar value={value} group={query.data} reset={() => setValue({})} />
    </>
  );
}

function SaveBar({
  value,
  group,
  reset,
}: {
  value: UpdateGroupOptions;
  group: GroupDetail;
  reset: () => void;
}) {
  const mutation = useMutation(
    ['update_settings', group.id],
    () => updateGroup(group.id, value),
    {
      onSuccess() {
        reset();
      },
    }
  );
  const { cardBg, textColorPrimary, shadow } = useColors();

  return (
    <Slide in={Object.entries(value).length !== 0} direction="bottom">
      <Center mb="20px" zIndex="popover" px={5}>
        <TagFlex bg={cardBg} minW="fit-content" w="500px" shadow={shadow}>
          <WarningIcon w="40px" h="40px" color="orange.300" />
          <Text fontWeight="600" color={textColorPrimary}>
            Save Changes
          </Text>

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
        </TagFlex>
      </Center>
    </Slide>
  );
}

function Info({ value, onChange, group }: SettingsProps) {
  return (
    <CustomCard w={{ base: '100%', lg: '700px' }}>
      <InfoContent value={value} onChange={onChange} group={group} />
    </CustomCard>
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
