import SectionHeader from "@/components/SectionHeader";
import Link from "next/link";
import React from "react";

const Aboutme = () => {
  return (
    <div>
      <div id="about" className="py-20 lg:py-28">
        <div className="container">
          <SectionHeader
            eyebrow="About Me"
            title="Know who am I"
            description="My journey in few words"
          />
          <div className="mt-20 flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-8 ">
              <div className="md:col-span-2 lg:col-span-1 text-white/70">
                I’m a passionate{" "}
                <Link href={"#education"}>
                  <span className="text-white">pre-final year undergrad</span>
                </Link>{" "}
                with a deep love for coding and technology. My journey has led
                me to develop a strong foundation in{" "}
                <Link href={"#skill"}>
                  <span className="text-white">
                    Web development and the emerging world of Web3
                  </span>
                </Link>
                . I thrive on building innovative{" "}
                <Link href={"#Project"}>
                  <span className="text-white">products</span>
                </Link>{" "}
                . Always eager to expand my skills and tackle new challenges,
                I’m actively seeking lucrative opportunities to leverage my tech
                expertise and drive impactful projects. Whether it’s through
                creating seamless web experiences or exploring the future of
                decentralized applications, I’m excited to contribute to the
                tech landscape and grow alongside it.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aboutme;
