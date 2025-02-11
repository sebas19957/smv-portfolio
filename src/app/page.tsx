import { About } from "@/components/About";
import { Nav } from "@/components/layouts/Nav";
import { SocialLinks } from "@/components/layouts/SocialLinks";
import { Skills } from "@/components/Skills";
import { Resume } from "@/components/Resume";
import { Projects } from "@/components/Projects";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/layouts/Footer";
import { Home } from "@/components/Home";

export default function HomePage() {
  return (
    <main>
      <Nav />
      <SocialLinks />
      <Home />
      <About />
      <Skills />
      <Resume />
      <Projects />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
