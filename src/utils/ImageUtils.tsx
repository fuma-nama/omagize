import {InputHTMLAttributes, LegacyRef, useMemo, useRef, useState} from "react";

export function useImagePickerAuto(props?: InputHTMLAttributes<HTMLInputElement>) {
    const [value, setValue] = useState<File>(null)

    return useImagePicker(value, setValue, props)
}

export function useImagePicker(value: File, onChange: (file: File) => void, props?: InputHTMLAttributes<HTMLInputElement>) {
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

export function useImageUrl(file: any) {
    return useMemo(
        () => file && URL.createObjectURL(file),
        [file]
    )
}