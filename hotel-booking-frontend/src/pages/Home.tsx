import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import LatestDestinationCard from "../components/LastestDestinationCard";
// import AdvancedSearch from "../components/AdvancedSearch";
import Hero from "../components/Hero";
import { useSearchContext } from "../contexts/SearchContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { data: hotels } = useQuery("fetchQuery", () =>
    apiClient.fetchHotels()
  );

  const search = useSearchContext();
  const navigate = useNavigate();

  const handleSearch = (searchData: any) => {
    // Update search context with the destination
    search.saveSearchValues(
      searchData.destination || "",
      search.checkIn,
      search.checkOut,
      search.adultCount,
      search.childCount
    );
    // Navigate to search page
    navigate("/search");
  };

  return (
    <>
      <Hero onSearch={handleSearch} />
      <div className="space-y-8">
        {/* Latest Destinations Section */}
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Latest Destinations
            </h2>
            <p className="text-gray-600">
              Most recent destinations added by our hosts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels?.map((hotel) => (
              <LatestDestinationCard key={hotel._id} hotel={hotel} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
