import { Metadata } from "next";
import { AboutSection } from "@/sections/About";
import Aboutme from "@/sections/Aboutme";
import { ContactSection } from "@/sections/Contact";
import Education from "@/sections/Education";
import Experience from "@/sections/Experience";
import { Footer } from "@/sections/Footer";
import { Header } from "@/sections/Header";
import { HeroSection } from "@/sections/Hero";
import Introduction from "@/sections/Introduction";
import { OpenSourceSection } from "@/sections/OpenSource";
import { ProjectsSection } from "@/sections/Projects";
import Skill from "@/sections/Skill";
import { TapeSection } from "@/sections/Tape";
import { TestimonialsSection } from "@/sections/Testimonials";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Gaurav07C | Full Stack Developer Portfolio",
  description: "I specialize in transforming designs into functional, high-performing web applications. Let's discuss your next project.",
};

export default function Home() {
  return (
    <div className="">
      <Header />
      <HeroSection />
      <Introduction />
      <Skill />
      <Experience />
      <Education />
      <ProjectsSection />
      <OpenSourceSection />
      <TapeSection />
      <TestimonialsSection />
      <Aboutme  />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
