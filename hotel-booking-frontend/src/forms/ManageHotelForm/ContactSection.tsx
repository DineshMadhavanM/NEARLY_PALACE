import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";
import { Phone, Mail, Globe, Contact } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

const ContactSection = () => {
  const { register } = useFormContext<HotelFormData>();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Label className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Contact className="w-5 h-5 text-primary-600" />
          Contact Information
        </Label>
        <p className="text-slate-500 font-medium">
          How can guests and our support team reach you?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary-600" />
            Phone
          </Label>
          <Input
            type="text"
            className="h-12 border-slate-200 focus:ring-primary-500 focus:border-primary-500 rounded-xl"
            placeholder="+1 234 567 890"
            {...register("contact.phone")}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary-600" />
            Email
          </Label>
          <Input
            type="email"
            className="h-12 border-slate-200 focus:ring-primary-500 focus:border-primary-500 rounded-xl"
            placeholder="hotel@example.com"
            {...register("contact.email")}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary-600" />
            Website
          </Label>
          <Input
            type="url"
            className="h-12 border-slate-200 focus:ring-primary-500 focus:border-primary-500 rounded-xl"
            placeholder="https://www.example.com"
            {...register("contact.website")}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
