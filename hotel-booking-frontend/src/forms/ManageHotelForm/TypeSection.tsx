import { useFormContext } from "react-hook-form";
import { hotelTypes } from "../../config/hotel-options-config";
import { HotelFormData } from "./ManageHotelForm";
import { Badge } from "../../components/ui/badge";
import { Sparkles, Layers } from "lucide-react";
import { Label } from "../../components/ui/label";

const TypeSection = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  const rawType = watch("type") as string | string[] | undefined;
  const typeWatch: string[] = Array.isArray(rawType)
    ? rawType.filter((t): t is string => typeof t === "string")
    : typeof rawType === "string"
      ? (rawType && rawType.length > 0
        ? [rawType]
        : [])
      : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Label className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary-600" />
          Hotel Type
        </Label>
        <p className="text-slate-500 font-medium">
          What category best describes your property? You can select multiple if applicable.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {hotelTypes.map((type) => (
          <label
            key={type}
            className={`
              relative cursor-pointer px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 transform active:scale-95
              ${typeWatch.includes(type)
                ? "bg-primary-600 text-white shadow-lg shadow-primary-200 ring-2 ring-primary-500 ring-offset-2"
                : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:border-slate-300"
              }
            `}
          >
            <input
              type="checkbox"
              value={type}
              checked={typeWatch.includes(type)}
              {...register("type", { required: "Please select at least one type" })}
              onChange={(e) => {
                const checked = e.target.checked;
                let newTypes = Array.isArray(typeWatch) ? [...typeWatch] : [];
                if (checked) {
                  if (!newTypes.includes(type)) newTypes.push(type);
                } else {
                  newTypes = newTypes.filter((t) => t !== type);
                }
                setValue("type", newTypes, { shouldValidate: true });
              }}
              className="hidden"
            />
            <span className="relative z-10">{type}</span>
          </label>
        ))}
      </div>

      {errors.type && (
        <div className="flex items-center mt-2">
          <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50 py-1 px-3">
            <Sparkles className="w-4 h-4 mr-2" />
            {errors.type.message}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default TypeSection;
