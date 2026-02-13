import { Link } from "react-router-dom";
import { HotelType } from "../../../shared/types";
import {
  MapPin,
  Building2,
  Users,
  Wifi,
  Car,
  Waves,
  Dumbbell,
  Sparkles,
  UtensilsCrossed,
  Coffee,
  Plane,
  Building,
  Star,
} from "lucide-react";
import { Badge } from "./ui/badge";

type Props = {
  hotel: HotelType;
};

const SearchResultsCard = ({ hotel }: Props) => {
  const getFacilityIcon = (facility: string) => {
    const iconMap: { [key: string]: any } = {
      "Free WiFi": Wifi,
      "Free Parking": Car,
      "Swimming Pool": Waves,
      "Fitness Center": Dumbbell,
      Spa: Sparkles,
      Restaurant: UtensilsCrossed,
      "Bar/Lounge": Coffee,
      "Airport Shuttle": Plane,
      "Business Center": Building,
    };
    return iconMap[facility] || Building2;
  };

  return (
    <div
      data-testid="hotel-card"
      className="group bg-white rounded-3xl shadow-luxury hover:shadow-luxury-lg transition-all duration-500 border border-orange-100/50 overflow-hidden h-auto xl:h-[450px] flex flex-col md:flex-row"
    >
      <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-0 w-full h-full">
        {/* Image Section */}
        <div className="relative overflow-hidden h-72 md:h-full">
          <img
            src={hotel.imageUrls[0]}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          />

          {/* Overlay Badges */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2 z-10">
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-full px-4 py-1.5 shadow-lg">
              <span className="text-xs font-black tracking-widest">£{hotel.pricePerNight}</span>
            </div>
            {hotel.isFeatured && (
              <div className="glassmorphism text-amber-900 rounded-full px-3 py-1 shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-widest">Featured</span>
              </div>
            )}
          </div>

          {/* Star Rating Badge */}
          <div className="absolute top-4 right-4 z-10">
            <div className="glassmorphism rounded-full px-3 py-1.5 flex items-center space-x-1 shadow-sm font-bold text-slate-800">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
              <span className="text-xs">{hotel.starRating}</span>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8 flex flex-col justify-between h-auto md:h-full bg-gradient-to-br from-white to-orange-50/20">
          <div className="space-y-4">
            {/* Header */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {Array.isArray(hotel.type) ? (
                  hotel.type.slice(0, 3).map((type) => (
                    <Badge
                      key={type}
                      variant="outline"
                      className="text-[10px] px-2 py-0.5 border-orange-200 text-orange-900 font-bold uppercase tracking-tighter bg-orange-50/50"
                    >
                      {type}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-orange-200 text-orange-900 font-bold uppercase tracking-tighter bg-orange-50/50">
                    {hotel.type}
                  </Badge>
                )}
              </div>

              <Link
                to={`/detail/${hotel._id}`}
                className="text-2xl md:text-3xl font-bold text-slate-900 hover:text-amber-600 transition-colors cursor-pointer font-serif italic block leading-tight"
              >
                {hotel.name}
              </Link>

              <div className="flex items-center text-slate-500 font-medium">
                <MapPin className="w-4 h-4 mr-1.5 text-amber-600" />
                <span className="text-sm">
                  {hotel.city}, {hotel.country}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="text-slate-600 leading-relaxed line-clamp-2 md:line-clamp-3 text-sm">
              {hotel.description}
            </div>

            {/* Hotel Stats */}
            <div className="flex items-center space-x-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
              {hotel.totalBookings && (
                <div className="flex items-center space-x-1.5">
                  <Users className="w-4 h-4 text-orange-400" />
                  <span>{hotel.totalBookings} stays</span>
                </div>
              )}
              <div className="flex items-center space-x-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-current" />
                <span>
                  {hotel.averageRating && hotel.averageRating > 0
                    ? `${hotel.averageRating.toFixed(1)} Rating`
                    : "New Palace"}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Area: Amenities & Action */}
          <div className="mt-6 md:mt-8 pt-6 border-t border-orange-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {hotel.facilities.slice(0, 4).map((facility) => {
                const IconComponent = getFacilityIcon(facility);
                return (
                  <div
                    key={facility}
                    className="flex items-center space-x-1.5 px-2.5 py-1 bg-white border border-slate-100 rounded-lg shadow-sm"
                    title={facility}
                  >
                    <IconComponent className="w-3 h-3 text-amber-500" />
                    <span className="text-[10px] font-bold text-slate-600 whitespace-nowrap">{facility}</span>
                  </div>
                );
              })}
            </div>

            <Link
              to={`/detail/${hotel._id}`}
              className="bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 px-8 rounded-xl font-bold hover:from-orange-600 hover:to-amber-700 transform hover:scale-[1.05] transition-all duration-300 text-center shadow-lg hover:shadow-amber-500/20 flex items-center justify-center gap-2 group"
            >
              <span>Explore Suite</span>
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsCard;
