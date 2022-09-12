import {Box, ChakraProps, Image, ImageProps} from "@chakra-ui/react";
import {ReactNode} from "react";

export default function FadeImage(props: {src?: any, placeholder?: ReactNode | string, direction: string, image?: ImageProps} & ChakraProps) {
    const {src, direction, image, placeholder, ...rest} = props

    return <Box top={0} left={0} w='full' h='full' pos='absolute' {...rest}>
        {src ? <Image alt="banner"
                      w='full'
                      h='full'
                      css={{maskImage: `linear-gradient(${direction}, black, transparent)`}}
                      src={src} objectFit='cover'
                      {...image}
            /> :
            typeof placeholder === 'string'?
                <Box bgGradient={`linear-gradient(${direction}, ${placeholder}, transparent)`} w='full' h='full' />
                :
                <>
                    {placeholder}
                </>
        }
    </Box>
}