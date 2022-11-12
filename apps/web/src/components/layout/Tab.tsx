import { Tab } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useColors } from 'variables/colors';

export function TabButton(props: { children: ReactNode }) {
  const { textColorPrimary, textColorSecondary, cardBg } = useColors();

  return (
    <Tab
      color={textColorSecondary}
      rounded="xl"
      _focus={{ boxShadow: 'none' }}
      _selected={{ color: textColorPrimary, bg: cardBg }}
      py={1}
    >
      {props.children}
    </Tab>
  );
}
