import React, {useState} from "react";
import {Pick} from "../../utils/ImageUtils";
import Avatar from "../icons/Avatar";
import {Center, useColorModeValue} from "@chakra-ui/react";

export function ProfilePicker(props: {selectBanner: () => void, selectIcon: () => void, bannerUrl: string, iconUrl: string, name?: string}) {
    const bannerBg = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')

    return <Center
        onClick={props.selectBanner}
        w='full'
        bg={props.bannerUrl? null : bannerBg} bgImg={props.bannerUrl}
        bgSize='cover'
        p={5} my={2} rounded='xl' _hover={{cursor: 'pointer'}} >
        <Pick
            onClick={e => {
                props.selectIcon()
                e.stopPropagation()
            }}
        >
            <Avatar border='auto' borderWidth={2} borderStyle='solid' borderColor='navy.800' src={props.iconUrl} name={props.name} size='xl' />
        </Pick>
    </Center>
}

export function useModalState<T>(close: () => void, initial?: T): [
    () => void, T, React.Dispatch<React.SetStateAction<T>>
] {
    const [value, setValue] = useState<T>(initial)

    return [() => {
        setValue(initial)
        close()
    }, value, setValue]
}