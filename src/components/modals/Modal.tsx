import React, {useRef, useState} from "react";
import {cropImage, Pick} from "utils/ImageUtils";
import Avatar from "../icons/Avatar";
import {Center, useColorModeValue, Image, HStack, Button, ButtonProps} from "@chakra-ui/react";
import ReactCrop, {Crop} from "react-image-crop";

export type CropImage = {
    image: string
    crop: Crop
}
export type CropOptions = {
    value: CropImage,
    setCrop: (crop: CropImage) => void,
    onCrop: (base64: string) => void
}

export function ProfileCropPicker(props: ProfilePickerProps & {
    crop: CropOptions, buttonStyle?: ButtonProps, aspect?: number
}) {
    const ref = useRef<HTMLImageElement>()
    if (props.crop) {
        const {value, setCrop, onCrop} = props.crop

        return <>
            <ReactCrop aspect={props.aspect ?? 1} crop={value.crop} onChange={(v) => setCrop({image: value.image, crop: v})}>
                <Image src={value.image} ref={ref} />
            </ReactCrop>
            <HStack justify='center' mt={3}>
                <Button {...props.buttonStyle} variant='action' onClick={() => {
                    if (ref.current.complete) {
                        onCrop(cropImage(value, ref.current))
                    }
                }}>Done</Button>
            </HStack>
        </>
    }

    return <ProfilePicker {...props} />
}

export type ProfilePickerProps = {
    selectBanner: () => void, selectIcon: () => void,
    bannerUrl: string, iconUrl: string, name?: string,
}
export function ProfilePicker(props: ProfilePickerProps) {
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