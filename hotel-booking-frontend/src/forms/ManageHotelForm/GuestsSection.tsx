import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";
import { Users, Baby, Sparkles } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";

const GuestsSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Label className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Users className="w-5 h-5 text-primary-600" />
          Capacity
        </Label>
        <p className="text-slate-500 font-medium">
          Define the maximum number of guests your property can accommodate.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
        <div className="space-y-2">
          <Label className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary-600" />
            Adults
          </Label>
          <Input
            className="h-12 border-slate-200 focus:ring-primary-500 focus:border-primary-500 rounded-xl bg-white"
            type="number"
            min={1}
            {...register("adultCount", {
              required: "Adult count is required",
            })}
          />
          {errors.adultCount?.message && (
            <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
              <Sparkles className="w-4 h-4 mr-2" />
              {errors.adultCount?.message}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Baby className="w-4 h-4 text-primary-600" />
            Children
          </Label>
          <Input
            className="h-12 border-slate-200 focus:ring-primary-500 focus:border-primary-500 rounded-xl bg-white"
            type="number"
            min={0}
            {...register("childCount", {
              required: "Child count is required",
            })}
          />
          {errors.childCount?.message && (
            <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
              <Sparkles className="w-4 h-4 mr-2" />
              {errors.childCount?.message}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestsSection;
