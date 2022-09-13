import {InputHTMLAttributes, LegacyRef, MouseEventHandler, useMemo, useRef, useState} from "react";
import {Box, BoxProps, Circle, useColorModeValue} from "@chakra-ui/react";
import {VscNewFile} from "react-icons/vsc";
import {Reset} from "../api/AccountAPI";
import {CropImage, CropOptions} from "../components/modals/Modal";

//File, base64
export type UploadImage = File | string
export function url(initial: string, image?: string | Reset): string {
    if (image == null || image === 'reset') return initial

    return image
}

function toBase64(blob: Blob): Promise<string> {
    return new Promise(resolve => {
        const reader = new FileReader()
        reader.addEventListener('load', () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result)
            }
        })
        reader.readAsDataURL(blob)
    })
}

export function cropImage({crop, image}: CropImage, imageObj: HTMLImageElement): Promise<string> {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext('2d');

    if (crop == null) {
        canvas.width = imageObj.width
        canvas.height = imageObj.height

        context.drawImage(imageObj, 0, 0);
    } else {
        const scaleX = imageObj.naturalWidth / imageObj.width
        const scaleY = imageObj.naturalHeight / imageObj.height
        // devicePixelRatio slightly increases sharpness on retina devices
        // at the expense of slightly slower render times and needing to
        // size the image back down if you want to download/upload and be
        // true to the images natural size.
        const pixelRatio = window.devicePixelRatio

        canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
        canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

        context.scale(pixelRatio, pixelRatio)
        context.imageSmoothingQuality = 'high'

        const cropX = crop.x * scaleX
        const cropY = crop.y * scaleY

        // 5) Move the crop origin to the canvas origin (0,0)
        context.translate(-cropX, -cropY)
        context.drawImage(
            imageObj,
            0,
            0,
            imageObj.naturalWidth,
            imageObj.naturalHeight,
        )
    }

    return new Promise(r => r(canvas.toDataURL("image/webp")))
}

export function Pick({children, ...rest}: {children: any} & BoxProps) {
    const iconBg = useColorModeValue('white', 'brand.400')

    return <Box
        className='pick'
        pos='relative' _hover={{cursor: 'pointer'}}
        css={{
            "&:has(.pick:hover) > .tip": {
                opacity: 0
            },
            "&:hover > .tip": {
                opacity: 1
            },
            "& > .tip": {
                opacity: 0
            }
        }}
        {...rest}
    >
        {children}
        <Circle className='tip' pos='absolute' bottom={0} right={0} bg={iconBg} p={2} transition='all 0.1s'>
            <VscNewFile />
        </Circle>
    </Box>
}

export function useImagePickerCrop<T extends UploadImage>(value: T, onChange: (file: T) => void, props?: InputHTMLAttributes<HTMLInputElement>) {
    const [crop, setCrop] = useState<CropImage>()
    const base = useImagePicker(value, onChange, props)

    return {
        ...base,
        picker: <FilePicker {...props} onChange={(v: File) => {
            toBase64(v).then(result => {
                setCrop({image: result, crop: null})
            })
        }} inputRef={base.ref} />,
        crop: crop && {
            value: crop, setCrop,
            onCrop: (base64: string) => {
                setCrop(null)
                onChange(base64 as T)
            }
        } as CropOptions
    }
}

export function useImagePicker<T extends UploadImage>(value: T, onChange: (file: T) => void, props?: InputHTMLAttributes<HTMLInputElement>) {
    const ref = useRef<HTMLInputElement>()
    const url = useImageUrl(value)

    return {
        value,
        setValue: onChange,
        select() {
            ref.current.click()
        },
        ref,
        picker: <FilePicker {...props} onChange={onChange} inputRef={ref} />,
        url
    }
}

export function FilePicker(props: { onChange: (file: File) => void, inputRef: LegacyRef<HTMLInputElement> } & any) {
    const {inputRef, onChange, ...rest} = props

    return <input
        type='file'
        ref={inputRef}
        value={[]}
        onChange={e => {
            const files = e.target.files
            if (files && files.length > 0) {
                onChange(files[0])
            }
        }}
        hidden
        {...rest}
    />
}

export function useImageUrl(file: UploadImage | Reset) {
    return useMemo(
        () => {
            if (!file || file === 'reset') return null
            if (typeof file === 'string') return file
            return URL.createObjectURL(file)
        },
        [file]
    )
}