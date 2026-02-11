import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import useAppContext from "../hooks/useAppContext";
import * as apiClient from "../api-client";

const AddHotel = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
    onSuccess: () => {
      showToast({
        title: "Hotel Added Successfully",
        description:
          "Your hotel has been added to the platform! Redirecting to your dashboard...",
        type: "SUCCESS",
      });
      // Redirect to My Hotels page after successful save
      setTimeout(() => {
        navigate("/my-hotels");
      }, 1500);
    },
    onError: () => {
      showToast({
        title: "Failed to Add Hotel",
        description: "There was an error saving your property. Please check your information and try again.",
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
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-400/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                List Your Property
              </h1>
              <p className="text-primary-10/90 text-lg md:text-xl font-medium max-w-xl">
                Join thousands of hotel owners and start earning today. Fill out the details below to publish your hotel.
              </p>
            </div>

            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="font-bold">Listing Intelligence</span>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-2 text-sm font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-200 mt-1.5"></div>
                    <span>Rich descriptions boost reach</span>
                  </div>
                  <div className="flex gap-2 text-sm font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-200 mt-1.5"></div>
                    <span>Quality photos increase bookings by 24%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4">
        <ManageHotelForm onSave={handleSave} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default AddHotel;
