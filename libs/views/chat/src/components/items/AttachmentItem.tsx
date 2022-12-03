import { Attachment } from '@omagize/api';
import { Flex, Icon, Image, Link, Skeleton, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import { FiFile } from 'react-icons/fi';
import { DownloadIcon } from '@chakra-ui/icons';
import { Card } from '@omagize/ui/components';
import { fileSizeString } from '@omagize/utils/common';

export function AttachmentItem({ attachment }: { attachment: Attachment }) {
  if (attachment.type != null && attachment.type.startsWith('image'))
    return (
      <Image rounded="lg" src={attachment.url} maxW={400} maxH={400} fallback={<ImageSkeleton />} />
    );

  return <FileItem attachment={attachment} />;
}

function ImageSkeleton() {
  return <Skeleton rounded="xl" w={300} h={200} maxW="full" />;
}

export function FileItem({ attachment }: { attachment: Attachment }) {
  const color = 'cyan.400';
  const size = useMemo(() => fileSizeString(attachment.size ?? 0), [attachment.size]);

  return (
    <Card w="fit-content" flexDirection="row" gap={2}>
      <Icon as={FiFile} w={10} h={10} color={color} />
      <Flex direction="column" mr={20}>
        <Link fontWeight="600" color={color} href={attachment.url}>
          {attachment.name}
        </Link>
        <Text>{size}</Text>
      </Flex>
      <Link href={attachment.url} download>
        <DownloadIcon />
      </Link>
    </Card>
  );
}
