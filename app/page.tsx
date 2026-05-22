import { Hero } from "@/components/features/Hero";
import { ProjectGrid } from "@/components/features/ProjectGrid";
import { AboutSection } from "@/components/features/AboutSection";
import { SkillsMatrix } from "@/components/features/SkillsMatrix";
import { ContactSection } from "@/components/features/ContactSection";
import { getAllProjects } from "@/lib/projects";

export default function HomePage() {
  const projects = getAllProjects();

  return (
    <>
      <Hero />
      <ProjectGrid projects={projects} />
      <AboutSection />
      <SkillsMatrix />
      <ContactSection />
    </>
  );
}
