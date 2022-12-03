import { SimpleGrid } from '@chakra-ui/react';
import { DatePicker } from '../../../components/src/picker/DatePicker';
import { TimePicker, TimeValue } from '../../../components/src/picker/TimePicker';

export function DateTimeForm(props: {
  min?: Date;
  max?: Date;
  value?: Date;
  onChange: (date: Date) => void;
}) {
  return (
    <SimpleGrid columns={{ base: 1, '2sm': 2 }} gap={4}>
      <DatePicker
        minDate={props.min}
        maxDate={props.max}
        value={props.value}
        onChange={(date: Date) => {
          const combined = new Date(date);
          if (props.value != null) {
            combined.setHours(props.value.getHours(), props.value.getMinutes());
          }
          props.onChange(combined);
        }}
      />
      <TimePicker
        value={
          !!props.value && {
            hours: props.value.getHours(),
            minutes: props.value.getMinutes(),
          }
        }
        onChange={(v) => props.onChange(applyDate(props.value, v))}
      />
    </SimpleGrid>
  );
}
function applyDate(original: Date | null, value: TimeValue): Date {
  const next = new Date(original ?? Date.now());
  next.setHours(value.hours, value.minutes);
  return next;
}
