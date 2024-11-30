import {
    Select,
    SelectContent,
    SelectItem,
    SelectValue,
  } from "@/components/ui/select";
  import { SelectTrigger } from "@radix-ui/react-select";
  import React from "react";


interface BrandFilterProps {
  brands: string[];
  selectedBrand: string;
  setSelectedBrand: (value: string) => void;
}

const BrandFilter: React.FC<BrandFilterProps> = ({ brands, selectedBrand, setSelectedBrand }) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-2">Brand</h3>
      <Select
        onValueChange={(value) => setSelectedBrand(value === "all" ? "" : value)}
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
  );
};

export default BrandFilter;
