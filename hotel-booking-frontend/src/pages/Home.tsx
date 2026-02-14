import Hero from "../components/Hero";
import { useSearchContext } from "../contexts/SearchContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const search = useSearchContext();
  const navigate = useNavigate();
  const places = ["Chennai", "Coimbatore", "Theni", "Kerala"];

  const handlePlaceClick = (place: string) => {
    search.saveSearchValues(
      place,
      search.checkIn,
      search.checkOut,
      search.adultCount,
      search.childCount
    );
    navigate("/search?destination=" + place);
  };

  const handleSearch = (searchData: any) => {
    search.saveSearchValues(
      searchData.destination || "",
      search.checkIn,
      search.checkOut,
      search.adultCount,
      search.childCount
    );
    navigate("/search?destination=" + (searchData.destination || ""));
  };

  return (
    <>
      <Hero onSearch={handleSearch} />
      <div className="space-y-4 md:space-y-8 pb-10 mt-10">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
            Explore Top Destinations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {places.map((place) => (
              <button
                key={place}
                onClick={() => handlePlaceClick(place)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-slate-200 group flex flex-col items-center justify-center gap-4 hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center group-hover:bg-amber-500 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-amber-600 group-hover:text-white transition-colors duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-slate-700 group-hover:text-amber-600 transition-colors">
                  {place}
                </span>
                <span className="text-sm text-slate-500 font-medium">
                  View Hotels
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
