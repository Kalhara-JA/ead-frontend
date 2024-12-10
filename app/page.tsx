"use client";

import { ArrowRight, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import CTASignUpSection from "@/components/cta-section";
import CategorySection from "@/components/category-section";
import CompanyLogoSection from "@/components/company-logo";
import FeaturesSection from "@/components/features-section";
import SiteFooter from "@/components/site-footer";
import TestimonialSection from "@/components/testimonial-section";
import { useRouter } from "next/navigation";

const categories = [
  { name: "Marketing Tools", icon: "📈" },
  { name: "Design Software", icon: "🎨" },
  { name: "AI Solutions", icon: "🤖" },
  { name: "Project Management", icon: "📅" },
  { name: "Communication Tools", icon: "💬" },
  { name: "Analytics Platforms", icon: "📊" },
];

export default function ECommerceApp() {
  const router = useRouter();
  const handleNavigation = (page: string) => {
    router.push(page);
  };

  const renderLandingPage = () => (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-28 xl:py-28 bg-white dark:bg-black overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_700px] items-center">
            <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl xl:text-6xl/none text-black dark:text-white">
                Shop with Ease, Anytime, Anywhere
              </h1>
              <p className="max-w-[600px] text-gray-600 dark:text-gray-300 md:text-xl mx-auto lg:mx-0">
                Discover a world of products at your fingertips. From fashion to
                electronics, we've got you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  className="inline-flex items-center justify-center rounded-md bg-black text-white dark:bg-white dark:text-black shadow transition-colors hover:bg-gray-800 dark:hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400"
                  onClick={() => handleNavigation("/products")}
                >
                  Shop Now
                  <ShoppingBag className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="inline-flex items-center justify-center border-black text-black dark:border-white dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
                  onClick={() => window.open("https://easyui.pro", "_blank")}
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="relative mx-auto lg:order-last">
              <img
                alt="Hero"
                className="relative z-10 w-full h-[auto] max-w-[700px] aspect-[4/3] object-cover object-center"
                height="750"
                src="/shopUs3.jpg"
                width="700"
              />
              <div className="absolute -top-4 -left-4 w-6 h-6 bg-black dark:bg-white rounded-full" />
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-black dark:bg-white rounded-full" />

              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1), rgba(0,0,0,0.05) 70%, transparent 70%)",
                }}
              />
            </div>
          </div>
        </div>
      </section>
      <CompanyLogoSection />

      <CategorySection categories={categories} />

      <TestimonialSection />

      <FeaturesSection />

      <CTASignUpSection />
    </main>
  );

  return (
    <div className="flex flex-col min-h-screen">
      {renderLandingPage()}
      <SiteFooter />
    </div>
  );
}
