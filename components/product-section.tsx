import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  brand: string;
}

interface ProductPageProps {
  products: Product[];
  addToCart: (product: Product) => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ products, addToCart }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  return (
    <main>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white">
        <h1 className="text-xl font-bold">Our Products</h1>
      </div>
      <header className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center space-x-4">
          {/* Burger Menu */}
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className="md:hidden"
          >
            ☰
          </Button>
        </div>
        {/* Transparent Search Bar */}
        <Input
          placeholder="Search Products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm bg-transparent border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
      </header>

      {/* Filters Sidebar for Mobile */}
      {isFilterOpen && (
        <aside className="md:hidden bg-gray-100 p-4 border-b">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
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
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2">Price Range</h3>
            <Slider
              value={priceRange}
              onValueChange={(value) =>
                setPriceRange(value as [number, number])
              }
              min={0}
              max={1000000}
              step={10}
              className="w-full"
            />
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
      )}

      {/* Main Content */}
      <div className="flex h-screen">
        {/* Toggle Button for Mobile/Tablet */}
        <button
          className="md:hidden p-2 fixed top-4 left-4 z-20 bg-gray-200 rounded-md shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "Close" : "Filters"}
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed md:sticky top-0 z-10 w-3/4 md:w-1/4 h-screen bg-gray-100 p-4 border-r overflow-y-auto`}
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
            <Slider
              value={priceRange}
              onValueChange={(value) =>
                setPriceRange(value as [number, number])
              }
              min={0}
              max={1000000}
              step={10}
              className="w-full"
            />
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

        {/* Products Section */}
        <section className="flex-1 ml-auto md:ml-1/4 p-4 overflow-y-auto h-screen">
          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500">No products found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <div key={product.id}>
                  <Card>
                    <CardContent className="p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover mb-4 rounded-md"
                      />
                      <h2 className="text-xl font-semibold mb-2">
                        {product.name}
                      </h2>
                      <p className="text-muted-foreground mb-4">
                        ${product.price.toFixed(2)}
                      </p>
                      <Button
                        onClick={() => addToCart(product)}
                        className="w-full"
                      >
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProductPage;
