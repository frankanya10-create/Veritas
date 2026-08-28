"use client";

import NavigationBar from "@/components/landing/NavigationBar";
import HeroSection from "@/components/landing/HeroSection";
import TrustedBy from "@/components/landing/TrustedBy";
import MetricsSection from "@/components/landing/MetricsSection";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturesSection from "@/components/landing/FeaturesSection";
import IntegrationsCloud from "@/components/landing/IntegrationsCloud";
import Testimonials from "@/components/landing/Testimonials";
import ArchitectureSection from "@/components/landing/ArchitectureSection";
import AboutUs from "@/components/landing/AboutUs";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function LandingClient() {
  return (
    <main className="min-h-screen bg-black">
      <NavigationBar />
      <HeroSection />
      <TrustedBy />
      <MetricsSection />
      <HowItWorks />
      <FeaturesSection />
      <IntegrationsCloud />
      <Testimonials />
      <ArchitectureSection />
      <AboutUs />
      <CTASection />
      <Footer />
    </main>
  );
}
