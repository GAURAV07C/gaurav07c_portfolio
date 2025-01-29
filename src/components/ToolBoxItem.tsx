import React from 'react'
import TechIcon from './TechIcon';
import { twMerge } from 'tailwind-merge';

const ToolBoxItem = ({
  items,
  className,
  itemWraperClassName,
}: {
  className?: string;
  itemWraperClassName?:string
  items: {
    title: string;
    iconsType: React.ElementType;
  }[];
}) => {
  return (
    <div
      className={twMerge(
        "flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className
      )}
    >
      <div className={twMerge("flex float- py-0.5 gap-6 pr-6",itemWraperClassName)}>
        {items.map((item) => (
          <div
            key={item.title}
            className="inline-flex items-center gap-4 py-2 px-3 outline outline-2 outline-white/10 rounded-lg"
          >
            <TechIcon component={item.iconsType} />

            <span className="font-semibold">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolBoxItem
