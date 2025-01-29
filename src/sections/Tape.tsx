"use client";
import StarIcon from "@/assets/icons/star.svg";
import { words } from "@/data/data";
import LeftToRight from "@/components/LeftToRight";

export const TapeSection = () => {
  return (
    <div className="py-16 lg:py-24 overflow-x-clip">
      <div className="bg-gradient-to-r from-emerald-300 to-sky-400 overflow-x-clip -rotate-3 -mx-1">
        <div className="flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <LeftToRight
            direction="left"
            moveValue="50%"
            className="flex  flex-none gap-4 pr-4 py-3 "
          >
            {words.map((word) => (
              <div key={word} className="inline-flex gap-4 items-center">
                <span className="text-gray-900 uppercase font-semibold text-sm">
                  {word}
                </span>
                <StarIcon className="size-6 text-gray-900 -rotate-12" />
              </div>
            ))}
          </LeftToRight>
        </div>
      </div>
    </div>
  );
};
