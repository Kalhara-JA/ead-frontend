import { Slider } from "@/components/ui/slider";
import React from "react";
interface PriceRangeFilterProps {
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  priceRange,
  setPriceRange,
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-2">Price Rangfgyhgryge</h3>
      <Slider
        value={priceRange}
        onValueChange={(value) => setPriceRange(value as [number, number])}
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
  );
};

export default PriceRangeFilter;
