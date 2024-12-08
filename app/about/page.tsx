"use client";

import React, { useState } from "react";

import Header from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

function AboutSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("landing");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">
            About Shop@Us
          </h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-muted-foreground mb-6">
              At Shop@Us, we are dedicated to transforming how people shop for
              products and services online. Our mission is to create a platform
              where convenience, variety, and satisfaction meet seamlessly.
            </p>
            <p className="text-muted-foreground mb-6">
              Founded by a passionate team of innovators and e-commerce
              enthusiasts, Shop@Us aims to set new standards in online shopping
              experiences. We understand that your time is valuable, and our
              platform is designed to save you time while providing exceptional
              choices.
            </p>
            <p className="text-muted-foreground">
              From everyday essentials to niche products, our curated catalog is
              built to cater to your unique needs. At Shop@Us, we prioritize
              quality, affordability, and ease of use, ensuring that every
              interaction leaves you delighted and confident in your choice.
            </p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}

export default AboutSection;
