import {ImageCropPicker, useModalState} from "./Modal";
import {useMutation} from "@tanstack/react-query";
import {createGroupEvent} from "../../api/GroupAPI";
import {
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel, HStack,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    SimpleGrid,
    Textarea
} from "@chakra-ui/react";
import {BiRightArrow} from "react-icons/bi";
import {BannerFormat, supportedFileTypes, UploadImage, useImagePickerCrop} from "utils/ImageUtils";
import {TimePicker} from "../picker/TimePicker";
import {DatePicker} from "../picker/DatePicker";
import {Step, Steps} from "chakra-ui-steps";
import {useState} from "react";
import {applyDate, onlyDate, onlyTime} from "../../utils/DateUtils";

function getInitialStart(): Date {
    const date = new Date(Date.now())
    date.setHours(date.getHours() + 1)
    return onlyTime(date)
}

export default function CreateEventModal(props: {group: string, isOpen: boolean, onClose: () => void}) {
    const {group, isOpen} = props

    const [onClose, value, setValue] = useModalState<EventOptions>(props.onClose, {
        name: "",
        startAt: getInitialStart(),
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
    const canSubmit = value.name.length > 0
    const [step, setStep] = useState(0)

    return <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Create Group Event</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Steps activeStep={step} width='100%'>
                    <Step label='Basic Info'>
                        <Form value={value} onChange={v => setValue(prev => ({...prev, ...v}))} />
                    </Step>
                    <Step label='Advanced Settings'>
                        <AdvancedForm value={value} onChange={v => {
                            if (!mutation.isLoading) {
                                setValue(prev => ({...prev, ...v}))
                            }
                        }} />
                    </Step>
                </Steps>

            </ModalBody>

            <ModalFooter>
                <Button mr={3} onClick={onClose}>
                    Close
                </Button>
                {
                    step === 0 && <Button
                        onClick={() => setStep(1)}
                        disabled={!canSubmit} rightIcon={<BiRightArrow />}>
                        Next
                    </Button>
                }
                {
                    step === 1 && <Button
                        onClick={() => mutation.mutate()} isLoading={mutation.isLoading}
                        disabled={!canSubmit || mutation.isLoading}
                        variant='brand'>
                        Create
                    </Button>
                }
            </ModalFooter>
        </ModalContent>
    </Modal>
}

type EventOptions = {
    image?: UploadImage,
    name: string,
    description?: string,
    startAt: Date,
    endAt?: Date,
    place?: string,
}
type FormProps = {
    value: EventOptions, onChange: (options: Partial<EventOptions>) => void
}
function AdvancedForm({value, onChange}: FormProps) {
    const {minStart, maxStart, minEnd, maxEnd} = useLimits(value.startAt)

    return <Flex flexDirection='column' gap={3} pt={5}>
        <FormControl>
            <FormLabel htmlFor='place'>Take Place At</FormLabel>
            <Input id='place'
                   value={value.place ?? ""} onChange={e => onChange({place: e.target.value})}
                   variant="main" placeholder="Where the Event happens?"
            />
        </FormControl>
        <FormControl isRequired>
            <FormLabel>Start Date</FormLabel>
            <DateTimeForm
                min={minStart}
                max={maxStart}
                value={value.startAt}
                onChange={(date: Date) => onChange({startAt: date})}
            />
        </FormControl>
        <FormControl>
            <HStack align='center' mb={3}>
                <FormLabel m={0}>End Date</FormLabel>
                <Button variant='action' onClick={() => onChange({endAt: null})}>Reset</Button>
            </HStack>
            <DateTimeForm
                min={minEnd}
                max={maxEnd}
                value={value.endAt}
                onChange={(date: Date) => onChange({endAt: date})}
            />
        </FormControl>
    </Flex>
}

function Form(
    {value, onChange}: {
        value: EventOptions, onChange: (options: Partial<EventOptions>) => void, error?: any
    }) {
    const image = useImagePickerCrop(
        value.image,
        v => onChange({image: v}),
        BannerFormat,
        {accept: supportedFileTypes}
    )

    return <Flex flexDirection='column' gap={3} pt={5}>
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
        <FormControl isRequired>
            <FormLabel htmlFor='name'>Event Name</FormLabel>
            <Input id='name'
                   value={value.name} onChange={e => onChange({name: e.target.value})}
                   variant="main" placeholder="Give your Event a name"
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
    </Flex>
}

function DateTimeForm(props: {
    min?: Date, max?: Date, value?: Date, onChange: (date: Date) => void
}) {
    return <SimpleGrid columns={{base: 1, "2sm": 2}} gap={4}>
        <DatePicker
            minDate={props.min}
            maxDate={props.max}
            value={props.value}
            onChange={(date: Date) => {
                const combined = new Date(date)
                if (!!props.value) {
                    combined.setHours(props.value.getHours(), props.value.getMinutes())
                }
                props.onChange(combined)
            }}
        />
        <TimePicker value={ !!props.value && {
            hours: props.value.getHours(),
            minutes: props.value.getMinutes()
        }} onChange={v =>
            props.onChange(applyDate(props.value, v))
        } />
    </SimpleGrid>
}

export function useLimits(startAt: Date) {
    const minStart = new Date(Date.now())
    const minEnd = startAt

    //The event must be started within 2 months
    const maxStart = new Date(minStart)
    maxStart.setMonth(maxStart.getMonth() + 2)

    //The event cannot exceed 10 years
    const maxEnd = new Date(minEnd)
    maxEnd.setFullYear(maxEnd.getFullYear() + 1)

    return {
        minStart: onlyDate(minStart),
        maxStart: onlyDate(maxStart),
        minEnd: onlyDate(minEnd),
        maxEnd: onlyDate(maxEnd)
    }
}
