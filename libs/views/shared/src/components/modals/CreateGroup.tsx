import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
} from '@chakra-ui/react';
import { useImageCropper, useImagePicker, ProfilePicker } from '@omagize/ui/components';
import { UploadImage, AvatarFormat, BannerFormat } from '@omagize/utils/image';

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
  const [name, setName] = [value.name, (v: string) => onChange({ name: v })];
  const cropper = useImageCropper();
  const icon = useImagePicker(value.icon, (f) =>
    cropper.setEditing({
      file: f,
      format: AvatarFormat,
      onCrop: (blob) => onChange({ icon: blob }),
    })
  );
  const banner = useImagePicker(value.banner, (f) =>
    cropper.setEditing({
      file: f,
      format: BannerFormat,
      onCrop: (blob) => onChange({ banner: blob }),
    })
  );

  return (
    <FormControl isRequired isInvalid={isError}>
      <InputGroup flexDirection="column">
        {icon.component}
        {banner.component}
        {cropper.cropper ?? (
          <>
            <ProfilePicker
              selectBanner={banner.select}
              selectIcon={icon.select}
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
