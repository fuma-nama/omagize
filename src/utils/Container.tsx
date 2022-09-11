import {ReactNode} from "react";
import {Text} from "@chakra-ui/react"
import {useColors} from "../variables/colors";

export function Holder(
    {array, text, skeleton, children}: {
        array?: any[], text: string, skeleton?: ReactNode, children: ReactNode | (() => ReactNode)
    }) {
    const {textColorSecondary} = useColors()
    if (array == null) {
        return <>
            {skeleton}
        </>
    }

    if (array.length === 0) {
        return <Text mx='auto' color={textColorSecondary}>{text}</Text>
    } else {
        return <>
            {typeof children === 'function'? children() : children}
        </>
    }
}