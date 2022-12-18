import { Icon, IconButton, IconButtonProps, useColorModeValue } from '@chakra-ui/react';
import { IoMenuOutline } from 'react-icons/io5';
import { usePageStore } from '@omagize/data-access-store';

export function SidebarTrigger(props: Omit<IconButtonProps, 'aria-label'>) {
  const menuColor = useColorModeValue('gray.400', 'white');
  const setOpen = usePageStore((s) => s.setSidebarIsOpen);

  return (
    <IconButton
      onClick={() => setOpen(true)}
      variant="no-hover"
      icon={<Icon as={IoMenuOutline} w="20px" h="20px" />}
      color={menuColor}
      _hover={{ cursor: 'pointer' }}
      aria-label="toggle sidebar"
      {...props}
    />
  );
}
