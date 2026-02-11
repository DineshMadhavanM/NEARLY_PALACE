import { useQuery, useMutation } from "react-query";
import * as apiClient from "../api-client";
import useSearchContext from "../hooks/useSearchContext";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import useAppContext from "../hooks/useAppContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Loader2, Send, Calendar, Users, User, Phone, MessageSquare } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const Booking = () => {
  const { showToast } = useAppContext();
  const search = useSearchContext();
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const [numberOfNights, setNumberOfNights] = useState<number>(0);
  const [phone, setPhone] = useState<string>("");
  const [specialRequests, setSpecialRequests] = useState<string>("");

  useEffect(() => {
    if (search.checkIn && search.checkOut) {
      const nights =
        Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
        (1000 * 60 * 60 * 24);

      setNumberOfNights(Math.ceil(nights));
    }
  }, [search.checkIn, search.checkOut]);

  const { data: hotel, isLoading: isLoadingHotel } = useQuery(
    "fetchHotelByID",
    () => apiClient.fetchHotelById(hotelId as string),
    {
      enabled: !!hotelId,
    }
  );

  const { data: currentUser, isLoading: isLoadingUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser
  );

  const sendBookingRequestMutation = useMutation(
    apiClient.sendBookingNotification,
    {
      onSuccess: () => {
        showToast({
          title: "Booking Request Sent!",
          description: "Your booking request has been sent to the hotel owner. They will contact you shortly.",
          type: "SUCCESS",
        });
        setTimeout(() => {
          navigate("/");
        }, 2000);
      },
      onError: () => {
        showToast({
          title: "Request Failed",
          description: "Failed to send booking request. Please try again.",
          type: "ERROR",
        });
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hotel || !currentUser) return;

    const totalCost = hotel.pricePerNight * numberOfNights;

    sendBookingRequestMutation.mutate({
      hotelOwnerId: hotel.userId,
      hotelName: hotel.name,
      guestName: `${currentUser.firstName} ${currentUser.lastName}`,
      guestEmail: currentUser.email,
      checkIn: search.checkIn.toLocaleDateString(),
      checkOut: search.checkOut.toLocaleDateString(),
      totalCost,
      phone,
      specialRequests,
    });
  };

  if (isLoadingHotel || isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-700">
            Loading booking details...
          </span>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Hotel Not Found
          </h2>
          <p className="text-gray-600">
            The hotel you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const totalCost = hotel.pricePerNight * numberOfNights;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Send className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Send Booking Request
            </h1>
          </div>
          <p className="text-gray-600">
            Fill in your details and send a booking request to the hotel owner.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
          {/* Booking Summary */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BookingDetailsSummary
                  checkIn={search.checkIn}
                  checkOut={search.checkOut}
                  adultCount={search.adultCount}
                  childCount={search.childCount}
                  numberOfNights={numberOfNights}
                  hotel={hotel}
                />
              </CardContent>
            </Card>

            {/* Hotel Info Card */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Users className="h-5 w-5 text-blue-600" />
                  Hotel Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {hotel.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {hotel.city}, {hotel.country}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      {hotel.starRating} Stars
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      £{hotel.pricePerNight}/night
                    </Badge>
                  </div>
                  {hotel.type && hotel.type.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {hotel.type.map((type, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Price Summary */}
            <Card className="shadow-lg border-0 bg-white">
              <CardContent className="pt-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">Estimated Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      £{totalCost.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {numberOfNights} night{numberOfNights > 1 ? 's' : ''} × £{hotel.pricePerNight}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Request Form */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                  <User className="h-6 w-6 text-blue-600" />
                  Your Details
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Please provide your contact information
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          First Name
                        </Label>
                        <Input
                          type="text"
                          readOnly
                          disabled
                          className="bg-gray-50 text-gray-600"
                          value={currentUser?.firstName || ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Last Name
                        </Label>
                        <Input
                          type="text"
                          readOnly
                          disabled
                          className="bg-gray-50 text-gray-600"
                          value={currentUser?.lastName || ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Email
                        </Label>
                        <Input
                          type="email"
                          readOnly
                          disabled
                          className="bg-gray-50 text-gray-600"
                          value={currentUser?.email || ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone Number *
                        </Label>
                        <Input
                          type="tel"
                          placeholder="Enter your phone number"
                          className="focus:ring-2 focus:ring-blue-500"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      Special Requests (Optional)
                    </h3>

                    <div className="space-y-2">
                      <textarea
                        rows={4}
                        placeholder="Any special requests, preferences, or additional information..."
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        Let the hotel owner know if you have any special requirements or preferences.
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      disabled={sendBookingRequestMutation.isLoading}
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sendBookingRequestMutation.isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Sending Request...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Send Booking Request
                        </div>
                      )}
                    </Button>
                  </div>
                </form>

                {/* Info Note */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Your booking request will be sent directly to the hotel owner.
                      They will review your request and contact you via email or phone to confirm the booking and discuss payment options.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
