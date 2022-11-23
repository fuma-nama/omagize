import { BoxProps, Button, Center, Flex, FlexProps, HStack, Icon, Image } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/system';
import { Reset } from '@omagize/api';
import { InputHTMLAttributes, ReactNode, useRef, useState } from 'react';
import { FaImage } from 'react-icons/fa';
import ReactCrop, { Crop } from 'react-image-crop';
import { cropImage, Format, Pick, supportedImageTypes } from 'utils/ImageUtils';
import { useFilePickerUrl } from './FilePicker';

export function useImagePickerCrop<T extends Blob | Reset>(
  value: T,
  onChange: (file: T) => void,
  format: Format,
  picker: {
    holder?: ReactNode;
    input?: InputHTMLAttributes<HTMLInputElement>;
    preview?: BoxProps;
    cropper?: FlexProps;
  } = {}
) {
  const [edit, setEdit] = useState<{
    crop: Crop | null;
    preview: string;
  } | null>();

  const filePicker = useFilePickerUrl<T>(
    value,
    (f) => {
      const url = URL.createObjectURL(f);
      setEdit({ preview: url, crop: null });
    },
    picker.input ?? {
      accept: supportedImageTypes,
    }
  );

  function onCrop(img: HTMLImageElement) {
    if (img == null) {
      setEdit(null);
    } else {
      cropImage(edit.crop, img, format).then((result) => {
        setEdit(null);
        onChange(result as T);
      });
    }
  }

  return {
    url: filePicker.url,
    picker: (
      <>
        {filePicker.picker}
        {edit ? (
          <Cropper
            value={edit}
            aspect={format.aspect}
            onChange={(v) => setEdit((prev) => ({ ...prev, crop: v }))}
            onCrop={onCrop}
            box={picker.cropper}
          />
        ) : (
          <Pick
            w="full"
            h="full"
            onClick={filePicker.select}
            rounded="xl"
            overflow="hidden"
            {...picker.preview}
          >
            {filePicker.url ? (
              <Image w="full" maxH="500px" src={filePicker.url} objectFit="contain" />
            ) : (
              picker.holder ?? <DefaultImageHolder />
            )}
          </Pick>
        )}
      </>
    ),
  };
}

export function Cropper({
  aspect,
  value,
  onChange,
  onCrop,
  box,
}: {
  value: { crop?: Crop; preview: string };
  onChange: (v: Crop) => void;
  aspect: number;
  onCrop: (element: HTMLImageElement | null) => void;
  box?: FlexProps;
}) {
  const ref = useRef<HTMLImageElement>();

  return (
    <Flex direction="column" gap={2} align="center" maxH="500px" {...box}>
      <ReactCrop aspect={aspect} crop={value.crop} onChange={onChange}>
        <Image src={value.preview} ref={ref} />
      </ReactCrop>
      <HStack>
        <Button onClick={() => onCrop(null)}>Close</Button>
        <Button variant="brand" onClick={() => onCrop(ref.current)}>
          Crop
        </Button>
      </HStack>
    </Flex>
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
