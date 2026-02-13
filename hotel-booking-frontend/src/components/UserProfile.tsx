import { useForm } from "react-hook-form";
import { UserType } from "../../../shared/types";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import useAppContext from "../hooks/useAppContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
    User,
    Mail,
    Phone,
    Calendar,
    ShieldCheck,
    Settings
} from "lucide-react";

interface Props {
    user: UserType;
}

const UserProfile = ({ user }: Props) => {
    const { showToast } = useAppContext();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserType>({
        defaultValues: user,
    });

    const mutation = useMutation(apiClient.updateCurrentUser, {
        onSuccess: () => {
            showToast({ title: "Profile updated successfully!", type: "SUCCESS" });
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
            {/* Hero Header - Luxury Orange/Amber Gradient */}
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-400 via-amber-500 to-orange-600 rounded-[2.5rem] p-8 md:p-12 text-white shadow-luxury-lg">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl"></div>

                <div className="relative flex flex-col md:flex-row items-center gap-8">
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white/40 bg-white/10 backdrop-blur-md flex items-center justify-center text-4xl font-serif italic shadow-inner">
                        {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div className="text-center md:text-left space-y-2">
                        <h1 className="text-3xl md:text-5xl font-bold font-serif italic tracking-tight">
                            {user.firstName} {user.lastName}
                        </h1>
                        <p className="text-amber-50/90 font-medium flex items-center justify-center md:justify-start gap-2 text-sm md:text-base">
                            <Calendar className="w-4 h-4" />
                            Registered traveler since {new Date(user.createdAt || "").toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                            <span className="glassmorphism bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20 flex items-center gap-2">
                                <ShieldCheck className="w-3.5 h-3.5" /> Platform Verified
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Personal Info Form */}
                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={onSubmit} className="bg-white rounded-[2.5rem] shadow-luxury border border-orange-100/50 overflow-hidden">
                        <div className="p-6 md:p-8 border-b border-orange-50 flex flex-col sm:flex-row items-center justify-between bg-slate-50/30 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-amber-100/50 p-2.5 rounded-xl text-amber-600">
                                    <User className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 tracking-tight font-serif italic">Personal Information</h2>
                            </div>
                            <Button
                                type="submit"
                                disabled={mutation.isLoading}
                                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl px-10 font-bold shadow-lg shadow-orange-100 transition-all active:scale-95 py-6 sm:py-2"
                            >
                                {mutation.isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>

                        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">First Name</Label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                                    <Input
                                        {...register("firstName", { required: "First name is required" })}
                                        className="pl-11 rounded-2xl border-orange-100 focus:ring-amber-500/20 focus:border-amber-600 h-12 font-medium bg-slate-50/50"
                                    />
                                </div>
                                {errors.firstName && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.firstName.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Last Name</Label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                                    <Input
                                        {...register("lastName", { required: "Last name is required" })}
                                        className="pl-11 rounded-2xl border-orange-100 focus:ring-amber-500/20 focus:border-amber-600 h-12 font-medium bg-slate-50/50"
                                    />
                                </div>
                                {errors.lastName && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.lastName.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        {...register("email")}
                                        disabled
                                        className="pl-11 rounded-2xl border-slate-100 bg-slate-50 text-slate-400 h-12 font-medium cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                                    <Input
                                        {...register("phone")}
                                        placeholder="+1 (555) 000-0000"
                                        className="pl-11 rounded-2xl border-orange-100 focus:ring-amber-500/20 focus:border-amber-600 h-12 font-medium bg-slate-50/50"
                                    />
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="md:col-span-2 space-y-6 pt-6 border-t border-orange-50 mt-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-px bg-orange-100 flex-1"></div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Residence Details</span>
                                    <div className="h-px bg-orange-100 flex-1"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Street Address</Label>
                                        <Input
                                            {...register("address.street")}
                                            className="rounded-2xl border-orange-100 h-12 font-medium bg-slate-50/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">City</Label>
                                        <Input
                                            {...register("address.city")}
                                            className="rounded-2xl border-orange-100 h-12 font-medium bg-slate-50/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">State / Region</Label>
                                        <Input
                                            {...register("address.state")}
                                            className="rounded-2xl border-orange-100 h-12 font-medium bg-slate-50/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Zip Code</Label>
                                        <Input
                                            {...register("address.zipCode")}
                                            className="rounded-2xl border-orange-100 h-12 font-medium bg-slate-50/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Country</Label>
                                        <Input
                                            {...register("address.country")}
                                            className="rounded-2xl border-orange-100 h-12 font-medium bg-slate-50/50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Right Column: Activity Glassmorphism */}
                <div className="space-y-8">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-luxury relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                            <Settings className="w-24 h-24" />
                        </div>
                        <h3 className="text-xl font-bold font-serif italic tracking-tight mb-8">Palace Activity</h3>
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Reserved Stays</span>
                                <span className="text-3xl font-serif italic text-amber-400">{user.totalBookings || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Premier Investment</span>
                                <span className="text-3xl font-serif italic text-orange-400">£{user.totalSpent?.toLocaleString() || "0.00"}</span>
                            </div>
                            <div className="h-px bg-white/10 w-full"></div>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-[0.2em] leading-relaxed italic">
                                Your journey through our palaces is immortalized here.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 shadow-luxury border border-orange-100/50 flex flex-col gap-6">
                        <h3 className="text-lg font-bold font-serif italic text-slate-800 tracking-tight text-center">Security & Access</h3>
                        <Button variant="outline" className="w-full rounded-2xl py-7 font-bold text-slate-600 border-orange-100 hover:bg-orange-50/30 transition-all">
                            Revise Access Password
                        </Button>
                        <Button variant="ghost" className="w-full rounded-2xl py-7 font-bold text-red-500/80 hover:text-red-600 hover:bg-red-50/50 transition-all">
                            Retire Profile
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
