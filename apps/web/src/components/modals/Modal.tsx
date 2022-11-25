import { Fragment, ReactNode, useEffect, useState } from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import { DatePicker } from 'components/picker/DatePicker';
import { TimePicker } from 'components/picker/TimePicker';
import { applyDate } from 'utils/DateUtils';

/**
 * Detects when modal is re-opened, reset its state before opening it
 * @param isOpen
 * @param children
 * @constructor
 */
export function DynamicModal({ isOpen, children }: { isOpen: boolean; children: ReactNode }) {
  const [id, setId] = useState(0);
  useEffect(() => {
    if (isOpen) {
      setId((prev) => prev + 1);
    }
  }, [isOpen]);

  return (
    <>
      <Fragment key={id}>{children}</Fragment>
    </>
  );
}

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
          if (!!props.value) {
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
