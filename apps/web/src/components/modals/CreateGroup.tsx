import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
} from '@chakra-ui/react';
import { useImagePickerCrop } from 'components/picker/ImagePicker';
import { ProfilePicker } from 'components/picker/ProfilePicker';
import { UploadImage, AvatarFormat, useImagePickerResize, BannerFormat } from 'utils/ImageUtils';

export type GroupOptions = {
  name: string;
  icon?: UploadImage;
  banner?: UploadImage;
};

export function CreateGroupForm({
  value,
  onChange,
  isError,
}: {
  value: GroupOptions;
  onChange: (options: Partial<GroupOptions>) => void;
  isError: boolean;
}) {
  const acceptedFileTypes = '.png, .jpg, .gif';

  const [name, setName] = [value.name, (v: string) => onChange({ name: v })];
  const icon = useImagePickerCrop(value.icon, (v) => onChange({ icon: v }), AvatarFormat);
  const banner = useImagePickerResize(value.banner, (v) => onChange({ banner: v }), BannerFormat, {
    accept: acceptedFileTypes,
  });

  return (
    <FormControl isRequired isInvalid={isError}>
      <InputGroup flexDirection="column">
        {icon.filePicker.component}
        {banner.picker}
        {icon.cropper ?? (
          <>
            <ProfilePicker
              selectBanner={banner.select}
              selectIcon={icon.filePicker.select}
              bannerUrl={banner.url}
              iconUrl={icon.url}
              name={name}
            />
            <Button
              mx="auto"
              onClick={() =>
                onChange({
                  icon: null,
                  banner: null,
                })
              }
            >
              Reset
            </Button>
          </>
        )}
      </InputGroup>
      <FormLabel>Group Name</FormLabel>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        variant="main"
        placeholder="Give your Group a name"
      />
      <FormErrorMessage>Failed to Create Group</FormErrorMessage>
    </FormControl>
  );
}
