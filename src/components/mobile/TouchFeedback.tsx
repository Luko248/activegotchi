import React, { useState } from "react";
import { motion } from "framer-motion";

interface TouchFeedbackProps {
  children: React.ReactNode;
  onTap?: () => void;
  className?: string;
}

export const TouchFeedback: React.FC<TouchFeedbackProps> = ({
  children,
  onTap,
  className = "",
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.div
      className={`${className} ${
        isPressed ? "scale-95" : "scale-100"
      } transition-transform duration-150`}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => {
        setIsPressed(false);
        onTap?.();
      }}
      onTouchCancel={() => setIsPressed(false)}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
};
