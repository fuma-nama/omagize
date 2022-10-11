import {Button, Icon, Popover, PopoverBody, PopoverContent, Text, useDisclosure} from "@chakra-ui/react";
import {MdChevronLeft, MdChevronRight} from "react-icons/md";
import Calendar, {CalendarProps} from "react-calendar";
import {CustomCardProps} from "../../theme/theme";
import Card from "components/card/Card";
import 'react-calendar/dist/Calendar.css';
import 'assets/css/MiniCalendar.css';
import {CalendarIcon} from "@chakra-ui/icons";

export function DatePicker({container, ...props}: {container?: CustomCardProps} & CalendarProps) {
    const value = props.value ?? props.defaultValue
    const show = Array.isArray(value)? value[0] : value

    const { isOpen, onToggle, onClose } = useDisclosure()

    return <>
        <Button rightIcon={<CalendarIcon />} w='full' onClick={onToggle}>
            {show?.toLocaleDateString()}
        </Button>
        <Popover isOpen={isOpen} onClose={onClose}>
            <PopoverContent
                border={0}
                _focus={{}}
                bg='transparent'
            >
                <Card
                    alignItems='center'
                    flexDirection='column'
                    w='100%'
                    maxW='max-content'
                    p='20px 15px'
                    h='max-content'
                    {...container}>
                    <Calendar
                        view={'month'}
                        tileContent={<Text color='brand.500' />}
                        prevLabel={<Icon as={MdChevronLeft} w='24px' h='24px' mt='4px' />}
                        nextLabel={<Icon as={MdChevronRight} w='24px' h='24px' mt='4px' />}
                        {...props}
                    />
                </Card>
            </PopoverContent>
        </Popover>
    </>
}