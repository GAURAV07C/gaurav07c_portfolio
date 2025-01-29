"use client";
import { motion } from "framer-motion";
import React, { Fragment, PropsWithChildren } from "react";

const Marquee = ({
  className,
  children,
  direction = "left", // Default direction is "left"
  moveValue = "100%", // Default movement value
}: PropsWithChildren<{
  className?: string;
  direction?: "left" | "right";
  moveValue?: string;
}>) => {
  return (
    <motion.div
      className={className}
      animate={{
        x:
          direction === "left"
            ? [`0%`, `-${moveValue}`]
            : [`-${moveValue}`, "0%"],
      }}
      transition={{ duration: 30, ease: "linear", repeat: Infinity }}
    >
      {[...new Array(2)].map((_, i) => (
        <Fragment key={i}>{children}</Fragment>
      ))}
    </motion.div>
  );
};

export default Marquee;
