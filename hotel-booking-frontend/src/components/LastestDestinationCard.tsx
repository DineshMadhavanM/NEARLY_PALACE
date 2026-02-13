import { Link } from "react-router-dom";
import { HotelType } from "../../../shared/types";
import { MapPin, Star, Sparkles } from "lucide-react";
import { Badge } from "./ui/badge";

type Props = {
  hotel: HotelType;
};

const LatestDestinationCard = ({ hotel }: Props) => {
  return (
    <Link
      to={`/detail/${hotel._id}`}
      className="group relative cursor-pointer overflow-hidden rounded-3xl shadow-luxury transition-all duration-500 hover:shadow-luxury-lg hover:scale-[1.02] bg-slate-900 flex flex-col w-full h-[380px] md:h-[400px] border border-orange-100/50"
    >
      <div className="w-full h-full relative overflow-hidden">
        <img
          src={hotel.imageUrls[0]}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay Graduate - Darker for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Hotel Stats Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className="glassmorphism rounded-full px-3 py-1.5 flex items-center space-x-1 shadow-sm">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span className="text-xs font-bold text-slate-800">
              {hotel.starRating}
            </span>
          </div>
        </div>

        {/* Price Badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-full px-4 py-1.5 shadow-lg">
            <span className="text-xs font-black tracking-wider">£{hotel.pricePerNight}</span>
          </div>
        </div>

        <div className="absolute bottom-0 p-6 w-full z-10">
          <div className="space-y-3">
            <div className="space-y-1">
              <h3 className="text-white font-bold text-2xl leading-none tracking-tight group-hover:text-amber-200 transition-colors font-serif italic">
                {hotel.name}
              </h3>

              <div className="flex items-center space-x-2 text-amber-100/90">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold tracking-wide">
                  {hotel.city}, {hotel.country}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="flex flex-col space-y-2">
                {/* Hotel Types */}
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(hotel.type) ? (
                    hotel.type.slice(0, 2).map((type) => (
                      <Badge
                        key={type}
                        variant="outline"
                        className="text-[10px] px-2 py-0.5 glassmorphism border-white/20 text-white font-bold uppercase tracking-tighter"
                      >
                        {type}
                      </Badge>
                    ))
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-2 py-0.5 glassmorphism border-white/20 text-white font-bold uppercase tracking-tighter"
                    >
                      {hotel.type}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="glassmorphism rounded-xl px-4 py-2 hover:bg-white/30 transition-all group-hover:bg-amber-500 group-hover:border-amber-400 shadow-sm flex items-center gap-2">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                  View
                </span>
                <Sparkles className="w-3 h-3 text-amber-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LatestDestinationCard;
