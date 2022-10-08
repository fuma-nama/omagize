import React, {useRef, useState} from "react";
import {cropImage, Pick} from "utils/ImageUtils";
import Avatar from "../icons/Avatar";
import {Center, useColorModeValue, Image, HStack, Button, ButtonProps, Icon} from "@chakra-ui/react";
import ReactCrop, {Crop} from "react-image-crop";
import {FaImage} from "react-icons/fa";

export type CropImage = Crop | null
export type CropOptions = {
    preview: string,
    crop: CropImage,
    setCrop: (crop: CropImage) => void,
    onCrop: (img: HTMLImageElement) => void
}

export function ImageCropPicker(props: {
    select: () => void, url: string | null,
} & CropProps) {
    const bannerBg = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')

    if (props.crop) {
        return <ImageCropper crop={props.crop} buttonStyle={props.buttonStyle} aspect={props.aspect} />
    }

    return <Pick
        w='full'
        onClick={props.select}
        rounded='xl' overflow='hidden'
    >
        {props.url?
            <Image w='full' maxH='500px' src={props.url} objectFit='contain'/>
            : <Center
                w='full' h='200px'
                bg={bannerBg} p={5}
            >
                <Icon as={FaImage} w='100px' h='50px' />
            </Center>
        }
    </Pick>
}

export function ProfileCropPicker(props: ProfilePickerProps & CropProps) {
    if (props.crop) {
        return <ImageCropper crop={props.crop} buttonStyle={props.buttonStyle} aspect={props.aspect ?? 1} />
    }

    return <ProfilePicker {...props} />
}

type CropProps = { crop: CropOptions, buttonStyle?: ButtonProps, aspect?: number }
function ImageCropper(props: CropProps) {
    const ref = useRef<HTMLImageElement>()

    if (props.crop) {
        const {preview, crop, setCrop, onCrop} = props.crop

        return <>
            <ReactCrop aspect={props.aspect} crop={crop} onChange={(v) => setCrop(v)}>
                <Image src={preview} ref={ref} />
            </ReactCrop>
            <HStack justify='center' mt={3}>
                <Button {...props.buttonStyle} variant='action' onClick={() => onCrop(ref.current)}>Done</Button>
            </HStack>
        </>
    }
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