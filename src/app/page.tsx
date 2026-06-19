import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SmoothScroll } from "./_landing/SmoothScroll";
import { Navbar } from "./_landing/Navbar";
import { Hero } from "./_landing/Hero";
import { StatsBar } from "./_landing/StatsBar";
import { Features } from "./_landing/Features";
import { HowItWorks } from "./_landing/HowItWorks";
import { Faq } from "./_landing/Faq";
import { CtaSection } from "./_landing/CtaSection";
import { Footer } from "./_landing/Footer";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) redirect("/dashboard");

  return (
    <SmoothScroll>
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <main>
          <Hero />
          <StatsBar />
          <Features />
          <HowItWorks />
          <Faq />
          <CtaSection />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
