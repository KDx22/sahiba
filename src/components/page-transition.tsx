'use client';

import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, x: 50, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: -50, y: 0 },
};

export const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="hidden"
    animate="enter"
    exit="exit"
    variants={variants}
    transition={{ type: 'spring', stiffness: 260, damping: 30 }}
    className="flex-1 flex flex-col"
  >
    {children}
  </motion.div>
);
