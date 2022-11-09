import * as React from 'react';
import { useRef, useState } from 'react';
import { useEventListener, Portal, Menu, MenuButton } from '@chakra-ui/react';

export function useContextMenu<T extends HTMLElement = HTMLElement>(
  children: React.ReactNode
) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const targetRef = useRef<T>(null);

  useEventListener('contextmenu', (e) => {
    if (
      targetRef.current?.contains(e.target as any) ||
      e.target === targetRef.current
    ) {
      setPosition([e.pageX, e.pageY]);
      e.preventDefault();
    } else {
      setPosition(null);
    }
  });

  const onClose = () => setPosition(null);

  return {
    targetRef,
    open: (x: number, y: number) => {
      setPosition([x, y]);
    },
    menu: (
      <Portal>
        <Menu isOpen={position != null} gutter={0} onClose={onClose}>
          <MenuButton
            aria-hidden={true}
            cursor="default"
            pos="absolute"
            left={position && position[0]}
            top={position && position[1]}
          />
          {children}
        </Menu>
      </Portal>
    ),
  };
}
