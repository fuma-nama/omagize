import { Avatar, Box, Flex, Input, Text, Textarea } from '@chakra-ui/react';
import { GroupDetail, useMemberQuery } from '@omagize/api';
import { SmallUserItem } from 'components/card/UserItem';
import AutoImage from 'components/card/utils/AutoImage';
import { CropImageModal } from 'components/modals/CropImageModal';
import {
  AvatarFormat,
  BannerFormat,
  Pick,
  useImagePickerCrop,
  useImagePickerResize,
} from 'utils/ImageUtils';
import { useColors } from 'variables/colors';
import { SettingsProps } from './index';

export function InfoContent({ value, onChange, group }: SettingsProps) {
  const { textColorPrimary, brand, globalBg } = useColors();

  const banner = useImagePickerResize(
    value.banner,
    (f) => onChange({ banner: f }),
    BannerFormat
  );
  const icon = useImagePickerCrop(
    value.icon,
    (f) => onChange({ icon: f }),
    AvatarFormat
  );

  return (
    <>
      <CropImageModal crop={icon.crop} aspect={AvatarFormat.aspect} />

      {icon.picker}
      {banner.picker}
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
          _focus={{
            borderColor: brand,
          }}
          fontSize="2xl"
          fontWeight="600"
          value={value.name ?? group.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
        <Textarea
          color={textColorPrimary}
          fontSize="md"
          bg={globalBg}
          rounded="lg"
          border={0}
          placeholder="Give your group a introduction"
          _focus={{}}
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
