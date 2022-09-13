import {ImageCropPicker, useModalState} from "./Modal";
import {useMutation} from "@tanstack/react-query";
import {createGroupEvent} from "../../api/GroupAPI";
import {
    Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, InputGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay, SimpleGrid, Textarea
} from "@chakra-ui/react";
import {BiRightArrow} from "react-icons/bi";
import {UploadImage, useImagePickerCrop} from "utils/ImageUtils";

export default function CreateEventModal(props: {group: string, isOpen: boolean, onClose: () => void}) {
    const {group, isOpen} = props
    const initial = new Date(Date.now())
    initial.setDate(initial.getDate() + 1)

    const [onClose, value, setValue] = useModalState<EventOptions>(props.onClose, {
        name: "",
        startAt: initial
    })

    const mutation = useMutation(
        ['create_group'],
        () => createGroupEvent(
            value.image, value.name, value.description, value.startAt, value.place, group
        ), {
            onSuccess() {
                onClose()
            }
        }
    )

    return <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Create Group Event</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Form error={mutation.error} value={value} onChange={v => {
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
                    disabled={value.name.length <= 0 || value.startAt <= new Date(Date.now())}
                    variant='brand' rightIcon={<BiRightArrow />}>Create</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
}

type EventOptions = {
    image?: UploadImage,
    name: string,
    description?: string,
    startAt: Date,
    place?: string,
}

function Form(
    {value, onChange, error}: {
        value: EventOptions, onChange: (options: Partial<EventOptions>) => void, error?: any
    }) {
    const acceptedFileTypes = ".png, .jpg, .gif"

    const image = useImagePickerCrop(
        value.image,
        v => onChange({image: v}),
        {accept: acceptedFileTypes}
    )

    return <Flex flexDirection='column' gap={3}>
        <Flex flexDirection='column' gap={3} w='300px' mx='auto'>
            {image.picker}
            <ImageCropPicker
                select={image.select}
                url={image.url}
                crop={image.crop}
            />
            {
                !image.crop && <Button mx='auto' onClick={() => {
                    image.setValue(null)
                }}>Reset</Button>
            }
        </Flex>
        <SimpleGrid columns={{base: 1, "3sm": 2}} gap={4}>
            <FormControl isRequired>
                <FormLabel>Event Name</FormLabel>
                <Input
                    value={value.name} onChange={e => onChange({name: e.target.value})}
                    variant="main" placeholder="Give your Event a name"
                />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Starting At</FormLabel>
                <Input
                    min={formatDate(new Date(Date.now()))}
                    variant="main"
                    type='datetime-local'
                    value={formatDate(value.startAt)}

                    onChange={e => {
                        onChange({startAt: new Date(e.target.value)})}
                    }
                />
            </FormControl>
            <FormControl>
                <FormLabel>Event Description</FormLabel>
                <Textarea
                    resize='none'
                    h='100px'
                    value={value.description} onChange={e => onChange({description: e.target.value})}
                    variant="main" placeholder="Give more details about your event"
                />
            </FormControl>
            <FormControl isInvalid={error}>
                <FormLabel>Take Place At</FormLabel>
                <Input
                    value={value.place ?? ""} onChange={e => onChange({place: e.target.value})}
                    h='100px'
                    pb='60px'
                    variant="main" placeholder="Where the Event happens?"
                />
                <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
        </SimpleGrid>
    </Flex>
}

function formatDate(value: Date): string {
    return value.toISOString().substring(0, 16)
}