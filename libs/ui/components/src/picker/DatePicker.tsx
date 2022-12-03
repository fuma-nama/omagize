import {
  Button,
  ButtonProps,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  Portal,
  Text,
  useDisclosure,
  PopoverAnchor,
} from '@chakra-ui/react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './DatePicker.css';
import { CalendarIcon } from '@chakra-ui/icons';
import { useColors } from '@omagize/ui/theme';
import { CustomCardProps } from '../card';

export function DatePicker({
  container,
  toggler,
  ...props
}: { toggler?: ButtonProps; container?: CustomCardProps } & CalendarProps) {
  const value = props.value ?? props.defaultValue;
  const { cardBg } = useColors();
  const show = Array.isArray(value) ? value[0] : value;

  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Popover closeOnBlur={false} isOpen={isOpen} onClose={onClose}>
      <PopoverAnchor>
        <Button rightIcon={<CalendarIcon />} w="full" onClick={onToggle} {...toggler}>
          {show == null ? 'Pick a Date' : show.toLocaleDateString()}
        </Button>
      </PopoverAnchor>
      <Portal>
        <PopoverContent
          rootProps={{
            zIndex: 'popover',
          }}
          bg={cardBg}
          border={0}
          rounded="2xl"
          _focus={{}}
        >
          <PopoverBody>
            <Calendar
              view={'month'}
              tileContent={<Text color="brand.500" />}
              prevLabel={<Icon as={MdChevronLeft} w="24px" h="24px" mt="4px" />}
              nextLabel={<Icon as={MdChevronRight} w="24px" h="24px" mt="4px" />}
              {...props}
            />
          </PopoverBody>
          <PopoverFooter>
            <Button onClick={onClose}>Close</Button>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
