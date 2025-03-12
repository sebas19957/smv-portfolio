import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Home } from "@/components/Home";
import { Footer } from "@/components/layouts/Footer";
import { Nav } from "@/components/layouts/Nav";
import { Projects } from "@/components/Projects";
import { Resume } from "@/components/Resume";
import { Skills } from "@/components/Skills";
import { Testimonials } from "@/components/Testimonials";

export default function HomePage() {
  return (
    <main>
      <Nav />
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
