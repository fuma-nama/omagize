import {
  Button,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  Portal,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import Calendar, { CalendarProps } from 'react-calendar';
import { CustomCardProps } from '../../theme/theme';
import Card from 'components/card/Card';
import 'react-calendar/dist/Calendar.css';
import 'assets/css/MiniCalendar.css';
import { CalendarIcon } from '@chakra-ui/icons';
import { PopoverAnchor } from 'components/PopoverTrigger';
import { useColors } from 'variables/colors';

export function DatePicker({
  container,
  ...props
}: { container?: CustomCardProps } & CalendarProps) {
  const value = props.value ?? props.defaultValue;
  const { cardBg } = useColors();
  const show = Array.isArray(value) ? value[0] : value;

  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Popover closeOnBlur={false} isOpen={isOpen} onClose={onClose}>
      <PopoverAnchor>
        <Button rightIcon={<CalendarIcon />} w="full" onClick={onToggle}>
          {show?.toLocaleDateString()}
        </Button>
      </PopoverAnchor>
      <Portal>
        <PopoverContent bg={cardBg} border={0} rounded="2xl" _focus={{}}>
          <PopoverBody>
            <Calendar
              view={'month'}
              tileContent={<Text color="brand.500" />}
              prevLabel={<Icon as={MdChevronLeft} w="24px" h="24px" mt="4px" />}
              nextLabel={
                <Icon as={MdChevronRight} w="24px" h="24px" mt="4px" />
              }
              {...props}
            />
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
