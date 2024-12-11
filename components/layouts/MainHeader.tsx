'use client'

import {
    MenuIcon,
    ShoppingBag,
    ShoppingCartIcon,
    XIcon,
} from "lucide-react";
import React, { useState } from "react";

import AuthButton from "@/components/AuthButton";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cartContext";
import { useSession } from "next-auth/react";

const MainHeader = () => {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { totalItems, toggleCart } = useCart();

    return (
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="/#">
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">Shop@Us</span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a href="/products">Products</a>
              <a href="/about">About</a>
            </nav>
          </div>
          <button
            className="inline-flex items-center md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </button>
          {isMenuOpen && (
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
            <div className="fixed left-0 top-0 bottom-0 w-full max-w-xs p-6 bg-background shadow-lg">
              <div className="flex flex-col space-y-4">
                <a
                  className="text-sm font-medium text-primary"
                  href="/products"
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                >
                  Products
                </a>
                <a
                  className="text-sm font-medium text-primary"
                  href="/#categories-section"
                >
                  Categories
                </a>
                <a className="text-sm font-medium text-primary" href="#">
                  Deals
                </a>
                <a className="text-sm font-medium text-primary" href="/#about">
                  About
                </a>
              </div>
              <button
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
                onClick={() => setIsMenuOpen(false)}
              >
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>
          </div>
          )}
          <div className="flex flex-1 items-center justify-end">
            {session && (
              <a href="/orders">
                <Button variant="outline" size="icon" className="relative mr-4">
                  <ShoppingBag className="h-4 w-4" />
                </Button>
              </a>
            )}
            <Button
                variant="outline"
                size="icon"
                className="relative mr-4"
                onClick={toggleCart}
            >
                <ShoppingCartIcon className="h-4 w-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
            </Button>
            <AuthButton />
          </div>
        </div>
      </div>
    );
};
  
export default MainHeader;