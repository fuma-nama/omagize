import { Popover, PopoverBody, PopoverContent, PopoverProps } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useColors } from 'variables/colors';

export function Popup(props: { root: ReactNode; children: ReactNode; popover?: PopoverProps }) {
  const { cardBg } = useColors();

  return (
    <Popover isLazy {...props.popover} orientation="horizontal">
      {props.root}
      <PopoverContent bg={cardBg} overflow="hidden">
        <PopoverBody p={0}>{props.children}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
