import { Icon, IconButton, IconButtonProps, useColorMode } from '@chakra-ui/react';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';

export function ThemeSwitch(props: Omit<IconButtonProps, 'aria-label'>) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      variant="no-hover"
      onClick={toggleColorMode}
      icon={<Icon h="18px" w="18px" as={colorMode === 'light' ? IoMdMoon : IoMdSunny} />}
      aria-label="switch color mode"
      {...props}
    />
  );
}
