import { BoxProps, Button, Center, Flex, FlexProps, HStack, Icon, Image } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/system';
import { Reset } from '@omagize/api';
import { InputHTMLAttributes, ReactElement, RefObject, useRef, useState } from 'react';
import { FaImage } from 'react-icons/fa';
import { Format, supportedImageTypes, useImageUrl } from '@omagize/utils/image';
import { FilePicker } from './FilePicker';
import 'cropperjs/dist/cropper.css';
import { Cropper, ReactCropperElement } from 'react-cropper';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { Pick } from '../layout/Pick';

export function useImagePicker<T extends Blob | Reset>(
  value: T,
  onChange: (file: File) => void,
  props?: InputHTMLAttributes<HTMLInputElement>
) {
  const ref = useRef<HTMLInputElement>();
  const url = useImageUrl(value);

  return {
    select() {
      ref.current.click();
    },
    component: (
      <FilePicker
        inputRef={ref}
        onChange={(files) => onChange(files[0])}
        input={{
          accept: supportedImageTypes,
          ...props,
        }}
      />
    ),
    url,
  };
}

export type SimplePickerProps = BasePickerProps & {
  holder?: ReactElement;
  preview?: BoxProps;
};

export function useImagePickerCropSimple<T extends Blob | Reset>(
  value: T,
  onChange: (file: T) => void,
  format: Format,
  picker: SimplePickerProps = {}
) {
  const base = useImagePickerCrop(value, onChange, format, picker);

  return {
    ...base,
    component: (
      <>
        {base.component}
        {base.cropper ?? (
          <Pick
            w="full"
            h="full"
            onClick={base.select}
            rounded="xl"
            overflow="hidden"
            {...picker.preview}
          >
            {base.url ? (
              <Image w="full" maxH="500px" src={base.url} objectFit="contain" />
            ) : (
              picker.holder ?? <DefaultImageHolder />
            )}
          </Pick>
        )}
      </>
    ),
  };
}

export type BasePickerProps = {
  input?: InputHTMLAttributes<HTMLInputElement>;
  cropper?: FlexProps;
};
export function useImagePickerCrop<T extends Blob | Reset>(
  value: T,
  onChange: (file: T) => void,
  format: Format,
  picker: BasePickerProps = {}
) {
  const { setEditing, cropper } = useImageCropper({ box: picker.cropper });
  const { url, component, select } = useImagePicker(value, (f) =>
    setEditing({
      file: f,
      format: format,
      onCrop: (blob) => onChange(blob as T),
    })
  );

  return {
    cancelEdit: () => setEditing(null),
    url: url,
    component,
    select,
    cropper: cropper,
  };
}

export type CropTask = {
  file: Blob;
  format: Format;
  onCrop: (element: Blob) => void;
};
export function useImageCropper({ box }: { box?: FlexProps } = {}) {
  const [editing, setEditing] = useState<CropTask>(null);
  const preview = useImageUrl(editing?.file);

  return {
    editing,
    setEditing,
    cropper: editing && (
      <ImageCropper
        preview={preview}
        format={editing.format}
        box={box}
        onCrop={(blob) => {
          editing.onCrop(blob);
          setEditing(null);
        }}
        onClose={() => setEditing(null)}
      />
    ),
  };
}

export function ImageCropper({
  preview,
  format,
  box,
  onCrop,
  onClose,
}: {
  preview: string;
  format: Format;
  onCrop: (element: Blob) => void;
  onClose: () => void;
  box?: FlexProps;
}) {
  const cropperRef = useRef<ReactCropperElement>(null);
  const save = useCropMutation(
    cropperRef,
    (cropper) =>
      cropper.getCroppedCanvas({ maxWidth: format.maxWidth, maxHeight: format.maxHeight }),
    {
      onSuccess: (blob) => onCrop(blob),
    }
  );

  return (
    <Flex direction="column" gap={2} align="center" maxH="500px" {...box}>
      <Cropper
        src={preview}
        style={{ height: 400, width: '100%' }}
        aspectRatio={format.aspect}
        viewMode={1}
        guides={false}
        ref={cropperRef}
      />
      <HStack>
        <Button onClick={onClose}>Close</Button>
        <Button isLoading={save.isLoading} variant="brand" onClick={() => save.mutate()}>
          Crop
        </Button>
      </HStack>
    </Flex>
  );
}

function useCropMutation(
  cropperRef: RefObject<ReactCropperElement>,
  crop: (cropper: Cropper) => HTMLCanvasElement = (cropper) => cropper.getCroppedCanvas(),
  options?: Omit<UseMutationOptions<Blob, unknown, void, unknown>, 'mutationFn'>
) {
  return useMutation<Blob | null>(
    () =>
      new Promise<Blob>((resolve, reject) => {
        const element = cropperRef.current;
        if (element == null) return reject('Cropper ref is null');
        const cropper = element.cropper;

        crop(cropper).toBlob((blob) => resolve(blob));
      }),
    options
  );
}

export function DefaultImageHolder() {
  const bannerBg = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

  return (
    <Center w="full" h="200px" bg={bannerBg} p={5}>
      <Icon as={FaImage} w="100px" h="50px" />
    </Center>
  );
}
