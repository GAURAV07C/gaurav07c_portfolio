"use client";

import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
const HeroOrbit = ({
  children,
  size,
  rotation,
  spinDuration,
  orbitdSpin = false,
  starDuration,
  starSpin = false,
}: PropsWithChildren<{
  size: number;
  rotation: number;
  spinDuration?: string;
  orbitdSpin?: boolean;
  starDuration?: string;
  starSpin?: boolean;
}>) => {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2   ">
      <div
        className={twMerge(orbitdSpin === true && "animate-spin ")}
        style={{
          animationDuration: spinDuration,
        }}
      >
        <div
          className="  flex  items-start justify-start"
          style={{
            transform: `rotate(${rotation}deg)`,
            width: `${size}px`,
            height: `${size}px`,
          }}
        >
          <div
            className={twMerge(starSpin === true && "animate-spin")}
            style={{
              animationDuration: starDuration,
            }}
          >
            <div
              className=" inline-flex "
              style={{
                transform: `rotate(${rotation * -1}deg)`,
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroOrbit;
