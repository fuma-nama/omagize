import {InputHTMLAttributes, LegacyRef, MouseEventHandler, useMemo, useRef, useState} from "react";
import {Box, Circle, useColorModeValue} from "@chakra-ui/react";
import {VscNewFile} from "react-icons/vsc";
import {Reset} from "../api/AccountAPI";

export function url(initial: string, image?: string | Reset): string {
    if (image == null || image === 'reset') return initial

    return image
}

export function Pick(props: {onClick: MouseEventHandler<HTMLDivElement>, children: any}) {
    const iconBg = useColorModeValue('white', 'brand.400')

    return <Box
        className='pick'
        pos='relative' onClick={props.onClick} _hover={{cursor: 'pointer'}}
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
    >
        {props.children}
        <Circle className='tip' pos='absolute' bottom={0} right={0} bg={iconBg} p={2} transition='all 0.1s'>
            <VscNewFile />
        </Circle>
    </Box>
}

export function useImagePicker<T extends File | Reset>(value: T, onChange: (file: T) => void, props?: InputHTMLAttributes<HTMLInputElement>) {
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

export function useImageUrl(file: File | Reset) {
    return useMemo(
        () => file && file !== 'reset' && URL.createObjectURL(file),
        [file]
    )
}