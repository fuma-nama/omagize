import {
  Center,
  HStack,
  Icon,
  IconButton,
  Image,
  Text,
} from '@chakra-ui/react';
import CustomCard from 'components/card/Card';
import { useColors } from 'variables/colors';
import { RiFile2Fill } from 'react-icons/ri';
import { CloseIcon } from '@chakra-ui/icons';
import { useEffect, useMemo } from 'react';

export function FileUploadItem({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) {
  const { brand } = useColors();
  let preview;

  if (file.type.startsWith('image')) {
    preview = <ImagePreview file={file} />;
  } else {
    preview = <Icon as={RiFile2Fill} color={brand} w="100px" h="100px" />;
  }

  return (
    <CustomCard w="300px" h="300px">
      <HStack pos="absolute" top={2} right={2}>
        <IconButton
          icon={<CloseIcon />}
          aria-label="remove"
          colorScheme="red"
          onClick={onRemove}
        />
      </HStack>
      <Center flex={1} rounded="xl">
        {preview}
      </Center>
      <Text mt={3}>{file.name}</Text>
    </CustomCard>
  );
}

export function ImagePreview({ file }: { file: File }) {
  const url = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => {
    return () => URL.revokeObjectURL(url);
  }, [url]);

  if (url != null) return <Image src={url} />;
  else return <></>;
}
