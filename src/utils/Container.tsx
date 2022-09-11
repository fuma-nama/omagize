import {ReactNode} from "react";
import {Center, CenterProps, Text} from "@chakra-ui/react"
import {useColors} from "../variables/colors";

export function Placeholder({children, ...rest}: {children: string} & CenterProps) {
    const {textColorSecondary, cardBg} = useColors()

    return <Center w='full' py='50px' bg={cardBg} rounded='xl' {...rest}>
        <Text color={textColorSecondary} fontSize='xl' align='center'>{children}</Text>
    </Center>
}
export function Holder(
    {array, placeholder, skeleton, children}: {
        array?: any[], placeholder?: string | ReactNode, skeleton?: ReactNode, children: ReactNode | (() => ReactNode)
    }) {
    const {textColorSecondary} = useColors()
    if (array == null) {
        return <>
            {skeleton}
        </>
    }

    if (array.length === 0) {
        if (typeof placeholder === 'string') {
            return <Text mx='auto' color={textColorSecondary}>{placeholder}</Text>
        } else {
            return <> {placeholder} </>
        }
    } else {
        return <>
            {typeof children === 'function'? children() : children}
        </>
    }
}