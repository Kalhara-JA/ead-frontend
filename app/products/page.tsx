"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import FiltersSidebar from "@/components/products/filterSlideBar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MenuIcon } from "lucide-react";
import ProductDialog from "@/components/products/ProductDialog";
import { Slider } from "@/components/ui/slider";
import { Toaster } from "react-hot-toast";
import {
  getAllProducts,
} from "@/services/productService";

interface Product {
  id: number;
  name: string;
  skuCode: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  description: string;
  quantity: number;
}

const ProductPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await getAllProducts();
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  // Extract unique categories and brands
  const categories = Array.from(new Set(products.map((p) => p.category)));
  const brands = Array.from(new Set(products.map((p) => p.brand)));

  // Filter products
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedCategory || product.category === selectedCategory) &&
      (!selectedBrand || product.brand === selectedBrand) &&
      product.price >= priceRange[0] &&
      product.price <= priceRange[1]
  );
  console.log(filteredProducts);

  return (
    <main>
      <div className="flex items-center justify-between p-2 bg-white">
        <h1 className="text-xl font-bold">Our Products</h1>
        <Input
          placeholder="Search Products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm bg-transparent border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
      <header className="flex items-center justify-between p-4 border-b bg-white"></header>

      {isFilterOpen && (
        <FiltersSidebar
          categories={categories}
          brands={brands}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
      )}

      {/* Main Content */}
      <div className="flex h-screen">
        {/* Toggle Button for Mobile/Tablet */}

        <button
          className="md:hidden p-2 fixed top-6 left-2 z-20 bg-gray-200 mt-24 rounded-md shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "Close" : <MenuIcon className="h-5 w-5" />}
        </button>
        {/* Sidebar */}
        <aside
          className={`fixed top-0 z-30 h-screen w-3/4 bg-gray-100 p-4 border-r overflow-y-auto transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:sticky md:translate-x-0 md:w-1/4`}
        >
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          {/* Category */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2">Category</h3>
            <Select
              onValueChange={(value) =>
                setSelectedCategory(value === "all" ? "" : value)
              }
              value={selectedCategory || "all"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Brand */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2">Brand</h3>
            <Select
              onValueChange={(value) =>
                setSelectedBrand(value === "all" ? "" : value)
              }
              value={selectedBrand || "all"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Price Range */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2">Price Range</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label htmlFor="minPrice" className="text-sm">
                  Min:
                </label>
                <input
                  type="number"
                  id="minPrice"
                  value={priceRange[0]}
                  min={0}
                  max={priceRange[1] - 1}
                  step={10}
                  onChange={(e) => {
                    const newMin = Math.min(
                      Number(e.target.value),
                      priceRange[1] - 1
                    );
                    setPriceRange([newMin, priceRange[1]]);
                  }}
                  className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="maxPrice" className="text-sm">
                  Max:
                </label>
                <input
                  type="number"
                  id="maxPrice"
                  value={priceRange[1]}
                  min={priceRange[0] + 1}
                  max={10000000000}
                  step={10}
                  onChange={(e) => {
                    const newMax = Math.max(
                      Number(e.target.value),
                      priceRange[0] + 1
                    );
                    setPriceRange([priceRange[0], newMax]);
                  }}
                  className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => {
              setSelectedCategory("");
              setSelectedBrand("");
              setPriceRange([0, 1000000]);
            }}
            className="w-full hover:bg-gray-200 focus:ring focus:ring-blue-300"
          >
            Reset Filters
          </Button>
        </aside>

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Products Section */}
        <section className="flex-1 ml-auto md:ml-1/4 p-4 overflow-y-auto h-screen">
          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500">No products found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductDialog
                  key={product.id}
                  product={product}
                  // quantity={quantities[product.id] || 0}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProductPage;
