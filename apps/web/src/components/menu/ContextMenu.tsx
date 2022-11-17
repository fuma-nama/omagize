import * as React from 'react';
import { useRef, useState } from 'react';
import { useEventListener, Menu, MenuButton, MenuList } from '@chakra-ui/react';
import { useColors } from 'variables/colors';

function inElement(element: HTMLElement, target: EventTarget) {
  return element.contains(target as any) || target === element;
}

export function useContextMenu<T extends HTMLElement = HTMLElement>(children: React.ReactNode) {
  const { globalBg } = useColors();
  const [position, setPosition] = useState<[number, number] | null>(null);
  const targetRef = useRef<T>(null);

  useEventListener('contextmenu', (e) => {
    if (targetRef.current != null && inElement(targetRef.current, e.target)) {
      setPosition([e.pageX, e.pageY]);
      e.preventDefault();
    } else {
      setPosition(null);
    }
  });

  const onClose = () => setPosition(null);

  return {
    targetRef,
    isOpen: position != null,
    open: (x: number, y: number) => {
      setPosition([x, y]);
    },
    menu: (
      <Menu isOpen={position != null} gutter={0} onClose={onClose}>
        <MenuButton
          aria-hidden={true}
          cursor="default"
          pos="fixed"
          left={position && position[0]}
          top={position && position[1]}
        />
        <MenuList bg={globalBg} border={0}>
          {children}
        </MenuList>
      </Menu>
    ),
  };
}
