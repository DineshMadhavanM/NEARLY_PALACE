import { Link } from "react-router-dom";
import { useQueryWithLoading } from "../hooks/useLoadingHooks";
import * as apiClient from "../api-client";
import { BsMap } from "react-icons/bs";
import {
  Plus,
  Edit,
  Eye,
  TrendingUp,
  Users,
  Star,
  Building2,
  Calendar,
  Sparkles,
  MessageSquareCode,
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import BookingLogModal from "../components/BookingLogModal";
import ReviewModal from "../components/ReviewModal";
import { useState } from "react";

const MyHotels = () => {
  const [selectedHotel, setSelectedHotel] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isBookingLogOpen, setIsBookingLogOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const { data: hotelData } = useQueryWithLoading(
    "fetchMyHotels",
    apiClient.fetchMyHotels,
    {
      onError: () => { },
      loadingMessage: "Loading your properties...",
    }
  );

  const handleOpenBookingLog = (hotelId: string, hotelName: string) => {
    setSelectedHotel({ id: hotelId, name: hotelName });
    setIsBookingLogOpen(true);
  };

  const handleCloseBookingLog = () => {
    setIsBookingLogOpen(false);
    setSelectedHotel(null);
  };

  const handleOpenReviews = (hotelId: string, hotelName: string) => {
    setSelectedHotel({ id: hotelId, name: hotelName });
    setIsReviewModalOpen(true);
  };

  const handleCloseReviews = () => {
    setIsReviewModalOpen(false);
    setSelectedHotel(null);
  };

  if (!hotelData || hotelData.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-white rounded-[2.5rem] p-12 max-w-lg mx-auto text-center shadow-xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16 blur-3xl"></div>

          <div className="relative z-10">
            <div className="bg-primary-50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 transform rotate-3 shadow-inner">
              <Building2 className="w-12 h-12 text-primary-600" />
            </div>

            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
              No Properties Listed
            </h3>
            <p className="text-slate-500 text-lg font-medium mb-10">
              Your portfolio is currently empty. Start your journey as a hotel owner by listing your first property today.
            </p>

            <Link
              to="/add-hotel"
              className="inline-flex items-center bg-primary-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary-200"
            >
              <Plus className="w-6 h-6 mr-2" />
              List a Property
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Property Portfolio
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Manage your hotel listings, track performance, and handle bookings.
          </p>
        </div>
        <Link
          to="/add-hotel"
          className="inline-flex items-center bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-2xl font-bold hover:from-primary-700 hover:to-primary-800 transform hover:scale-105 transition-all duration-300 shadow-xl shadow-primary-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Hotel
        </Link>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Hotels", value: hotelData.length, icon: Building2, color: "blue" },
          { label: "Total Bookings", value: hotelData.reduce((sum, h) => sum + (h.totalBookings || 0), 0), icon: Users, color: "green" },
          { label: "Total Revenue", value: `£${hotelData.reduce((sum, h) => sum + (h.totalRevenue || 0), 0).toLocaleString()}`, icon: TrendingUp, color: "amber" },
          { label: "Avg Rating", value: hotelData.length > 0 ? (hotelData.reduce((sum, h) => sum + (h.averageRating || 0), 0) / hotelData.length).toFixed(1) : "0.0", icon: Star, color: "orange" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl bg-${stat.color}-50`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hotels List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {hotelData.map((hotel) => (
          <div
            key={hotel._id}
            className="group bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 overflow-hidden flex flex-col"
          >
            {/* Image Wrapper */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={hotel.imageUrls[0]}
                alt={hotel.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <Badge className="bg-white/95 text-slate-900 backdrop-blur-md border-none px-4 py-2 font-black shadow-lg">
                  £{hotel.pricePerNight} <span className="text-[10px] ml-1 opacity-60">/ NIGHT</span>
                </Badge>
                {hotel.isFeatured && (
                  <Badge className="bg-amber-500 text-white border-none px-4 py-2 font-black shadow-lg flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    FEATURED
                  </Badge>
                )}
              </div>

              <div className="absolute top-6 right-6">
                <div className="bg-slate-900/40 backdrop-blur-md rounded-xl p-2 px-3 flex items-center gap-2 border border-white/20">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-white font-bold">{hotel.starRating}</span>
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-white text-2xl font-black tracking-tight mb-1">
                  {hotel.name}
                </h2>
                <div className="flex items-center text-white/80 gap-2 text-sm font-medium">
                  <BsMap className="w-3.5 h-3.5" />
                  {hotel.city}, {hotel.country}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 flex flex-col flex-grow">
              <p className="text-slate-500 font-medium mb-8 line-clamp-2 italic">
                "{hotel.description}"
              </p>

              <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <Building2 className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Category</p>
                    <p className="text-sm font-bold text-slate-700">{Array.isArray(hotel.type) ? hotel.type[0] : hotel.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <Users className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Capacity</p>
                    <p className="text-sm font-bold text-slate-700">{hotel.adultCount}A, {hotel.childCount}C</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <Calendar className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Total Bookings</p>
                    <p className="text-sm font-bold text-slate-700">{hotel.totalBookings || 0} Stays</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <TrendingUp className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Revenue</p>
                    <p className="text-sm font-bold text-slate-700">£{(hotel.totalRevenue || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-auto pt-4 flex flex-wrap gap-3">
                <Link
                  to={`/edit-hotel/${hotel._id}`}
                  className="flex-1 min-w-[120px] bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  onClick={() => handleOpenBookingLog(hotel._id, hotel.name)}
                  className="flex-1 min-w-[120px] bg-emerald-50 text-emerald-600 py-4 rounded-2xl font-bold hover:bg-emerald-100 transition-all flex items-center justify-center gap-2 border border-emerald-100"
                >
                  <Calendar className="w-4 h-4" />
                  Logs
                </button>
                <button
                  onClick={() => handleOpenReviews(hotel._id, hotel.name)}
                  className="flex-1 min-w-[120px] bg-amber-50 text-amber-600 py-4 rounded-2xl font-bold hover:bg-amber-100 transition-all flex items-center justify-center gap-2 border border-amber-100"
                >
                  <MessageSquareCode className="w-4 h-4" />
                  Reviews
                </button>
                <Link
                  to={`/detail/${hotel._id}`}
                  className="w-14 h-14 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center border border-slate-100"
                >
                  <Eye className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Log Modal */}
      {selectedHotel && (
        <BookingLogModal
          isOpen={isBookingLogOpen}
          onClose={handleCloseBookingLog}
          hotelId={selectedHotel.id}
          hotelName={selectedHotel.name}
        />
      )}

      {/* Review Modal */}
      {selectedHotel && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={handleCloseReviews}
          hotelId={selectedHotel.id}
          hotelName={selectedHotel.name}
        />
      )}
    </div>
  );
};

export default MyHotels;
