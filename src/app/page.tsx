import { CTA } from "@/features/landing-page/ui/Cta";
import { Features } from "@/features/landing-page/ui/Features";
import { Footer } from "@/features/landing-page/ui/Footer";
import { Header } from "@/features/landing-page/ui/Header";
import { Hero } from "@/features/landing-page/ui/Hero";
import { HowItWorks } from "@/features/landing-page/ui/HowItWorks";
import { Pricing } from "@/features/landing-page/ui/Pricing";
import { StatsBanner } from "@/features/landing-page/ui/StatsCard";
import { TemplatesShowcase } from "@/features/landing-page/ui/TemplatesShowcase";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <StatsBanner />
      <Features />
      <TemplatesShowcase />
      <HowItWorks />
      <Pricing />
      {/*<Testimonials />*/}
      <CTA />
      <Footer />
    </main>
  );
}
