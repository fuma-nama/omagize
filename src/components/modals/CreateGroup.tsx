import {
    Box,
    Button, Center, Circle, FormControl, FormErrorMessage, FormLabel, Input, InputGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay, Text, useColorModeValue
} from "@chakra-ui/react";
import {MouseEventHandler, useState} from "react";
import {BiRightArrow} from "react-icons/bi";
import Avatar from "../icons/Avatar";
import {useImagePickerAuto} from "utils/ImageUtils";
import {VscNewFile} from "react-icons/vsc";

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
            <Pick onClick={banner.select}>
                <Center w='full' bgImg={banner.url} p={5} rounded='xl'>
                    <Pick
                        onClick={e => {
                            icon.select()
                            e.stopPropagation()
                        }}
                    >
                        <Avatar src={icon.url} name={name} size='xl' />
                    </Pick>
                </Center>
            </Pick>

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

function Pick(props: {onClick: MouseEventHandler<HTMLDivElement>, children: any}) {
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