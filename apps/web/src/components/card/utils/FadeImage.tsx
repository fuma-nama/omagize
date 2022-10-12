import { Box, ChakraProps, Image, ImageProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

export default function FadeImage(
  props: {
    src?: any;
    placeholder?: ReactNode | string;
    direction: string;
    image?: ImageProps;
    percent?: number;
    opacity?: number;
  } & ChakraProps
) {
  const { src, direction, image, placeholder, opacity = 100, ...rest } = props;
  const percent = !!props.percent ? props.percent + '%' : '';

  return (
    <Box top={0} left={0} w="full" h="full" pos="absolute" {...rest}>
      {src ? (
        <Image
          alt="banner"
          w="full"
          h="full"
          css={{
            maskImage: `linear-gradient(${direction}, rgba(0,0,0, ${opacity}), transparent ${percent})`,
          }}
          src={src}
          objectFit="cover"
          {...image}
        />
      ) : typeof placeholder === 'string' ? (
        <Box
          bgGradient={`linear-gradient(${direction}, ${placeholder}, transparent ${percent})`}
          w="full"
          h="full"
        />
      ) : (
        <>{placeholder}</>
      )}
    </Box>
  );
}
