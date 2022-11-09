import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useEventListener, Portal, Menu, MenuButton } from '@chakra-ui/react';

export function useContextMenu<T extends HTMLElement = HTMLElement>(
  children: React.ReactNode
) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isDeferredOpen, setIsDeferredOpen] = useState(false);
  const [position, setPosition] = useState<[number, number]>([0, 0]);
  const targetRef = useRef<T>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setIsRendered(true);
        setTimeout(() => {
          setIsDeferredOpen(true);
        });
      });
    } else {
      setIsDeferredOpen(false);
      const timeout = setTimeout(() => {
        setIsRendered(isOpen);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEventListener('contextmenu', (e) => {
    if (
      targetRef.current?.contains(e.target as any) ||
      e.target === targetRef.current
    ) {
      e.preventDefault();
      setIsOpen(true);
      setPosition([e.pageX, e.pageY]);
    } else {
      setIsOpen(false);
    }
  });

  const onCloseHandler = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return {
    targetRef,
    open: (x: number, y: number) => {
      setIsOpen(true);
      setPosition([x, y]);
    },
    menu: isRendered && (
      <Portal>
        <Menu isOpen={isDeferredOpen} gutter={0} onClose={onCloseHandler}>
          <MenuButton
            aria-hidden={true}
            w={1}
            h={1}
            style={{
              position: 'absolute',
              left: position[0],
              top: position[1],
              cursor: 'default',
            }}
          />
          {children}
        </Menu>
      </Portal>
    ),
  };
}
