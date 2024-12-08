import BrandFilter from "./brandFilter";
import { Button } from "@/components/ui/button";
import CategoryFilter from "./catogaryFilter";
import PriceRangeFilter from "./priceRangerFilter";
import React from "react";

interface FiltersSidebarProps {
  categories: string[];
  brands: string[];
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedBrand: string;
  setSelectedBrand: (value: string) => void;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
}

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  categories,
  brands,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  priceRange,
  setPriceRange,
}) => {
  return (
    <aside className="bg-gray-100 p-4 border-r">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <BrandFilter
        brands={brands}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
      />
      <PriceRangeFilter priceRange={priceRange} setPriceRange={setPriceRange} />
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
  );
};

export default FiltersSidebar;
