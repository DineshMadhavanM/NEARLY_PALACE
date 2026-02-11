import { useState } from "react";
import { Slider } from "./ui/slider";

type Props = {
  selectedPrice?: number;
  onChange: (value?: number) => void;
};

const PriceFilter = ({ selectedPrice, onChange }: Props) => {
  // Use local state for the slider value to allow smooth dragging
  // Default to [0, 1000] if no selectedPrice, or [0, selectedPrice]
  // Ideally, this component receives the range or just the max.
  // The user snippet uses a local state [0, 1000] and calls onChange.

  // Note: users snippet suggests:
  // const [priceRange, setPriceRange] = useState([0, 1000]);
  // <Slider value={priceRange} onChange={setPriceRange} ... />

  // But our Props has `selectedPrice` (number) and `onChange` (number).
  // I will adapt the internal logic to match the snippet style but map it to the external props.
  // The external prop seems to be "max price".

  const [price, setPrice] = useState<number[]>(selectedPrice ? [selectedPrice] : [1000]);

  return (
    <div>
      <h4 className="text-md font-semibold mb-2">Max Price</h4>
      <Slider
        defaultValue={[1000]}
        value={price}
        onValueChange={(value) => {
          setPrice(value);
          // The Slider returns an array, we take the first value as max price
          onChange(value[0]);
        }}
        max={1000}
        step={10}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>£0</span>
        <span>£{price[0]}</span>
      </div>
    </div>
  );
};

export default PriceFilter;
