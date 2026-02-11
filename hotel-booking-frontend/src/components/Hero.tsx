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
    <div className="pb-20 relative overflow-hidden">
      {/* Hero Section with Luxury Gradient */}
      <div className="bg-gradient-to-br from-violet-900 via-violet-800 to-fuchsia-900 pb-24 pt-16 relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Crown Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-violet-400 to-fuchsia-500 p-4 rounded-2xl shadow-luxury">
                <Crown className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-fuchsia-100 to-violet-200 leading-tight">
              Discover Your Royal Escape
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-fuchsia-100/90 font-medium max-w-2xl mx-auto flex items-center justify-center gap-2 flex-wrap">
              <Sparkles className="w-6 h-6 text-fuchsia-400" />
              Experience luxury accommodations at palace-worthy destinations
              <Sparkles className="w-6 h-6 text-fuchsia-400" />
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-fuchsia-200">
                <div className="w-2 h-2 rounded-full bg-fuchsia-400"></div>
                <span className="text-sm font-semibold">Premium Properties</span>
              </div>
              <div className="flex items-center gap-2 text-fuchsia-200">
                <div className="w-2 h-2 rounded-full bg-fuchsia-400"></div>
                <span className="text-sm font-semibold">Best Price Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-fuchsia-200">
                <div className="w-2 h-2 rounded-full bg-fuchsia-400"></div>
                <span className="text-sm font-semibold">24/7 Concierge</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Elevated Search Bar */}
      <div className="container mx-auto px-4 relative">
        <div className="bg-white p-6 md:p-8 shadow-luxury rounded-2xl absolute -top-16 left-4 right-4 border-2 border-fuchsia-400/20">
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            {/* Destination Input */}
            <div className="flex-1 relative group">
              <label className="block text-sm font-bold text-violet-900 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-violet-600" />
                Where would you like to stay?
              </label>
              <div className="relative">
                <input
                  placeholder="Enter destination (city, hotel, landmark)"
                  className="w-full px-4 py-4 border-2 border-violet-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 font-medium text-gray-800 transition-all placeholder:text-gray-400"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-400" />
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full md:w-auto bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-600 hover:to-fuchsia-700 text-white px-8 py-4 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group hover:scale-105"
              >
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Search Luxury Stays
              </button>
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="mt-4 pt-4 border-t border-violet-100">
            <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wider">Popular Destinations:</p>
            <div className="flex flex-wrap gap-2">
              {['Paris', 'Dubai', 'Maldives', 'Tokyo', 'New York', 'London'].map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setDestination(city);
                    if (onSearch) onSearch({ destination: city });
                  }}
                  className="px-3 py-1.5 bg-violet-50 hover:bg-fuchsia-100 text-violet-900 rounded-lg text-sm font-medium transition-colors border border-violet-200 hover:border-fuchsia-400"
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
