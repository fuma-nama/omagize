import { motion } from 'framer-motion';
import { ReactElement } from 'react';

export function HorizontalCollapse({
  in: isOpen,
  children,
}: {
  in: boolean;
  children: ReactElement;
}) {
  return (
    <motion.section
      animate={isOpen ? 'open' : 'collapsed'}
      exit="collapsed"
      variants={{
        open: { opacity: 1, width: 'auto' },
        collapsed: { opacity: 0, width: 0 },
      }}
      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
    >
      {children}
    </motion.section>
  );
}
