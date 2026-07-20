"use client";
import StarIcon from "@/assets/icons/star.svg";
import BlurFade from "@/components/BlurFade";
import LeftToRight from "@/components/LeftToRight";
import { useCachedFetch } from "@/hooks/useCachedFetch";

export const TapeSection = () => {
  const { data: wordsRaw = [] } = useCachedFetch<{ id: string; word: string }[]>({
    key: "tape-words",
    fetchFn: () => fetch("/api/tape-words").then(res => res.json()),
  });
  const words = Array.isArray(wordsRaw) ? wordsRaw : [];

  return (
    <div className="py-16 lg:py-24 overflow-x-clip">
      <div className="bg-gradient-to-r from-emerald-300 to-sky-400 overflow-x-clip -rotate-3 -mx-1">
        <div className="flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <LeftToRight
            direction="left"
            moveValue="50%"
            className="flex  flex-none gap-4 pr-4 py-3 "
          >
            {words.map((wordObj, index) => (
              <div key={wordObj.id} className="inline-flex gap-4 items-center">
                <BlurFade
                  delay={0.04 + index * 0.5}
                  className="text-gray-900 uppercase font-semibold text-sm"
                >
                  {wordObj.word}
                </BlurFade>
                <BlurFade
                  delay={0.04 + index * 0.3}
                  className="text-gray-900 uppercase font-semibold text-sm"
                >
                  <StarIcon className="size-6 text-gray-900 -rotate-12" />
                </BlurFade>
              </div>
            ))}
          </LeftToRight>
        </div>
      </div>
    </div>
  );
};
