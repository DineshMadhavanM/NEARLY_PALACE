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
      <div className="space-y-4 md:space-y-8 pb-10">
        {/* Latest Destinations Section */}
        <div className="max-w-8xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-end justify-between mb-6 md:mb-10 px-2">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 border-l-4 border-amber-500 pl-4">
                Latest Destinations
              </h2>
              <p className="text-sm md:text-base text-slate-500 font-medium">
                Most recent stays added by our world-class hosts
              </p>
            </div>
            <button className="hidden md:block text-amber-600 font-bold hover:text-amber-700 transition-colors">
              View All
            </button>
          </div>

          {/* Horizontal Scroll on Mobile, Grid on Desktop */}
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-visible scrollbar-hide pb-6 -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth snap-x">
            {hotels?.map((hotel) => (
              <div key={hotel._id} className="min-w-[85vw] md:min-w-0 snap-center">
                <LatestDestinationCard hotel={hotel} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
