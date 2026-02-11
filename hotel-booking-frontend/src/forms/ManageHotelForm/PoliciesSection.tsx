import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";
import { Clock, ShieldCheck, Dog, Cigarette, ClipboardCheck } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

const PoliciesSection = () => {
  const { register } = useFormContext<HotelFormData>();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Label className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-primary-600" />
          Hotel Policies
        </Label>
        <p className="text-slate-500 font-medium">
          Set the rules for stays at your property to manage guest expectations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
        <div className="space-y-2">
          <Label className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary-600" />
            Check-in Time
          </Label>
          <Input
            type="text"
            placeholder="e.g. After 2:00 PM"
            className="h-12 border-slate-200 focus:ring-primary-500 focus:border-primary-500 rounded-xl bg-white"
            {...register("policies.checkInTime")}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary-600" />
            Check-out Time
          </Label>
          <Input
            type="text"
            placeholder="e.g. Before 11:00 AM"
            className="h-12 border-slate-200 focus:ring-primary-500 focus:border-primary-500 rounded-xl bg-white"
            {...register("policies.checkOutTime")}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-base font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary-600" />
            Cancellation Policy
          </Label>
          <textarea
            placeholder="e.g. Free cancellation up to 24 hours before arrival"
            className="w-full p-4 border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 rounded-2xl font-normal bg-white transition-all"
            rows={3}
            {...register("policies.cancellationPolicy")}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Dog className="w-4 h-4 text-primary-600" />
            Pet Policy
          </Label>
          <textarea
            placeholder="e.g. Pets are welcome with a small additional fee"
            className="w-full p-4 border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 rounded-2xl font-normal bg-white transition-all"
            rows={3}
            {...register("policies.petPolicy")}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Cigarette className="w-4 h-4 text-primary-600" />
            Smoking Policy
          </Label>
          <textarea
            placeholder="e.g. Non-smoking property throughout"
            className="w-full p-4 border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 rounded-2xl font-normal bg-white transition-all"
            rows={3}
            {...register("policies.smokingPolicy")}
          />
        </div>
      </div>
    </div>
  );
};

export default PoliciesSection;
