import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import useAppContext from "../hooks/useAppContext";
import * as apiClient from "../api-client";

const AddHotel = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
    onSuccess: (newHotel) => {
      localStorage.removeItem("addHotelFormData");
      showToast({
        title: "Hotel Created",
        description: "Now, please pay the listing fee to request admin approval.",
        type: "SUCCESS",
      });
      // Start payment flow
      createOrderMutation.mutate(newHotel._id);
    },
    onError: (error: any) => {
      console.error("Failed to Add Hotel - Error Object:", error);
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        console.error("Error Response Status:", error.response.status);
      }
      showToast({
        title: "Failed to Add Hotel",
        description: error.response?.data?.message || "There was an error saving your property. Please check your information and try again.",
        type: "ERROR",
      });
    },
  });

  const createOrderMutation = useMutation(apiClient.createListingFeeOrder, {
    onSuccess: (order, hotelId) => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Nearly Palace",
        description: "Listing Fee Payment",
        order_id: order.id,
        handler: async (response: any) => {
          try {
            await verifyPaymentMutation.mutateAsync({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              hotelId: hotelId,
            });
            showToast({ title: "Listing fee paid successfully!", type: "SUCCESS" });
            navigate(`/detail/${hotelId}`);
          } catch (error) {
            showToast({ title: "Payment verification failed", type: "ERROR" });
            navigate("/my-hotels");
          }
        },
        theme: {
          color: "#f59e0b",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    },
    onError: (error: any) => {
      showToast({ title: error.message || "Failed to create payment order", type: "ERROR" });
      navigate("/my-hotels");
    },
  });

  const verifyPaymentMutation = useMutation(apiClient.verifyListingFee);

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
