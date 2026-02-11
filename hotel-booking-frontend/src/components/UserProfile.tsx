import { useForm } from "react-hook-form";
import { UserType } from "../../../shared/types";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import useAppContext from "../hooks/useAppContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { User, Mail, Phone, MapPin, Calendar, ShieldCheck, Settings } from "lucide-react";

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
            {/* Hero Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>

                <div className="relative flex flex-col md:flex-row items-center gap-8">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center text-5xl font-black shadow-inner">
                        {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div className="text-center md:text-left space-y-2">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                            {user.firstName} {user.lastName}
                        </h1>
                        <p className="text-blue-100/80 font-medium flex items-center justify-center md:justify-start gap-2">
                            <Calendar className="w-4 h-4" />
                            Registered traveler since {new Date(user.createdAt || "").toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                            <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 flex items-center gap-2">
                                <ShieldCheck className="w-3.5 h-3.5" /> Platform Verified
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Personal Info Form */}
                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={onSubmit} className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2.5 rounded-xl">
                                    <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <h2 className="text-xl font-black text-slate-800 tracking-tight">Personal Information</h2>
                            </div>
                            <Button
                                type="submit"
                                disabled={mutation.isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
                            >
                                {mutation.isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">First Name</Label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        {...register("firstName", { required: "First name is required" })}
                                        className="pl-11 rounded-xl border-slate-200 focus:ring-blue-500/20 focus:border-blue-600 h-12 font-medium"
                                    />
                                </div>
                                {errors.firstName && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.firstName.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Last Name</Label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        {...register("lastName", { required: "Last name is required" })}
                                        className="pl-11 rounded-xl border-slate-200 focus:ring-blue-500/20 focus:border-blue-600 h-12 font-medium"
                                    />
                                </div>
                                {errors.lastName && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{errors.lastName.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        {...register("email")}
                                        disabled
                                        className="pl-11 rounded-xl border-slate-200 bg-slate-50 text-slate-500 h-12 font-medium cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 italic mt-1 ml-1">Email cannot be changed</p>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        {...register("phone")}
                                        placeholder="+1 (555) 000-0000"
                                        className="pl-11 rounded-xl border-slate-200 focus:ring-blue-500/20 focus:border-blue-600 h-12 font-medium"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-50 mt-4">
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-slate-400" /> Address Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 lg:col-span-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Street Address</Label>
                                        <Input
                                            {...register("address.street")}
                                            className="rounded-xl border-slate-200 focus:ring-blue-500/20 focus:border-blue-600 h-12 font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">City</Label>
                                        <Input
                                            {...register("address.city")}
                                            className="rounded-xl border-slate-200 focus:ring-blue-500/20 focus:border-blue-600 h-12 font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">State / Region</Label>
                                        <Input
                                            {...register("address.state")}
                                            className="rounded-xl border-slate-200 focus:ring-blue-500/20 focus:border-blue-600 h-12 font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Zip Code</Label>
                                        <Input
                                            {...register("address.zipCode")}
                                            className="rounded-xl border-slate-200 focus:ring-blue-500/20 focus:border-blue-600 h-12 font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Country</Label>
                                        <Input
                                            {...register("address.country")}
                                            className="rounded-xl border-slate-200 focus:ring-blue-500/20 focus:border-blue-600 h-12 font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Right Column: Sidebar Stats */}
                <div className="space-y-8">
                    <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                            <Settings className="w-24 h-24" />
                        </div>
                        <h3 className="text-lg font-black tracking-tight mb-6">Activity Summary</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Total Bookings</span>
                                <span className="text-2xl font-black">{user.totalBookings || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Platform Spent</span>
                                <span className="text-2xl font-black text-emerald-400">£{user.totalSpent?.toLocaleString() || "0.00"}</span>
                            </div>
                            <div className="h-0.5 bg-white/5 w-full"></div>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                                Booking history is locked to this account
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 flex flex-col gap-6">
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">Security</h3>
                        <Button variant="outline" className="w-full rounded-xl py-6 font-bold text-slate-600 border-slate-200 hover:bg-slate-50">
                            Change Account Password
                        </Button>
                        <Button variant="ghost" className="w-full rounded-xl py-6 font-bold text-red-500 hover:text-red-600 hover:bg-red-50">
                            Deactivate Profile
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
