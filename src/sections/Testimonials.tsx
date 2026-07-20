"use client";
import { motion, useAnimation } from "framer-motion";
import memojiAvatar1 from "@/assets/images/memoji-avatar-1.png";
import SectionHeader from "@/components/SectionHeader";
import Image from "next/image";
import Card from "@/components/Card";
import { Fragment } from "react";
import BlurFade from "@/components/BlurFade";
import { useCachedFetch } from "@/hooks/useCachedFetch";

export const TestimonialsSection = () => {
  const controls = useAnimation();
  const { data: testimonialsRaw = [] } = useCachedFetch<{ id: string; name: string; position: string; text: string; avatar: string }[]>({
    key: "testimonials",
    fetchFn: () => fetch("/api/testimonials").then(res => res.json()),
  });
  const testimonials = Array.isArray(testimonialsRaw) ? testimonialsRaw : [];

  return (
    <div className="py-16 lg:py-24">
      <div className="container">
        <SectionHeader
          eyebrow="TESTIMONIAL OF FEW FOLKS"
          title="Word On The Street About Me"
          description="Don't just take my word for it. See what my clients have to say
        about my work"
        />

        <div className="mt-12 lg:mt-20 flex overflow-x-clip [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-4 -my-4">
          <motion.div

            animate={controls}
            initial={{ x: "0%" ,}}
            transition={{ duration: 60, ease: "linear", repeat: Infinity }}
            onMouseEnter={() => controls.stop()}
            onMouseLeave={() => controls.start({ x: "-50%" })}
            className="flex pr-8 gap-8 flex-none  py-3 "
          >
            {[...new Array(2)].fill(0).map((_, idx) => (
              <Fragment key={idx}>
                {testimonials.map((testimonial) => (
                  <motion.div
                    key={testimonial.id}
                    whileHover={{
                      rotate: -5,
                      scale: 1.05,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                  >
                    <Card
                      key={testimonial.id}
                      className="max-w-xs md:max-w-md p-6 md:p-8 "
                    >
                      <div className="flex gap-4 items-center ">
                        <div className="size-14 bg-gray-700 inline-flex items-center justify-center rounded-full flex-shrink-0 overflow-hidden">
                          <Image
                            src={testimonial.avatar || memojiAvatar1}
                            alt={testimonial.name}
                            width={56}
                            height={56}
                            className="object-cover"
                          />
                        </div>
                        <BlurFade>
                          <div className="font-semibold">
                            {testimonial.name}
                          </div>
                          <div className="text-sm text-white/40">
                            {testimonial.position}
                          </div>
                        </BlurFade>
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
