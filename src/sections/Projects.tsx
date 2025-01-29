import Link from "next/link";
import Image from "next/image";
import CheakCircleIcon from "@/assets/icons/check-circle.svg";
import SourceIcon from "@/assets/icons/source.svg";
import GithubIcon from "@/assets/icons/github.svg";
import SectionHeader from "@/components/SectionHeader";
import Card from "@/components/Card";
import { portfolioProjects } from "@/data/data";

export const ProjectsSection = () => {
  return (
    <section id="project" className="pb-16 lg:py-24">
      <div className="container">
        <SectionHeader
          eyebrow="Real-world Results"
          title="Featured Projects"
          description="See how I transform concepts intp engaging digital experiences."
        />

        <div className="flex flex-col mt-10 md:mt-20 gap-20 ">
          {portfolioProjects.map((project, index) => (
            <div
              key={project.title}
              className="sticky "
              style={{
                top: `calc(64px + ${index * 20}px)`,
              }}
            >
              <Card className="px-8 pt-8 md:pt-12 md:px-12 lg:pt-16 lg:px-20 ">
                <div className="lg:grid lg:grid-cols-2 gap-16">
                  <div className="lg:pb-16">
                    <div className="bg-gradient-to-r from-emerald-300 to-sky-400 inline-flex gap-2 font-bold uppercase tracking-widest text-sm text-transparent bg-clip-text">
                      <span>{project.company}</span>
                      <span>&bull;</span>
                      <span>{project.year}</span>
                    </div>

                    <h3 className="font-serif text-2xl mt-2 md:mt-5 md:text-4xl">
                      {project.title}
                    </h3>
                    <hr className="border-t-2 border-white/5 mt-4 md:mt-5" />
                    <ul className="flex flex-col gap-4 mt-4 md:mt-5">
                      {project.results.map((result) => (
                        <li
                          key={result.title}
                          className="flex gap-2 text-sm md:text-base text-white/50"
                        >
                          <CheakCircleIcon className="size-5 md:size-6" />
                          <span> {result.title}</span>
                        </li>
                      ))}
                    </ul>
                    <div>
                      <ul className="inline-flex items-center gap-2 px-6  rounded-full  absolute lg:-ml-8 mt-2 flex-wrap  py-4 w-[50%]">
                        {project.techStack.map((tech) => (
                          <li
                            key={tech.title}
                            className="inline-flex  items-center rounded-lg 
                            font-semibold  font-mono 
                            
                            px-2
                            py-0 text-[13px] outline outline-2 outline-white/10 text-black bg-white tracking-wider   "
                          >
                            {tech.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-10 inline-flex gap-2 py-3">
                      <div>
                        <Link href={project.link}>
                          <button className="bg-white text-gray-950 h-12 w-full md:w-auto px-6 rounded-xl font-semibold inline-flex items-center justify-center gap-3 mt-8 hover:bg-white/80 ">
                            <SourceIcon className="size-4" />
                            <span> Website </span>
                          </button>
                        </Link>
                      </div>
                      <div>
                        <Link href={project.source}>
                          <button className="bg-white text-gray-950 h-12 w-full md:w-auto px-6 rounded-xl font-semibold inline-flex items-center justify-center gap-3 mt-8 hover:bg-white/80 ">
                            <GithubIcon className="size-4" />
                            <span> Source </span>
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <Image
                      src={project.image}
                      alt={project.title}
                      className="mt-8 pb-0 -mb-4 md:mb-0   lg:mt-0  lg:absolute lg:h-full lg:w-auto lg:max-w-none"
                    />
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
