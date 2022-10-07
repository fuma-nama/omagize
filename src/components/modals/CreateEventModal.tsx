import {ImageCropPicker, useModalState} from "./Modal";
import {useMutation} from "@tanstack/react-query";
import {createGroupEvent} from "../../api/GroupAPI";
import {
    Button, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay, SimpleGrid, Textarea
} from "@chakra-ui/react";
import {BiRightArrow} from "react-icons/bi";
import {AvatarFormat, BannerFormat, UploadImage, useImagePickerCrop} from "utils/ImageUtils";

export default function CreateEventModal(props: {group: string, isOpen: boolean, onClose: () => void}) {
    const {group, isOpen} = props
    const {minStart: initialStart, minEnd: initialEnd} = useLimits(new Date(Date.now()))

    const [onClose, value, setValue] = useModalState<EventOptions>(props.onClose, {
        name: "",
        startAt: initialStart,
        endAt: initialEnd
    })

    const mutation = useMutation(
        ['create_group'],
        () => createGroupEvent(
            value.image, value.name, value.description, value.startAt, value.endAt, value.place, group
        ), {
            onSuccess() {
                onClose()
            }
        }
    )
    const {minStart, maxStart, minEnd, maxEnd} = useLimits(value.startAt)

    const canSubmit = value.name.length > 0 &&
        value.startAt >= minStart && value.startAt <= maxStart &&
        value.endAt >= minEnd && value.endAt <= maxEnd

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
                    disabled={!canSubmit}
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
    endAt: Date,
    place?: string,
}

function Form(
    {value, onChange, error}: {
        value: EventOptions, onChange: (options: Partial<EventOptions>) => void, error?: any
    }) {
    const {minStart, maxStart, minEnd, maxEnd} = useLimits(value.startAt)
    const acceptedFileTypes = ".png, .jpg, .gif"

    const image = useImagePickerCrop(
        value.image,
        v => onChange({image: v}),
        BannerFormat,
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
            <FormControl>
                <FormLabel>Take Place At</FormLabel>
                <Input
                    value={value.place ?? ""} onChange={e => onChange({place: e.target.value})}
                    variant="main" placeholder="Where the Event happens?"
                />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Start At</FormLabel>
                <Input
                    min={formatDate(minStart)}
                    max={formatDate(maxStart)}
                    variant="main"
                    type='datetime-local'
                    value={formatDate(value.startAt)}

                    onChange={e => {
                        onChange({startAt: new Date(e.target.value)})}
                    }
                />
                <FormHelperText>Starting Date must within 2 Months</FormHelperText>
            </FormControl>
            <FormControl isRequired>
                <FormLabel>End At</FormLabel>
                <Input
                    min={formatDate(minEnd)}
                    max={formatDate(maxEnd)}
                    variant="main"
                    type='datetime-local'
                    value={formatDate(value.endAt)}
                    onChange={e => {
                        onChange({endAt: new Date(e.target.value)})}
                    }
                />
                <FormHelperText>Events must be ended within 1 year</FormHelperText>
            </FormControl>
        </SimpleGrid>
        <FormControl isInvalid={error}>
            <FormLabel>Event Description</FormLabel>
            <Textarea
                resize='none'
                h='100px'
                value={value.description} onChange={e => onChange({description: e.target.value})}
                variant="main" placeholder="Give more details about your event"
            />
            <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
    </Flex>
}

export function useLimits(startAt: Date) {
    const now = new Date(Date.now())
    const minStart = new Date(formatDate(now))
    const minEnd = new Date(formatDate(startAt))

    //The event must be started within 2 months
    const maxStart = new Date(minStart)
    maxStart.setMonth(maxStart.getMonth() + 2)

    //The event cannot exceed 10 years
    const maxEnd = new Date(minEnd)
    maxEnd.setFullYear(maxEnd.getFullYear() + 1)

    return {
        minStart, maxStart, minEnd, maxEnd
    }
}

function formatDate(value: Date): string {
    //yy-mm-dd-hh-mm
    return value.toISOString().substring(0, 16)
}