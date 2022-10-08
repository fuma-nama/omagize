import {Button, Center, Slide, Text, VStack} from "@chakra-ui/react";

export function SlideError({isError, message, retry}: {isError: boolean, message: string, retry: () => void}) {
    return <Slide direction='bottom' in={isError} style={{ zIndex: 10 }}>
        <Center mb='10px'>
            <VStack
                w='fit-content'
                rounded='xl'
                px='40px' py='20px'
                color='white'
                bg='red.500'
                shadow='md'
            >
                <Text>{message}</Text>
                <Button onClick={retry}>Retry</Button>
            </VStack>
        </Center>
    </Slide>
}