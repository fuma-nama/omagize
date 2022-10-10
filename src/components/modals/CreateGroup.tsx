import {
    Button, FormControl, FormErrorMessage, FormLabel, Input, InputGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay, Text
} from "@chakra-ui/react";
import {BiRightArrow} from "react-icons/bi";
import {
    useImagePickerCrop,
    UploadImage,
    AvatarFormat,
    useImagePickerResize, BannerFormat
} from "utils/ImageUtils";
import {useMutation} from "@tanstack/react-query";
import {createGroup} from "api/GroupAPI";
import {ProfileCropPicker} from "./Modal";
import {useState} from "react";

export default function CreateGroupModal(props: {isOpen: boolean, onClose: () => void}) {
    const {isOpen, onClose} = props
    const [value, setValue] = useState<GroupOptions>({name: ""})

    const mutation = useMutation(
        ['create_group'],
        () => createGroup(value.name, value.icon, value.banner), {
            onSuccess() {
                onClose()
            }
        }
    )

    return <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Create Group</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Form isError={mutation.isError} value={value} onChange={v => {
                    if (!mutation.isLoading) {
                        setValue(prev => ({...prev, ...v}))
                    }
                }} />
            </ModalBody>

            <ModalFooter>
                <Button mr={3} onClick={onClose}>
                    Close
                </Button>
                <Button
                    onClick={() => mutation.mutate()} isLoading={mutation.isLoading}
                    disabled={value.name.length <= 0 || mutation.isLoading}
                    variant='brand' rightIcon={<BiRightArrow />}>Create</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
}

type GroupOptions = {
    name: string,
    icon?: UploadImage,
    banner?: UploadImage
}

function Form(
    {value, onChange, isError}: {
        value: GroupOptions, onChange: (options: Partial<GroupOptions>) => void, isError: boolean
    }) {
    const acceptedFileTypes = ".png, .jpg, .gif"

    const [name, setName] = [value.name, (v: string) => onChange({name: v})]
    const icon = useImagePickerCrop(
        value.icon,
        v => onChange({icon: v}),
        AvatarFormat,
        {accept: acceptedFileTypes}
    )
    const banner = useImagePickerResize(
        value.banner,
        v => onChange({banner: v}),
        BannerFormat,
        {accept: acceptedFileTypes}
    )

    return <FormControl isRequired isInvalid={isError}>
        <InputGroup flexDirection='column'>
            {icon.picker}
            {banner.picker}
            <Text mx='auto'>Style your Group</Text>
            <ProfileCropPicker
                selectBanner={banner.select} selectIcon={icon.select}
                bannerUrl={banner.url} iconUrl={icon.url}
                crop={icon.crop}
            />
            {
                !icon.crop && <Button mx='auto' onClick={() => {
                    icon.setValue(null)
                    banner.setValue(null)
                }}>Reset</Button>
            }
        </InputGroup>
        <FormLabel>Group Name</FormLabel>
        <Input value={name} onChange={e => setName(e.target.value)} variant="main" placeholder="Give your Group a name" />
        <FormErrorMessage>Failed to Create Group</FormErrorMessage>
    </FormControl>
}