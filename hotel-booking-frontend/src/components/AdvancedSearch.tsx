import { useForm } from "react-hook-form";
import { HotelSearchParams } from "../../../shared/types";
import { useSearchContext } from "../contexts/SearchContext";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  onSearch: (searchParams: HotelSearchParams) => void;
  isExpanded?: boolean;
}

const AdvancedSearch = ({ onSearch, isExpanded = false }: Props) => {
  const search = useSearchContext();
  const [expanded, setExpanded] = useState(isExpanded);

  const { register, handleSubmit, reset } = useForm<HotelSearchParams>({
    defaultValues: {
      destination: search.destination,
      adultCount: search.adultCount.toString(),
      childCount: search.childCount.toString(),
      checkIn: search.checkIn.toISOString(),
      checkOut: search.checkOut.toISOString(),
    },
  });

  const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
  const [checkOut, setCheckOut] = useState<Date>(search.checkOut);

  const hotelTypes = [
    "Budget",
    "Boutique",
    "Luxury",
    "Ski Resort",
    "Business",
    "Family",
    "Romantic",
    "Hikers",
    "Cabin",
  ];

  const hotelFacilities = [
    "Free WiFi",
    "Parking",
    "Airport Shuttle",
    "Family Rooms",
    "Non-Smoking Rooms",
    "Outdoor Pool",
    "Spa",
    "Fitness Center",
  ];

  const onSubmit = handleSubmit((data) => {
    onSearch(data);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 bg-orange-400 p-8 shadow-md rounded-lg gap-4">
      <form onSubmit={onSubmit} className="contents">
        <div className="flex flex-row items-center flex-1 bg-white p-2">
          <span className="text-md  font-bold ml-2">Where to?</span>
          <input
            className="w-full p-1 focus:outline-none font-bold"
            placeholder="City, country or hotel..."
            {...register("destination")}
          />
        </div>

        <div className="flex bg-white px-2 py-1 gap-2">
          <label className="flex items-center">
            Adults:
            <input
              className="w-full p-1 focus:outline-none font-bold"
              type="number"
              min={1}
              max={20}
              {...register("adultCount")}
            />
          </label>
          <label className="flex items-center">
            Children:
            <input
              className="w-full p-1 focus:outline-none font-bold"
              type="number"
              min={0}
              max={20}
              {...register("childCount")}
            />
          </label>
        </div>

        <div className="flex bg-white px-2 py-1 gap-2">
          <DatePicker
            selected={checkIn}
            onChange={(date) => setCheckIn(date as Date)}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={new Date()} // minimal date is today
            maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))} // max date is 1 year from now
            placeholderText="Check-in Date"
            className="min-w-full bg-white p-2 focus:outline-none "
            wrapperClassName="min-w-full"
          />
        </div>
        <div className="flex bg-white px-2 py-1 gap-2">
          <DatePicker
            selected={checkOut}
            onChange={(date) => setCheckOut(date as Date)}
            selectsEnd
            startDate={checkIn}
            endDate={checkOut}
            minDate={checkIn}
            maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
            placeholderText="Check-out Date"
            className="min-w-full bg-white p-2 focus:outline-none"
            wrapperClassName="min-w-full"
          />
        </div>

        {/* Expanded Filters */}
        {expanded && (
          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-slate-300 pt-5 mt-2">
            {/* Type Filter */}
            <div>
              <h4 className="text-md font-semibold mb-2">Hotel Type</h4>
              {hotelTypes.map((type) => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={type}
                    {...register("types")}
                    className="rounded"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>

            {/* Facilities Filter */}
            <div>
              <h4 className="text-md font-semibold mb-2">Facilities</h4>
              {hotelFacilities.map((facility) => (
                <label key={facility} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={facility}
                    {...register("facilities")}
                    className="rounded"
                  />
                  <span>{facility}</span>
                </label>
              ))}
            </div>

            {/* Price Filter */}
            <div>
              <h4 className="text-md font-semibold mb-2">Max Price</h4>
              <select
                {...register("maxPrice")}
                className="p-2 border rounded-md w-full"
              >
                <option value="">Select Max Price</option>
                {[50, 100, 200, 300, 500].map((price) => (
                  <option key={price} value={price}>
                    £{price}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="lg:col-span-4 flex justify-between items-center mt-2">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-white text-sm underline"
          >
            {expanded ? "Show Less" : "Advanced Filters"}
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => reset()}
              className="bg-gray-500 text-white p-2 font-bold hover:bg-gray-400 text-sm"
            >
              Clear
            </button>
            <button className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdvancedSearch;
