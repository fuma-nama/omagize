import {Box, ChakraProps, Image, ImageProps} from "@chakra-ui/react";

export default function FadeImage(props: {src?: any, direction: string, image: ImageProps} & ChakraProps) {
    const {src, direction, image, ...rest} = props

    return <Box top={0} left={0} w='full' h='full' pos='absolute' {...rest}>
        <Image alt="banner"
               w='full'
               h='full'
               css={{maskImage: `linear-gradient(${direction}, black, transparent)`}}
               src={src} objectFit='cover'
               {...image}
        />
    </Box>
}