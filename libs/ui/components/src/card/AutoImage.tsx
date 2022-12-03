import { Box, Image, ImageProps } from '@chakra-ui/react';
import { useColors } from '@omagize/ui/theme';

export function AutoImage(props: ImageProps) {
  const { brand } = useColors();
  const bg = props.bg ?? brand;

  if (props.src == null) {
    return <Box {...props} bg={bg} />;
  }
  return <Image {...props} bg={bg} />;
}
