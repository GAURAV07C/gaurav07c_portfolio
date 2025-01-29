"use client";
import { motion, useAnimation } from "framer-motion";
import memojiAvatar1 from "@/assets/images/memoji-avatar-1.png";
import memojiAvatar2 from "@/assets/images/memoji-avatar-2.png";
import SectionHeader from "@/components/SectionHeader";
import Image from "next/image";
import Card from "@/components/Card";
import { Fragment } from "react";
const testimonials = [
  {
    name: "Alex Turner",
    position: "Marketing Manager @ TechStartups",
    text: "Alex was instrumental in transforming our website into a powerful marketing tool. His attention to detail and ability to understand our brand is exceptional. We're thrilled with the results!",
    avatar: memojiAvatar1,
  },
  {
    name: "Olivia Green",
    position: "Head of Design @ GreenLeaf",
    text: "Working with Alex was a pleasure. His expertise in frontend development brought our designs to life in a way we never imagined. The website has exceeded our expectations.",
    avatar: memojiAvatar2,
  },
  {
    name: "Oliva Green",
    position: "Head of Design @ GreenLeaf",
    text: "Working with Alex was a pleasure. His expertise in frontend development brought our designs to life in a way we never imagined. The website has exceeded our expectations.",
    avatar: memojiAvatar2,
  },
  {
    name: "Olivi Green",
    position: "Head of Design @ GreenLeaf",
    text: "Working with Alex was a pleasure. His expertise in frontend development brought our designs to life in a way we never imagined. The website has exceeded our expectations.",
    avatar: memojiAvatar2,
  },
];

export const TestimonialsSection = () => {
  const controls = useAnimation();
  return (
    <div className="py-16 lg:py-24">
      <div className="container">
        <SectionHeader
          eyebrow="Happy Clients"
          title="What Client Say about Me"
          description="Don't just take my word for it. See what my clients have to say
        about my work"
        />

        <div className="mt-12 lg:mt-20 flex overflow-x-clip [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-4 -my-4">
          <motion.div
            animate={controls}
            initial={{ x: 0 }}
            transition={{ duration: 90, ease: "linear", repeat: Infinity }}
            onMouseEnter={() => controls.stop()} 
            onMouseLeave={() => controls.start({ x: "-50%" })} 
            className="flex pr-8 gap-8 flex-none  py-3"
          >
            {[...new Array(2)].fill(0).map((_, idx) => (
              <Fragment key={idx}>
                {testimonials.map((testimonial) => (
                  <motion.div
                    key={testimonial.name}
                    whileHover={{
                      rotate: -5,
                      scale: 1.05,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                  >
                    <Card
                      key={testimonial.name}
                      className="max-w-xs md:max-w-md p-6 md:p-8 "
                    >
                      <div className="flex gap-4 items-center ">
                        <div className="size-14 bg-gray-700 inline-flex items-center justify-center rounded-full flex-shrink-0">
                          <Image
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="max-h-full"
                          />
                        </div>
                        <div>
                          <div className="font-semibold">
                            {testimonial.name}
                          </div>
                          <div className="text-sm text-white/40">
                            {testimonial.position}
                          </div>
                        </div>
                      </div>
                      <p className="mt-4 md:mt-6 text-sm md:text-base">
                        {testimonial.text}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </Fragment>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
