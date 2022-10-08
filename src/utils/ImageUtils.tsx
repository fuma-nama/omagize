import {InputHTMLAttributes, LegacyRef, MouseEventHandler, useMemo, useRef, useState} from "react";
import {Box, BoxProps, Circle, useColorModeValue} from "@chakra-ui/react";
import {VscNewFile} from "react-icons/vsc";
import {Reset} from "../api/AccountAPI";
import {CropImage, CropOptions} from "../components/modals/Modal";
import {Crop} from "react-image-crop";
import Compressor from "compressorjs";

export const AvatarFormat: Format = {maxWidth: 500, maxHeight: 500}
export const BannerFormat: Format = {maxWidth: 1000, maxHeight: 1000}

//File, base64
export type UploadImage = Blob
export type Format = {
    maxWidth: number,
    maxHeight: number
}

export function url(initial: string, image?: string | Reset): string {
    if (image == null || image === 'reset') return initial

    return image
}

export function resizeImage(image: File | Blob, format: Format): Promise<Blob> {
    return new Promise((r, reject) => {
        new Compressor(image, {
            maxWidth: format.maxWidth,
            maxHeight: format.maxHeight,

            success(file: Blob) {
                r(file)
            },
            error(error: Error) {
                reject(error)
            }
        })
    })
}

export function cropImage(crop: Crop | null, imageObj: HTMLImageElement, format: Format): Promise<Blob> {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext('2d');

    canvas.width = Math.min(crop?.width ?? imageObj.naturalWidth, format.maxWidth)
    canvas.height = Math.min(crop?.height ?? imageObj.naturalHeight, format.maxHeight)

    if (crop != null) {

        return new Promise(r => {
            const a = new Image()
            a.src = imageObj.src
            a.addEventListener('load', () => {
                console.log(crop)
                const scaleX = imageObj.naturalWidth/imageObj.width
                const scaleY = imageObj.naturalHeight/imageObj.height

                context.drawImage(a,
                    crop.x * scaleX, crop.y * scaleY,
                    crop.width * scaleX, crop.height * scaleY,
                    0, 0, canvas.width, canvas.height
                )
                canvas.toBlob(b => r(b))
            })
        })
    } else {
        context.drawImage(
            imageObj,
            0, 0,
            canvas.width,
            canvas.height,
        );
        return new Promise(r => canvas.toBlob(b => r(b)))
    }
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

export function useImagePickerCrop<T extends UploadImage | Reset>(
    value: T,
    onChange: (file: T) => void,
    format: Format,
    props?: InputHTMLAttributes<HTMLInputElement>
) {
    const [edit, setEdit] = useState<{ crop: CropImage, preview: string } | null>()
    const base = useImagePickerBase<T>(value, f => onChange(f))

    return {
        ...base,
        picker: <FilePicker {...props} onChange={(v: File) => {
            const url = URL.createObjectURL(v)
            setEdit({preview: url, crop: null})
        }} inputRef={base.ref} />,
        crop: edit && {
            preview: edit.preview,
            crop: edit.crop,
            setCrop: (v: CropImage) => setEdit(prev => ({...prev, crop: v})),
            onCrop: (img) => {
                cropImage(edit.crop, img, format).then(result => {
                    setEdit(null)
                    onChange(result as T)
                })
            }
        } as CropOptions
    }
}

export function useImagePickerResize<T extends UploadImage | Reset>(
    value: T,
    onChange: (file: T) => void,
    format: Format,
    props?: InputHTMLAttributes<HTMLInputElement>
) {
    const base = useImagePickerBase(value, onChange)

    return {
        ...base,
        picker: <FilePicker {...props} onChange={(file: File) => {
            resizeImage(file, format).then(result =>
                onChange(result as T)
            )
        }} inputRef={base.ref} />,
    }
}

export function useImagePicker<T extends UploadImage | Reset>(value: T, onChange: (file: T) => void, props?: InputHTMLAttributes<HTMLInputElement>) {
    const base = useImagePickerBase(value, onChange)

    return {
        ...base,
        picker: <FilePicker {...props} onChange={onChange} inputRef={base.ref} />,
    }
}

export function useImagePickerBase<T extends UploadImage | Reset>(value: T, onChange: (file: T) => void) {
    const ref = useRef<HTMLInputElement>()
    const url = useImageUrl(value)

    return {
        value,
        setValue: onChange,
        select() {
            ref.current.click()
        },
        ref,
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
            return URL.createObjectURL(file)
        },
        [file]
    )
}