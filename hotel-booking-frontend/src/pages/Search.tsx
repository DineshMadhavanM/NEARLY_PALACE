import useSearchContext from "../hooks/useSearchContext";
import { useQueryWithLoading } from "../hooks/useLoadingHooks";
import * as apiClient from "../api-client";
import { useState } from "react";
import SearchResultsCard from "../components/SearchResultsCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
import PriceFilter from "../components/PriceFilter";
import SearchBar from "../components/SearchBar";
import { Filter, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";

import { useSearchParams } from "react-router-dom"; // Add import

const Search = () => {
  const search = useSearchContext();
  const [searchParamsURL] = useSearchParams(); // Get URL params
  const [page, setPage] = useState<number>(1);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  const [sortOption, setSortOption] = useState<string>("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const searchParams = {
    destination: searchParamsURL.get("destination") || search.destination?.trim() || "",
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    adultCount: search.adultCount.toString(),
    childCount: search.childCount.toString(),
    page: page.toString(),
    stars: selectedStars,
    types: selectedHotelTypes,
    facilities: selectedFacilities,
    maxPrice: selectedPrice?.toString(),
    sortOption,
  };

  const { data: hotelData } = useQueryWithLoading(
    ["searchHotels", searchParams],
    () => apiClient.searchHotels(searchParams),
    {
      loadingMessage: "Searching for perfect hotels...",
    }
  );

  const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value;

    setSelectedStars((prevStars) =>
      event.target.checked
        ? [...prevStars, starRating]
        : prevStars.filter((star) => star !== starRating)
    );
  };

  const handleHotelTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const hotelType = event.target.value;

    setSelectedHotelTypes((prevHotelTypes) =>
      event.target.checked
        ? [...prevHotelTypes, hotelType]
        : prevHotelTypes.filter((hotel) => hotel !== hotelType)
    );
  };

  const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const facility = event.target.value;

    setSelectedFacilities((prevFacilities) =>
      event.target.checked
        ? [...prevFacilities, facility]
        : prevFacilities.filter((prevFacility) => prevFacility !== facility)
    );
  };

  const activeFilterCount = selectedStars.length + selectedHotelTypes.length + selectedFacilities.length + (selectedPrice ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-luxury border border-amber-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-amber-600" />
          Refine Your Selection
        </h2>
        <SearchBar />
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="w-full flex items-center justify-between bg-white px-6 py-4 rounded-xl border-2 border-amber-200 shadow-sm hover:border-amber-400 transition-all font-bold text-slate-700 active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-amber-600" />
            <span>Search Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-amber-600 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </div>
          {isFiltersOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Filters Sidebar */}
        <div className={`
          ${isFiltersOpen ? 'block animate-in fade-in slide-in-from-top-4' : 'hidden'} 
          lg:block rounded-2xl border border-slate-200 bg-white p-6 h-fit lg:sticky lg:top-24 order-2 lg:order-1 shadow-sm
        `}>
          <div className="space-y-6">
            <h3 className="text-lg font-black text-slate-800 border-b border-slate-100 pb-4 uppercase tracking-wider">
              Filter results
            </h3>
            <StarRatingFilter
              selectedStars={selectedStars}
              onChange={handleStarsChange}
            />
            <HotelTypesFilter
              selectedHotelTypes={selectedHotelTypes}
              onChange={handleHotelTypeChange}
            />
            <FacilitiesFilter
              selectedFacilities={selectedFacilities}
              onChange={handleFacilityChange}
            />
            <PriceFilter
              selectedPrice={selectedPrice}
              onChange={(value?: number) => setSelectedPrice(value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-5 order-1 lg:order-2">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">
              {hotelData?.pagination.total} Hotels found
              {search.destination ? ` in ${search.destination}` : ""}
            </span>
            <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="">Sort By</option>
              <option value="starRating">Star Rating</option>
              <option value="pricePerNightAsc">
                Price Per Night (low to high)
              </option>
              <option value="pricePerNightDesc">
                Price Per Night (high to low)
              </option>
            </select>
          </div>
          {hotelData?.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No hotels found
              </h3>
              <p className="text-gray-500 max-w-md">
                {search.destination ? (
                  <>
                    We couldn't find any hotels in{" "}
                    <span className="font-medium">{search.destination}</span>
                    {selectedStars.length > 0 && (
                      <>
                        {" "}
                        with {selectedStars.length === 1 ? "a" : ""}{" "}
                        {selectedStars.join(", ")} star rating
                      </>
                    )}
                    {selectedPrice && <> under ${selectedPrice} per night</>}.
                  </>
                ) : (
                  <>
                    We couldn't find any hotels matching your criteria
                    {selectedStars.length > 0 && (
                      <>
                        {" "}
                        with {selectedStars.length === 1 ? "a" : ""}{" "}
                        {selectedStars.join(", ")} star rating
                      </>
                    )}
                    {selectedPrice && <> under ${selectedPrice} per night</>}.
                  </>
                )}
              </p>
              <div className="mt-6 space-y-2 text-sm text-gray-400">
                <p>
                  Try adjusting your filters or search for a different
                  destination.
                </p>
                {selectedStars.length > 0 ||
                  selectedHotelTypes.length > 0 ||
                  selectedFacilities.length > 0 ||
                  selectedPrice ? (
                  <button
                    onClick={() => {
                      setSelectedStars([]);
                      setSelectedHotelTypes([]);
                      setSelectedFacilities([]);
                      setSelectedPrice(undefined);
                      setSortOption("");
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear all filters
                  </button>
                ) : null}
              </div>
            </div>
          ) : (
            <>
              {hotelData?.data.map(
                (hotel: import("../../../shared/types").HotelType) => (
                  <SearchResultsCard key={hotel._id} hotel={hotel} />
                )
              )}
              <div>
                <Pagination
                  page={hotelData?.pagination.page || 1}
                  pages={hotelData?.pagination.pages || 1}
                  onPageChange={(page) => setPage(page)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
