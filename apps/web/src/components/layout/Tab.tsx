import { Tab, TabProps } from '@chakra-ui/react';
import { useColors } from 'variables/colors';

export function TabButton(props: TabProps) {
  const { textColorPrimary, textColorSecondary, cardBg } = useColors();

  return (
    <Tab
      color={textColorSecondary}
      rounded="xl"
      _focus={{ boxShadow: 'none' }}
      _selected={{ color: textColorPrimary, bg: cardBg }}
      py={1}
      fontWeight="600"
      {...props}
    >
      {props.children}
    </Tab>
  );
}
