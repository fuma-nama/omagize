import React, {ReactNode} from "react";
import {useAuthColors} from "../../../variables/colors";
import {FormControl, FormErrorMessage, FormLabel} from "@chakra-ui/react";

export default function VerifyGroup({title, error, children}: {title: string, error?: string, children: ReactNode}) {
    const {
        textColorPrimary: textColor,
    } = useAuthColors()

    return <FormControl mb='24px' isInvalid={!!error}>
        <FormLabel
            ms='4px'
            fontSize='sm'
            fontWeight='500'
            color={textColor}
            mb='8px'>
            {title}
        </FormLabel>
        {children}
        <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
}