import { HotelSearchParams } from "../../../shared/types";
import { useSearchContext } from "../contexts/SearchContext";
import { useState } from "react";
import { Search, MapPin, Sparkles, Crown } from "lucide-react";

interface Props {
  onSearch?: (searchParams: HotelSearchParams) => void;
}

const Hero = ({ onSearch }: Props) => {
  const search = useSearchContext();
  const [destination, setDestination] = useState<string>(search.destination || "");

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        destination,
      });
    }
  };

  return (
    <div className="pb-10 md:pb-20 relative overflow-hidden">
      {/* Hero Section with Luxury Gradient */}
      <div className="bg-gradient-to-br from-orange-900 via-amber-900 to-orange-950 pb-20 pt-12 md:pb-24 md:pt-16 relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Crown Icon - Hidden on very small mobile to save space */}
            <div className="flex justify-center mb-2 md:mb-4">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-3 md:p-4 rounded-2xl shadow-luxury-lg scale-90 md:scale-100">
                <Crown className="w-8 h-8 md:w-12 md:h-12 text-white" />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-100 to-amber-200 leading-tight px-4 font-serif italic">
              Discover Your Royal Escape
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-2xl text-amber-100/90 font-medium max-w-2xl mx-auto flex items-center justify-center gap-2 flex-wrap">
              <Sparkles className="w-5 h-5 text-amber-400 hidden sm:block" />
              Experience luxury at palace-worthy destinations
              <Sparkles className="w-5 h-5 text-amber-400 hidden sm:block" />
            </p>
          </div>
        </div>
      </div>

      {/* Elevated Search Bar - Redesigned for Mobile */}
      <div className="container mx-auto px-4 relative -mt-8 md:-mt-16 z-20">
        <div className="bg-white/95 backdrop-blur-md p-4 md:p-8 shadow-luxury-lg rounded-2xl border border-orange-100/50">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch">
            {/* Destination Input */}
            <div className="flex-1 relative group">
              <label className="hidden md:grid grid-flow-col justify-start items-center gap-2 text-sm font-bold text-orange-900 mb-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                Where would you like to stay?
              </label>
              <div className="relative">
                <input
                  placeholder="Where to? (e.g., Paris, Dubai)"
                  className="w-full pl-12 pr-4 py-3.5 md:py-4 border-2 border-orange-50 md:border-orange-100 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 font-medium text-gray-800 transition-all placeholder:text-gray-400 bg-orange-50/30 md:bg-white"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full md:w-auto bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-8 py-3.5 md:py-4 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group hover:scale-[1.02] md:hover:scale-105 active:scale-95"
              >
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="md:hidden">Search Stays</span>
                <span className="hidden md:inline">Search Luxury Stays</span>
              </button>
            </div>
          </div>

          {/* Quick Suggestions - Scrollable on Mobile */}
          <div className="mt-4 pt-4 border-t border-orange-50">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
              <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest whitespace-nowrap mr-2">Hot:</p>
              {['Paris', 'Dubai', 'Maldives', 'Tokyo', 'London'].map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setDestination(city);
                    if (onSearch) onSearch({ destination: city });
                  }}
                  className="px-3 py-1.5 bg-orange-50/50 hover:bg-amber-100 text-orange-900 rounded-full text-xs font-semibold transition-all border border-orange-100 hover:border-amber-300 whitespace-nowrap flex-shrink-0"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
