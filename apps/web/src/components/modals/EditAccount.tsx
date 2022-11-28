import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { BiRightArrow } from 'react-icons/bi';
import { AvatarFormat, BannerFormat, UploadImage, url } from 'utils/ImageUtils';
import { useMutation } from '@tanstack/react-query';
import { dispatchSelfUser, updateProfile, useSelfUser } from '@omagize/api';
import { ProfilePicker } from '../picker/ProfilePicker';
import { Reset, SelfUser } from '@omagize/api';
import { useState } from 'react';
import { useImageCropper, useImagePicker } from 'components/picker/ImagePicker';
import { useFilePickerUrl } from 'components/picker/FilePicker';

type ProfileOptions = {
  name?: string;
  avatar?: UploadImage | Reset;
  banner?: UploadImage | Reset;
};

export default function EditAccountModal(props: { isOpen: boolean; onClose: () => void }) {
  const { isOpen, onClose } = props;

  const [value, setValue] = useState<ProfileOptions>({});
  const mutation = useMutation(
    ['edit_profile'],
    () => updateProfile(value.name, value.avatar, value.banner),
    {
      async onSuccess(updated: SelfUser) {
        setValue({});
        return dispatchSelfUser(updated);
      },
    }
  );

  const canSave =
    (!!value.name || !!value.avatar || !!value.banner) &&
    (value.name == null || value.name.length > 0);
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Form
            value={value}
            onChange={(v) => {
              if (!mutation.isLoading) {
                setValue((prev) => ({ ...prev, ...v }));
              }
            }}
          />
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            isLoading={mutation.isLoading}
            disabled={!canSave || mutation.isLoading}
            variant="brand"
            rightIcon={<BiRightArrow />}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function Form(props: {
  value: ProfileOptions;
  onChange: (options: Partial<ProfileOptions>) => void;
}) {
  const user = useSelfUser();
  const { value, onChange } = props;
  const acceptedFileTypes = '.png, .jpg, .gif';

  const [name, setName] = [value.name, (v: string) => onChange({ name: v })];
  const cropper = useImageCropper();

  const icon = useImagePicker(value.avatar, (f) =>
    cropper.setEditing({
      file: f,
      format: AvatarFormat,
      onCrop: (blob) => onChange({ avatar: blob }),
    })
  );
  const banner = useImagePicker(value.banner, (f) =>
    cropper.setEditing({
      file: f,
      format: BannerFormat,
      onCrop: (blob) => onChange({ banner: blob }),
    })
  );

  const invalid = false;

  return (
    <FormControl isInvalid={invalid} isRequired>
      <InputGroup flexDirection="column">
        {icon.component}
        {banner.component}
        {cropper.cropper ?? (
          <>
            <ProfilePicker
              selectBanner={banner.select}
              selectIcon={icon.select}
              bannerUrl={url(user.bannerUrl, banner.url)}
              iconUrl={url(user.avatarUrl, icon.url)}
              name={user.username}
            />
            <Button
              mx="auto"
              onClick={() =>
                onChange({
                  avatar: 'reset',
                  banner: 'reset',
                })
              }
            >
              Reset
            </Button>
          </>
        )}
      </InputGroup>
      <FormErrorMessage>{invalid}</FormErrorMessage>
      <FormLabel>User Name</FormLabel>
      <Input
        value={name ?? user.username}
        onChange={(e) => setName(e.target.value)}
        variant="main"
        placeholder="Give yourself a cool name"
      />
    </FormControl>
  );
}
