import {
    Button, Center, FormControl, FormErrorMessage, FormLabel, Input, InputGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay, Text
} from "@chakra-ui/react";
import {useState} from "react";
import {BiRightArrow} from "react-icons/bi";
import Avatar from "../icons/Avatar";
import {useImagePickerAuto} from "utils/ImageUtils";

export default function CreateGroupModal(props: {isOpen: boolean, onClose: () => void}) {
    const {isOpen, onClose} = props

    return <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Create Group</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Form />
            </ModalBody>

            <ModalFooter>
                <Button variant='action' mr={3} onClick={onClose}>
                    Close
                </Button>
                <Button variant='brand' rightIcon={<BiRightArrow />}>Create</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
}

function Form() {
    const [name, setName] = useState("")
    const acceptedFileTypes = ".png, .jpg, .gif"

    const icon = useImagePickerAuto({accept: acceptedFileTypes})
    const banner = useImagePickerAuto({accept: acceptedFileTypes})
    const invalid = false

    return <FormControl isInvalid={invalid} isRequired>
        <InputGroup flexDirection='column'>
            {icon.picker}
            {banner.picker}
            <Text mx='auto'>Pick a Icon</Text>
            <Center w='full' bgImg={banner.url} onClick={banner.select} p={5} rounded='xl' _hover={{cursor: 'pointer'}}>
                <Avatar
                    src={icon.url} name={name}
                    onClick={e => {
                        icon.select()
                        e.stopPropagation()
                    }}
                    size='xl'
                />
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