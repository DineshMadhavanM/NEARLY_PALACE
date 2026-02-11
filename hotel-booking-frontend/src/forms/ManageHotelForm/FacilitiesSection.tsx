import { useFormContext } from "react-hook-form";
import { hotelFacilities } from "../../config/hotel-options-config";
import { HotelFormData } from "./ManageHotelForm";
import { CheckCircle2, Sparkles, Wifi } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";

const FacilitiesSection = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<HotelFormData>();

  const facilitiesWatch = watch("facilities") || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Label className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Wifi className="w-5 h-5 text-primary-600" />
          Amenities & Facilities
        </Label>
        <p className="text-slate-500 font-medium">
          Select all the amenities you provide to help guests find exactly what they need.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {hotelFacilities.map((facility) => (
          <label
            key={facility}
            className={`
              group flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300
              ${facilitiesWatch.includes(facility)
                ? "border-primary-500 bg-primary-50 ring-4 ring-primary-50 shadow-md"
                : "border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white"
              }
            `}
          >
            <div className={`
              w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300
              ${facilitiesWatch.includes(facility)
                ? "bg-primary-600 border-primary-600"
                : "bg-white border-slate-300 group-hover:border-slate-400"
              }
            `}>
              {facilitiesWatch.includes(facility) && (
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              )}
            </div>

            <input
              type="checkbox"
              value={facility}
              className="hidden"
              {...register("facilities", {
                validate: (facilities) => {
                  if (facilities && facilities.length > 0) {
                    return true;
                  } else {
                    return "At least one facility is required";
                  }
                },
              })}
            />
            <span className={`text-sm font-bold transition-colors ${facilitiesWatch.includes(facility) ? "text-primary-900" : "text-slate-600"
              }`}>
              {facility}
            </span>
          </label>
        ))}
      </div>

      {errors.facilities && (
        <div className="flex items-center mt-2">
          <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50 py-1 px-3">
            <Sparkles className="w-4 h-4 mr-2" />
            {errors.facilities.message}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default FacilitiesSection;
