import { useMutation, useQuery } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import * as apiClient from "../api-client";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import useAppContext from "../hooks/useAppContext";

const EditHotel = () => {
  const { hotelId } = useParams();
  const { showToast } = useAppContext();
  const navigate = useNavigate();

  const { data: hotel } = useQuery(
    "fetchMyHotelById",
    () => apiClient.fetchMyHotelById(hotelId || ""),
    {
      enabled: !!hotelId,
    }
  );

  const { mutate, isLoading } = useMutation(apiClient.updateMyHotelById, {
    onSuccess: () => {
      showToast({
        title: "Hotel Updated Successfully",
        description:
          "Your changes have been saved! Redirecting to your dashboard...",
        type: "SUCCESS",
      });
      // Redirect to My Hotels page after successful update
      setTimeout(() => {
        navigate("/my-hotels");
      }, 1500);
    },
    onError: () => {
      showToast({
        title: "Failed to Update Hotel",
        description:
          "There was an error updating your property. Please try again.",
        type: "ERROR",
      });
    },
  });

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 -mt-10 pt-10">
      <div className="max-w-5xl mx-auto px-4 mb-12">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>

          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Edit Hotel Listing
            </h1>
            <p className="text-indigo-10/90 text-lg md:text-xl font-medium max-w-xl">
              Updating {hotel?.name || "your property"}? Keep your information current to maintain your high booking rate.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4">
        <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default EditHotel;
