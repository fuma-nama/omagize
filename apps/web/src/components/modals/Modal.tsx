import React, { Fragment, ReactNode, useEffect, useRef, useState } from 'react';
import { Pick } from 'utils/ImageUtils';
import {
  Center,
  useColorModeValue,
  Image,
  HStack,
  Button,
  ButtonProps,
  Icon,
  Avatar,
  SimpleGrid,
} from '@chakra-ui/react';
import ReactCrop, { Crop } from 'react-image-crop';
import { FaImage } from 'react-icons/fa';
import { MutableRefObject } from 'react';
import { DatePicker } from 'components/picker/DatePicker';
import { TimePicker } from 'components/picker/TimePicker';
import { applyDate } from 'utils/DateUtils';

export type CropImage = Crop | null;
export type CropOptions = {
  preview: string;
  crop: CropImage;
  setCrop: (crop: CropImage) => void;
  /**
   * Crop image, or ignore if null
   */
  onCrop: (img: HTMLImageElement | null) => void;
};

export function ImageCropPicker(
  props: {
    select: () => void;
    url: string | null;
  } & CropProps
) {
  const bannerBg = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

  if (props.crop) {
    return (
      <ImageCropper
        crop={props.crop}
        buttonStyle={props.buttonStyle}
        aspect={props.aspect}
      />
    );
  }

  return (
    <Pick w="full" onClick={props.select} rounded="xl" overflow="hidden">
      {props.url ? (
        <Image w="full" maxH="500px" src={props.url} objectFit="contain" />
      ) : (
        <Center w="full" h="200px" bg={bannerBg} p={5}>
          <Icon as={FaImage} w="100px" h="50px" />
        </Center>
      )}
    </Pick>
  );
}

export function ProfileCropPicker(props: ProfilePickerProps & CropProps) {
  if (props.crop) {
    return (
      <ImageCropper
        crop={props.crop}
        buttonStyle={props.buttonStyle}
        aspect={props.aspect ?? 1}
      />
    );
  }

  return <ProfilePicker {...props} />;
}

export type CropProps = {
  crop: CropOptions;
  buttonStyle?: ButtonProps;
  aspect?: number;
};

export function CustomImageCropper(props: {
  img: MutableRefObject<HTMLImageElement>;
  crop: CropOptions;
  aspect?: number;
}) {
  if (props.crop) {
    const { preview, crop, setCrop } = props.crop;

    return (
      <ReactCrop aspect={props.aspect} crop={crop} onChange={(v) => setCrop(v)}>
        <Image src={preview} ref={props.img} />
      </ReactCrop>
    );
  }
}

function ImageCropper(props: CropProps) {
  const ref = useRef<HTMLImageElement>();

  if (props.crop) {
    return (
      <>
        <CustomImageCropper crop={props.crop} aspect={props.aspect} img={ref} />
        <HStack justify="center" mt={3}>
          <Button onClick={() => props.crop.onCrop(null)}>Close</Button>
          <Button
            {...props.buttonStyle}
            variant="action"
            onClick={() => props.crop.onCrop(ref.current)}
          >
            Done
          </Button>
        </HStack>
      </>
    );
  }
}

export type ProfilePickerProps = {
  selectBanner: () => void;
  selectIcon: () => void;
  bannerUrl: string;
  iconUrl: string;
  name?: string;
};
export function ProfilePicker(props: ProfilePickerProps) {
  const bannerBg = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

  return (
    <Center
      onClick={props.selectBanner}
      w="full"
      bg={props.bannerUrl ? null : bannerBg}
      bgImg={props.bannerUrl}
      bgSize="cover"
      p={5}
      my={2}
      rounded="xl"
      _hover={{ cursor: 'pointer' }}
    >
      <Pick
        onClick={(e) => {
          props.selectIcon();
          e.stopPropagation();
        }}
      >
        <Avatar
          border="auto"
          borderWidth={2}
          borderStyle="solid"
          borderColor="navy.800"
          src={props.iconUrl}
          name={props.name}
          size="xl"
        />
      </Pick>
    </Center>
  );
}

/**
 * Detects when modal is re-opened, reset its state before opening it
 * @param isOpen
 * @param children
 * @constructor
 */
export function DynamicModal({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: ReactNode;
}) {
  const [id, setId] = useState(0);
  useEffect(() => {
    if (isOpen) {
      setId((prev) => prev + 1);
    }
  }, [isOpen]);

  return (
    <>
      <Fragment key={id}>{children}</Fragment>
    </>
  );
}

export function DateTimeForm(props: {
  min?: Date;
  max?: Date;
  value?: Date;
  onChange: (date: Date) => void;
}) {
  return (
    <SimpleGrid columns={{ base: 1, '2sm': 2 }} gap={4}>
      <DatePicker
        minDate={props.min}
        maxDate={props.max}
        value={props.value}
        onChange={(date: Date) => {
          const combined = new Date(date);
          if (!!props.value) {
            combined.setHours(props.value.getHours(), props.value.getMinutes());
          }
          props.onChange(combined);
        }}
      />
      <TimePicker
        value={
          !!props.value && {
            hours: props.value.getHours(),
            minutes: props.value.getMinutes(),
          }
        }
        onChange={(v) => props.onChange(applyDate(props.value, v))}
      />
    </SimpleGrid>
  );
}
