import { useForm } from "react-hook-form";
import { UserType } from "../../../shared/types";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import useAppContext from "../hooks/useAppContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
    Building2,
    Briefcase,
    ShieldCheck,
    Calendar,
    Mail,
    Phone
} from "lucide-react";

interface Props {
    user: UserType;
}

const OwnerProfile = ({ user }: Props) => {
    const { showToast } = useAppContext();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
    } = useForm<UserType>({
        defaultValues: user,
    });

    const mutation = useMutation(apiClient.updateCurrentUser, {
        onSuccess: () => {
            showToast({ title: "Business profile updated!", type: "SUCCESS" });
            queryClient.invalidateQueries("fetchCurrentUser");
        },
        onError: (error: Error) => {
            showToast({ title: error.message, type: "ERROR" });
        },
    });

    const onSubmit = handleSubmit((data) => {
        mutation.mutate(data);
    });

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header / Brand Identity Section - Luxury Orange/Amber */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-luxury-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-400/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-24 h-full bg-gradient-to-r from-amber-500/10 to-transparent"></div>

                <div className="relative flex flex-col gap-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-3xl font-serif italic shadow-lg shadow-orange-500/30 transition-transform group-hover:scale-105 duration-500">
                                {user.firstName[0]}
                            </div>
                            <div className="space-y-1 text-center md:text-left">
                                <div className="flex flex-col md:flex-row items-center gap-3">
                                    <h1 className="text-3xl md:text-4xl font-bold font-serif italic tracking-tight">{user.firstName} {user.lastName}</h1>
                                    <span className="bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5 whitespace-nowrap">
                                        <ShieldCheck className="w-3.5 h-3.5" /> Certified Partner
                                    </span>
                                </div>
                                <p className="text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2 text-sm">
                                    <Briefcase className="w-4 h-4 text-orange-400" /> Hotel Owner & Master Curator
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="glassmorphism bg-white/5 rounded-3xl p-6 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors">
                            <div>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Portfolio</p>
                                <p className="text-xl font-serif italic">{Math.max(1, Math.floor((user.totalBookings || 0) / 3))} Palaces</p>
                            </div>
                            <Building2 className="w-8 h-8 text-orange-400/50" />
                        </div>
                        <div className="glassmorphism bg-white/5 rounded-3xl p-6 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors">
                            <div>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Status</p>
                                <p className="text-xl font-serif italic">Elite Partner</p>
                            </div>
                            <ShieldCheck className="w-8 h-8 text-emerald-400/50" />
                        </div>
                        <div className="glassmorphism bg-white/5 rounded-3xl p-6 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors">
                            <div>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Established</p>
                                <p className="text-xl font-serif italic">{new Date(user.createdAt || "").getFullYear()}</p>
                            </div>
                            <Calendar className="w-8 h-8 text-amber-400/50" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Profile Settings */}
                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={onSubmit} className="bg-white rounded-[2.5rem] shadow-luxury border border-orange-100/50 overflow-hidden">
                        <div className="p-6 md:p-8 border-b border-orange-50 flex flex-col sm:flex-row items-center justify-between bg-slate-50/30 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-orange-100/50 p-2.5 rounded-xl text-orange-600">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 tracking-tight font-serif italic">Business Identity</h2>
                            </div>
                            <Button
                                type="submit"
                                disabled={mutation.isLoading}
                                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-10 font-bold shadow-lg shadow-slate-100 transition-all active:scale-95 py-6 sm:py-2"
                            >
                                {mutation.isLoading ? "Polishing Icons..." : "Save Business Identity"}
                            </Button>
                        </div>

                        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Legal First Name</Label>
                                <Input
                                    {...register("firstName", { required: "Name is required" })}
                                    className="rounded-2xl border-orange-100 focus:ring-amber-500/20 focus:border-amber-600 h-12 font-bold text-slate-700 bg-slate-50/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Legal Last Name</Label>
                                <Input
                                    {...register("lastName", { required: "Name is required" })}
                                    className="rounded-2xl border-orange-100 focus:ring-amber-500/20 focus:border-amber-600 h-12 font-bold text-slate-700 bg-slate-50/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Corporate Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        {...register("email")}
                                        disabled
                                        className="pl-11 rounded-2xl border-slate-100 bg-slate-50 text-slate-400 h-12 font-bold cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Direct Line</Label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
                                    <Input
                                        {...register("phone")}
                                        placeholder="+1 (555) 000-0000"
                                        className="pl-11 rounded-2xl border-orange-100 focus:ring-amber-500/20 focus:border-amber-600 h-12 font-bold text-slate-700 bg-slate-50/50"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 pt-8 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-px bg-orange-100 flex-1"></div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Base</span>
                                    <div className="h-px bg-orange-100 flex-1"></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Street Address</Label>
                                        <Input
                                            {...register("address.street")}
                                            className="rounded-2xl border-orange-100 h-12 font-bold text-slate-700 bg-slate-50/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">City</Label>
                                        <Input {...register("address.city")} className="rounded-2xl border-orange-100 h-12 font-bold text-slate-700 bg-slate-50/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Country</Label>
                                        <Input {...register("address.country")} className="rounded-2xl border-orange-100 h-12 font-bold text-slate-700 bg-slate-50/50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Sidebar Security & Business */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-luxury border border-orange-100/50 space-y-6">
                        <h3 className="text-xl font-bold font-serif italic text-slate-800 tracking-tight flex items-center justify-center gap-2 mb-4">
                            Account Safety
                        </h3>
                        <div className="pt-2 space-y-3">
                            <Button variant="outline" className="w-full rounded-2xl py-7 font-bold text-slate-600 border-orange-100 hover:bg-orange-50/30 transition-all">
                                Revise Access Password
                            </Button>
                            <Button variant="ghost" className="w-full rounded-2xl py-7 font-bold text-red-500/80 hover:text-red-600 hover:bg-red-50/50 transition-all">
                                Retire Partnership
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerProfile;
