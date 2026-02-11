import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";
import { Building, Globe, Coins, Star, FileText, MapPin } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";

const DetailsSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Hotel Details
        </h2>
        <p className="text-slate-500 font-medium">
          Start by giving your property a name and describing its unique charm.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hotel Name */}
        <div className="space-y-2 md:col-span-2">
          <Label className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Building className="w-4 h-4 text-primary-600" />
            Hotel Name
          </Label>
          <Input
            type="text"
            className="h-12 border-slate-200 focus:ring-primary-500 focus:border-primary-500 rounded-xl"
            placeholder="e.g. Grand Plaza Resort"
            {...register("name", { required: "Hotel name is required" })}
          />
          {errors.name && (
            <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
              {errors.name.message}
            </Badge>
          )}
        </div>

        {/* City and Country */}
        <div className="space-y-2">
          <Label className="text-base font-bold text-slate-800 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary-600" />
            City
          </Label>
          <Input
            type="text"
            className="h-12 border-slate-200 focus:ring-primary-500 focus:border-primary-500 rounded-xl"
            placeholder="e.g. London"
            {...register("city", { required: "City is required" })}
          />
          {errors.city && (
            <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
              {errors.city.message}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary-600" />
            Country
          </Label>
          <Input
            type="text"
            className="h-12 border-slate-200 focus:ring-primary-500 focus:border-primary-500 rounded-xl"
            placeholder="e.g. United Kingdom"
            {...register("country", { required: "Country is required" })}
          />
          {errors.country && (
            <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
              {errors.country.message}
            </Badge>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <Label className="text-base font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary-600" />
            Description
          </Label>
          <textarea
            rows={6}
            className="w-full p-4 border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 rounded-2xl font-normal transition-all"
            placeholder="Tell us about your hotel..."
            {...register("description", { required: "Description is required" })}
          ></textarea>
          {errors.description && (
            <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
              {errors.description.message}
            </Badge>
          )}
        </div>

        {/* Price and Rating */}
        <div className="space-y-2">
          <Label className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Coins className="w-4 h-4 text-primary-600" />
            Price Per Night (£)
          </Label>
          <Input
            type="number"
            min={1}
            className="h-12 border-slate-200 focus:ring-primary-500 focus:border-primary-500 rounded-xl"
            {...register("pricePerNight", { required: "Price is required" })}
          />
          {errors.pricePerNight && (
            <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
              {errors.pricePerNight.message}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Star className="w-4 h-4 text-primary-600" />
            Star Rating
          </Label>
          <select
            {...register("starRating", { required: "Rating is required" })}
            className="w-full h-12 px-4 border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 rounded-xl font-normal bg-white appearance-none cursor-pointer"
          >
            <option value="">Select Rating</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>{num} {num === 1 ? 'Star' : 'Stars'}</option>
            ))}
          </select>
          {errors.starRating && (
            <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
              {errors.starRating.message}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsSection;
