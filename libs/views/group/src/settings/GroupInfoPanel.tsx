import { Avatar, Box, Flex, Input, Text, Textarea } from '@chakra-ui/react';
import { GroupDetail } from '@omagize/api';
import { useMemberQuery } from '@omagize/data-access-api';
import { useModalImageCropper, AutoImage, Pick, useImagePicker } from '@omagize/ui/components';
import { SmallUserItem } from '@omagize/views/shared';
import { useColors } from '@omagize/ui/theme';
import { BannerFormat, AvatarFormat } from '@omagize/utils/image';
import { SettingsProps } from './GroupSettingsView';

export function GroupInfoPanel({ value, onChange, group }: SettingsProps) {
  const { textColorPrimary } = useColors();

  const cropper = useModalImageCropper();
  const banner = useImagePicker(value.banner, (f) =>
    cropper.setEditing({
      file: f,
      format: BannerFormat,
      onCrop: (blob) => onChange({ banner: blob }),
    })
  );
  const icon = useImagePicker(value.icon, (f) =>
    cropper.setEditing({
      file: f,
      format: AvatarFormat,
      onCrop: (blob) => onChange({ icon: blob }),
    })
  );

  return (
    <>
      {cropper.modal}
      {icon.component}
      {banner.component}
      <AutoImage
        cursor="pointer"
        src={banner.url ?? group.bannerUrl}
        onClick={banner.select}
        w="full"
        minH="200px"
        rounded="xl"
      />

      <Flex direction="column" px={5} gap={5} pb="5">
        <Pick onClick={icon.select} w="fit-content" mt="-60px">
          <Avatar
            variant="border"
            src={icon.url ?? group.iconUrl}
            name={value.name ?? group.name}
            w="120px"
            h="120px"
          />
        </Pick>
        <Input
          color={textColorPrimary}
          variant="flushed"
          fontSize="2xl"
          fontWeight="600"
          value={value.name ?? group.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
        <Textarea
          color={textColorPrimary}
          placeholder="Give your group a introduction"
          value={value.about ?? group.introduction}
          onChange={(e) => onChange({ about: e.target.value })}
        />
        <Owner group={group} />
      </Flex>
    </>
  );
}

function Owner({ group }: { group: GroupDetail }) {
  const query = useMemberQuery(group.id, group.owner);
  const { textColorPrimary } = useColors();
  return (
    query.isSuccess && (
      <Box pt={4} mt="auto">
        <Text fontWeight="600" fontSize="xl" color={textColorPrimary}>
          Owner
        </Text>
        <SmallUserItem user={query.data} />
      </Box>
    )
  );
}
