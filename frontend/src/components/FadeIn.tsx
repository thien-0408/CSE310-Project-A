// app/components/FadeIn.js
"use client";

import { motion } from "framer-motion";

export const FadeIn = ({ children, className }: { children: React.ReactNode; className?: string; }) => {
  return (
    // We wrap the content in a <motion.div>
    <motion.div
      // 1. Set the initial state (hidden)
      initial={{ opacity: 0, y: 20 }}
      
      // 2. Set the state to animate to (visible)
      //    "whileInView" triggers this when the element enters the viewport
      whileInView={{ opacity: 1, y: 0 }}
      
      // 3. Add transition properties
      transition={{ duration: 1, ease: "easeOut" }}
      
      // 4. Set viewport options
      //    "once: true" ensures the animation only happens once
      viewport={{ once: true }}
      
      // Pass through any additional classes
      className={className}
    >
      {children}
    </motion.div>
  );
};