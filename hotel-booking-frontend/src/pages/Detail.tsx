import { useParams } from "react-router-dom";
import { useQueryWithLoading } from "../hooks/useLoadingHooks";
import * as apiClient from "./../api-client";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";
import {
  MapPin,
  Phone,
  Globe,
  Clock,
  Car,
  Wifi,
  Waves,
  Dumbbell,
  Sparkles,
  Plane,
  Building2,
  Star,
} from "lucide-react";

const Detail = () => {
  const { hotelId } = useParams();

  const { data: hotel } = useQueryWithLoading(
    "fetchHotelById",
    () => apiClient.fetchHotelById(hotelId || ""),
    {
      enabled: !!hotelId,
      loadingMessage: "Loading hotel details...",
    }
  );

  if (!hotel) {
    return (
      <div className="text-center text-lg text-slate-500 py-20 font-serif italic text-gradient-gold">
        The palace you seek could not be found.
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-1">
            {Array.from({ length: hotel.starRating }).map((_, i) => (
              <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
            ))}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 font-serif italic leading-tight">
            {hotel.name}
          </h1>

          {/* Location and Contact Info */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-slate-600 font-medium text-sm md:text-base">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-600" />
              <span>
                {hotel.city}, {hotel.country}
              </span>
            </div>
            {hotel.contact?.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-amber-600" />
                <span>{hotel.contact.phone}</span>
              </div>
            )}
            {hotel.contact?.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-600" />
                <a
                  href={hotel.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 hover:text-amber-800 underline decoration-amber-200"
                >
                  Official Palace Site
                </a>
              </div>
            )}
          </div>

          {/* Statistics Section with Premium Badges */}
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="glassmorphism rounded-full px-4 py-2 flex items-center gap-2 shadow-sm border-orange-100">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-700">
                {hotel.averageRating && hotel.averageRating > 0
                  ? `${hotel.averageRating.toFixed(1)} / 5 Rating`
                  : "Premier Experience"}
              </span>
            </div>
            {hotel.totalBookings && hotel.totalBookings > 0 && (
              <div className="bg-amber-50 rounded-full px-4 py-2 flex items-center gap-2 border border-amber-100">
                <Building2 className="w-4 h-4 text-amber-600" />
                <span className="text-[10px] md:text-xs font-bold text-amber-900 uppercase tracking-wide">
                  {hotel.totalBookings} Exclusive Stays
                </span>
              </div>
            )}
            {hotel.isFeatured && (
              <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest leading-none">Featured Palace</span>
              </div>
            )}
          </div>
        </div>

        {/* Hero Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {hotel.imageUrls.map((image: string, i: number) => (
            <div key={i} className={`h-[300px] md:h-[400px] overflow-hidden rounded-3xl shadow-luxury group ${i === 0 ? 'md:col-span-2' : ''}`}>
              <img
                src={image}
                alt={hotel.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          ))}
        </div>

        {/* Main Details and Booking Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 mt-12">
          <div className="space-y-10">
            {/* About Section */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold font-serif text-slate-900 border-l-4 border-amber-500 pl-4 italic">
                About the Palace
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line font-medium border-b border-orange-50 pb-8 italic">
                {hotel.description}
              </p>
            </div>

            {/* Facilities Highlight */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold font-serif text-slate-900 border-l-4 border-amber-500 pl-4 italic">
                World-Class Facilities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {hotel.facilities.map((facility) => {
                  return (
                    <div key={facility} className="glassmorphism p-4 rounded-2xl flex items-center gap-3 transition-all hover:bg-amber-50/50 hover:border-amber-200 group">
                      <div className="w-10 h-10 rounded-xl bg-amber-100/50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                        {facility === "Free WiFi" && <Wifi className="w-5 h-5" />}
                        {facility === "Parking" && <Car className="w-5 h-5" />}
                        {facility === "Airport Shuttle" && <Plane className="w-5 h-5" />}
                        {facility === "Outdoor Pool" && <Waves className="w-5 h-5" />}
                        {facility === "Spa" && <Sparkles className="w-5 h-5" />}
                        {facility === "Fitness Center" && <Dumbbell className="w-5 h-5" />}
                        {!["Free WiFi", "Parking", "Airport Shuttle", "Outdoor Pool", "Spa", "Fitness Center"].includes(facility) && <Building2 className="w-5 h-5" />}
                      </div>
                      <span className="text-sm font-bold text-slate-700">{facility}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Policies Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-white p-8 rounded-[2.5rem] border border-orange-100 shadow-luxury">
              <div className="space-y-4">
                <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-400">Timings & Policies</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span className="font-semibold">Check-in: {hotel.policies?.checkInTime || "Premium Hours"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span className="font-semibold">Check-out: {hotel.policies?.checkOutTime || "Leisurely"}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-400">Palace Etiquette</h4>
                <div className="space-y-2 text-sm font-medium text-slate-600 italic">
                  <p>Pets: {hotel.policies?.petPolicy || "On Inquiry"}</p>
                  <p>Smoking: {hotel.policies?.smokingPolicy || "Preserved Environment"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Component */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="shadow-luxury-lg rounded-[2.5rem] overflow-hidden border border-amber-100">
              <GuestInfoForm
                pricePerNight={hotel.pricePerNight}
                hotelId={hotel._id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
