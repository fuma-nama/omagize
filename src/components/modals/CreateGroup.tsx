import {
    Button, Center, FormControl, FormErrorMessage, FormLabel, Input, InputGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay, Text, useColorModeValue
} from "@chakra-ui/react";
import {BiRightArrow} from "react-icons/bi";
import Avatar from "../icons/Avatar";
import {useImagePicker, Pick} from "utils/ImageUtils";
import {useMutation} from "@tanstack/react-query";
import {createGroup} from "api/GroupAPI";
import {useModalState} from "./Modal";

export default function CreateGroupModal(props: {isOpen: boolean, onClose: () => void}) {
    const {isOpen} = props
    const [onClose, value, setValue] = useModalState<GroupOptions>(props.onClose, {name: ""})
    const mutation = useMutation(
        ['create_group'],
        () => createGroup(value.name, value.icon, value.banner), {
            onSuccess() {
                setValue({name: ""})
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
                <Form value={value} onChange={v => {
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
                    disabled={value.name.length <= 0}
                    variant='brand' rightIcon={<BiRightArrow />}>Create</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
}

type GroupOptions = {
    name: string,
    icon?: File,
    banner?: File
}

function Form(props: {value: GroupOptions, onChange: (options: Partial<GroupOptions>) => void}) {
    const {value, onChange} = props
    const acceptedFileTypes = ".png, .jpg, .gif"

    const [name, setName] = [value.name, (v: string) => onChange({name: v})]
    const icon = useImagePicker(
        value.icon,
        v => onChange({icon: v}),
        {accept: acceptedFileTypes}
    )
    const banner = useImagePicker(
        value.banner,
        v => onChange({banner: v}),
        {accept: acceptedFileTypes}
    )
    const invalid = false
    const bannerBg = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')

    return <FormControl isInvalid={invalid} isRequired>
        <InputGroup flexDirection='column'>
            {icon.picker}
            {banner.picker}
            <Text mx='auto'>Style your Group</Text>
            <Center
                onClick={banner.select}
                w='full' bgSize='cover'
                bg={banner.url? null : bannerBg} bgImg={banner.url}
                p={5} my={2} rounded='xl' _hover={{cursor: 'pointer'}} >
                <Pick
                    onClick={e => {
                        icon.select()
                        e.stopPropagation()
                    }}
                >
                    <Avatar border='auto' borderWidth={2} borderStyle='solid' borderColor='navy.800' src={icon.url} name={name} size='xl' />
                </Pick>
            </Center>

            <Button mx='auto' onClick={() => {
                icon.setValue(null)
                banner.setValue(null)
            }} variant='action'>Reset</Button>
        </InputGroup>
        <FormErrorMessage>
            {invalid}
        </FormErrorMessage>
        <FormLabel>Group Name</FormLabel>
        <Input value={name} onChange={e => setName(e.target.value)} variant="main" placeholder="Give your Group a name" />
    </FormControl>
}