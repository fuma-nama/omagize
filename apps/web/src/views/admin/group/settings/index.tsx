import { Avatar, Grid } from '@chakra-ui/react';
import { Group, GroupDetail, Reset, useGroupDetailQuery } from '@omagize/api';
import CustomCard from 'components/card/Card';
import LoadingScreen from 'components/screens/LoadingScreen';
import { PageContext } from 'contexts/PageContext';
import { useContext, useState } from 'react';
import {
  AvatarFormat,
  UploadImage,
  useImagePickerCrop,
} from 'utils/ImageUtils';
type Options = {
  name?: string;
  icon?: UploadImage | Reset;
};

export default function GroupSettings() {
  const { selectedGroup } = useContext(PageContext);
  const group = useGroupDetailQuery(selectedGroup);
  const [value, setValue] = useState<Options>({});

  if (group.isLoading || group.isError) return <LoadingScreen />;
  return (
    <Grid>
      <Info
        value={value}
        onChange={(d) => setValue((prev) => ({ ...prev, ...d }))}
        group={group.data}
      />
    </Grid>
  );
}

function Info({
  value,
  onChange,
  group,
}: {
  value: Options;
  onChange: (data: Partial<Options>) => void;
  group: GroupDetail;
}) {
  const icon = useImagePickerCrop(
    value.icon,
    (f) => onChange({ icon: f }),
    AvatarFormat
  );

  return (
    <CustomCard>
      {icon.picker}
      <Avatar src={icon.url ?? group.iconUrl} name={value.name ?? group.name} />
    </CustomCard>
  );
}
