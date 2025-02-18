import { AboutSection } from "@/sections/About";
import Aboutme from "@/sections/Aboutme";
import { ContactSection } from "@/sections/Contact";
import Education from "@/sections/Education";
import Experience from "@/sections/Experience";
// import { Footer } from "@/sections/Footer";
import { Header } from "@/sections/Header";
import { HeroSection } from "@/sections/Hero";
import Introduction from "@/sections/Introduction";
import { ProjectsSection } from "@/sections/Projects";
import Skill from "@/sections/Skill";
import { TapeSection } from "@/sections/Tape";
import { TestimonialsSection } from "@/sections/Testimonials";

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
      <TapeSection />
      <TestimonialsSection />
      <Aboutme  />
      <AboutSection />
      <ContactSection />
      {/* <Footer /> */}
    </div>
  );
}
