import {
    Button, Center, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay, useColorModeValue
} from "@chakra-ui/react";
import {BiRightArrow} from "react-icons/bi";
import {useState} from "react";
import {Pick, url, useImagePicker} from "utils/ImageUtils";
import Avatar from "../icons/Avatar";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {SelfUser, updateProfile, useUserQuery} from "api/UserAPI";
import { Reset } from "api/AccountAPI";

type ProfileOptions = {
    name?: string
    avatar?: File | Reset
    banner?: File | Reset
}

export default function EditAccountModal(props: {isOpen: boolean, onClose: () => void}) {
    const query = useUserQuery()
    const [value, setValue] = useState<ProfileOptions>({})
    const client = useQueryClient()
    const mutation = useMutation(
        ['edit_profile'],
        () => updateProfile(value.name, value.avatar, value.banner), {
            onSuccess(data: SelfUser) {
                client.setQueryData(["user"], data)
                setValue({})
            }
        }
    )
    const {isOpen} = props
    const onClose = () => {
        setValue({})
        props.onClose()
    }

    if (query.isLoading) return <></>

    const canSave = (!!value.name || !!value.avatar || !!value.banner) && (value.name == null || value.name.length > 0)
    console.log(value)
    return <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Create Group</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Form user={query.data} value={value} onChange={v => {
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
                    disabled={!canSave}
                    variant='brand' rightIcon={<BiRightArrow />}>Save</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
}

function Form(props: {user: SelfUser, value: ProfileOptions, onChange: (options: Partial<ProfileOptions>) => void}) {
    const {user, value, onChange} = props
    const acceptedFileTypes = ".png, .jpg, .gif"

    const [name, setName] = [value.name, (v: string) => onChange({name: v})]
    const icon = useImagePicker(
        value.avatar,
        v => onChange({avatar: v}),
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
            <Center
                onClick={banner.select}
                w='full'
                bg={banner.url? null : bannerBg} bgImg={url(user.bannerUrl, banner.url)}
                bgSize='cover'
                p={5} my={2} rounded='xl' _hover={{cursor: 'pointer'}} >
                <Pick
                    onClick={e => {
                        icon.select()
                        e.stopPropagation()
                    }}
                >
                    <Avatar border='auto' borderWidth={2} borderStyle='solid' borderColor='navy.800' src={url(user.avatarUrl, icon.url)} name={name} size='xl' />
                </Pick>
            </Center>

            <Button mx='auto' onClick={() => {

                icon.setValue('reset')
                banner.setValue('reset')
            }} variant='action'>Reset</Button>
        </InputGroup>
        <FormErrorMessage>
            {invalid}
        </FormErrorMessage>
        <FormLabel>User Name</FormLabel>
        <Input value={name ?? user.username} onChange={e => setName(e.target.value)} variant="main" placeholder="Give yourself a cool name" />
    </FormControl>
}