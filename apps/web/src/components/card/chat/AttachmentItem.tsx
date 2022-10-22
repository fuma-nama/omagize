import { Attachment } from '@omagize/api';
import { Flex, Icon, Image, Link, Text } from '@chakra-ui/react';
import { fileSizeString } from 'utils/common';
import { useMemo } from 'react';
import { FiFile } from 'react-icons/fi';
import CustomCard from '../Card';

export function AttachmentItem({ attachment }: { attachment: Attachment }) {
  if (attachment.type != null && attachment.type.startsWith('image'))
    return <Image rounded="lg" src={attachment.url} maxW="min(1000px, 100%)" />;

  return <FileItem attachment={attachment} />;
}

export function FileItem({ attachment }: { attachment: Attachment }) {
  const color = 'cyan.400';
  const size = useMemo(
    () => fileSizeString(attachment.size ?? 0),
    [attachment.size]
  );

  return (
    <CustomCard w="fit-content" flexDirection="row" gap={2} pr={10}>
      <Icon as={FiFile} w={10} h={10} color={color} />
      <Flex direction="column">
        <Link fontWeight="600" color={color} href={attachment.url}>
          {attachment.name}
        </Link>
        <Text>{size}</Text>
      </Flex>
    </CustomCard>
  );
}
