import { CTA } from "@/features/landing-page/ui/Cta";
import { Features } from "@/features/landing-page/ui/Features";
import { Footer } from "@/features/landing-page/ui/Footer";
import { Header } from "@/features/landing-page/ui/Header";
import { Pricing } from "@/features/landing-page/ui/Pricing";
import { StatsBanner } from "@/features/landing-page/ui/StatsCard";
import { TemplatesShowcase } from "@/features/landing-page/ui/TemplatesShowcase";
import { RedirectIfAuthenticatedRoute } from "@/shared/routes/RedirectIfAuthenticatedRoute";

export default function LandingPage() {
  return (
    <RedirectIfAuthenticatedRoute>
      <main className="min-h-screen">
        <Header />
        {/* <Hero /> */}
        <TemplatesShowcase />
        <StatsBanner />
        <Features />
        {/* <HowItWorks /> */}
        <Pricing />
        {/* <Testimonials /> */}
        <CTA />
        <Footer />
      </main>
    </RedirectIfAuthenticatedRoute>
  );
}
