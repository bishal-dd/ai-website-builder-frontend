import { Features } from "@/pages/home/sections/features";
import { Footer } from "@/pages/home/sections/footer";
import { Header } from "@/pages/home/sections/header";
import { Hero } from "@/pages/home/sections/hero";
import { Testimonials } from "@/pages/home/sections/testimonials";


export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Testimonials />
      <Footer />
    </main>
  )
}