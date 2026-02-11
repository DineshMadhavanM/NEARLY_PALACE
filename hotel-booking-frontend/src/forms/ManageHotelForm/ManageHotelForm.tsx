import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";
import ContactSection from "./ContactSection";
import PoliciesSection from "./PoliciesSection";
import { HotelType } from "../../../../shared/types";
import { useEffect } from "react";

export type HotelFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string[];
  pricePerNight: number;
  starRating: number;
  facilities: string[];
  imageFiles?: File[];
  imageUrls: string[];
  adultCount: number;
  childCount: number;
  // New fields
  contact?: {
    phone: string;
    email: string;
    website: string;
  };
  policies?: {
    checkInTime: string;
    checkOutTime: string;
    cancellationPolicy: string;
    petPolicy: string;
    smokingPolicy: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
  };
  isFeatured: boolean;
};

type Props = {
  hotel?: HotelType;
  onSave: (hotelFormData: FormData) => void;
  isLoading: boolean;
  showImages?: boolean;
};

const ManageHotelForm = ({ onSave, isLoading, hotel, showImages = true }: Props) => {
  const formMethods = useForm<HotelFormData>();
  const { handleSubmit, reset } = formMethods;

  useEffect(() => {
    if (hotel) {
      // Ensure contact and policies are properly initialized
      const formData = {
        ...hotel,
        contact: hotel.contact || {
          phone: "",
          email: "",
          website: "",
        },
        policies: hotel.policies || {
          checkInTime: "",
          checkOutTime: "",
          cancellationPolicy: "",
          petPolicy: "",
          smokingPolicy: "",
        },
      };
      reset(formData);
    }
  }, [hotel, reset]);

  const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
    const formData = new FormData();
    if (hotel) {
      formData.append("hotelId", hotel._id);
    }
    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formDataJson.type.forEach((t) => {
      formData.append("type", t);
    });
    formData.append("pricePerNight", formDataJson.pricePerNight.toString());
    formData.append("starRating", formDataJson.starRating.toString());
    formData.append("adultCount", formDataJson.adultCount.toString());
    formData.append("childCount", formDataJson.childCount.toString());

    formDataJson.facilities.forEach((facility) => {
      formData.append("facilities", facility);
    });

    // Add contact information
    if (formDataJson.contact) {
      formData.append("contact.phone", formDataJson.contact.phone || "");
      formData.append("contact.email", formDataJson.contact.email || "");
      formData.append("contact.website", formDataJson.contact.website || "");
    }

    // Add policies
    if (formDataJson.policies) {
      formData.append(
        "policies.checkInTime",
        formDataJson.policies.checkInTime || ""
      );
      formData.append(
        "policies.checkOutTime",
        formDataJson.policies.checkOutTime || ""
      );
      formData.append(
        "policies.cancellationPolicy",
        formDataJson.policies.cancellationPolicy || ""
      );
      formData.append(
        "policies.petPolicy",
        formDataJson.policies.petPolicy || ""
      );
      formData.append(
        "policies.smokingPolicy",
        formDataJson.policies.smokingPolicy || ""
      );
    }

    if (formDataJson.imageUrls) {
      formDataJson.imageUrls.forEach((url) => {
        formData.append("imageUrls", url);
      });
    }

    if (formDataJson.imageFiles && formDataJson.imageFiles.length > 0) {
      formDataJson.imageFiles.forEach((imageFile) => {
        formData.append(`imageFiles`, imageFile);
      });
    }

    onSave(formData);
  });

  return (
    <FormProvider {...formMethods}>
      <form className="max-w-5xl mx-auto space-y-12 pb-20" onSubmit={onSubmit}>
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          {/* Header Gradient */}
          <div className="h-3 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700"></div>

          <div className="p-8 md:p-12 space-y-16">
            <DetailsSection />
            <div className="h-px bg-slate-100 w-full"></div>

            <TypeSection />
            <div className="h-px bg-slate-100 w-full"></div>

            <FacilitiesSection />
            <div className="h-px bg-slate-100 w-full"></div>

            <GuestsSection />
            <div className="h-px bg-slate-100 w-full"></div>

            <ContactSection />
            <div className="h-px bg-slate-100 w-full"></div>

            <PoliciesSection />
            {showImages && (
              <>
                <div className="h-px bg-slate-100 w-full"></div>
                <ImagesSection />
              </>
            )}
          </div>

          {/* Form Footer */}
          <div className="bg-slate-50 px-8 md:px-12 py-8 flex justify-end items-center border-t border-slate-100">
            <button
              disabled={isLoading}
              type="submit"
              className="bg-primary-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:bg-slate-400 disabled:cursor-not-allowed shadow-lg flex items-center gap-3 text-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving Hotel...
                </>
              ) : (
                <>
                  {hotel ? "Update Hotel Listing" : "Create Hotel Listing"}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default ManageHotelForm;
