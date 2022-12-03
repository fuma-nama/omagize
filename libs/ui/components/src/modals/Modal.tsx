import { Fragment, ReactNode, useEffect, useState } from 'react';

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
