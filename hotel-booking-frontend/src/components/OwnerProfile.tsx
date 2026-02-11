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
    Hotel,
    Calendar,
    Mail,
    Phone,
    Settings
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
            {/* Header / Brand Identity Section */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-600/20 to-transparent"></div>

                <div className="relative flex flex-col gap-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-black shadow-lg shadow-blue-500/30">
                                {user.firstName[0]}
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-black tracking-tight">{user.firstName} {user.lastName}</h1>
                                    <span className="bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-500/30 flex items-center gap-1.5">
                                        <ShieldCheck className="w-3.5 h-3.5" /> Certified Partner
                                    </span>
                                </div>
                                <p className="text-slate-400 font-medium flex items-center gap-2">
                                    <Briefcase className="w-4 h-4" /> Hotel Owner & Business Manager
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Managed Assets</p>
                                <p className="text-xl font-black">{Math.max(1, Math.floor((user.totalBookings || 0) / 3))} Properties</p>
                            </div>
                            <Hotel className="w-8 h-8 text-blue-400 opacity-50" />
                        </div>
                        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Account Status</p>
                                <p className="text-xl font-black">Active Partner</p>
                            </div>
                            <ShieldCheck className="w-8 h-8 text-emerald-400 opacity-50" />
                        </div>
                        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Partner Since</p>
                                <p className="text-xl font-black">{new Date(user.createdAt || "").getFullYear()}</p>
                            </div>
                            <Calendar className="w-8 h-8 text-purple-400 opacity-50" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Profile Settings */}
                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={onSubmit} className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-100 p-2.5 rounded-xl text-slate-600">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black text-slate-800 tracking-tight">Business Identity</h2>
                            </div>
                            <Button
                                type="submit"
                                disabled={mutation.isLoading}
                                className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-8 font-bold shadow-lg shadow-slate-200 transition-all active:scale-95"
                            >
                                {mutation.isLoading ? "Updating..." : "Save Business Info"}
                            </Button>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-black text-slate-400 uppercase tracking-wider">Legal First Name</Label>
                                <Input
                                    {...register("firstName", { required: "Name is required" })}
                                    className="rounded-xl border-slate-200 focus:ring-slate-900/5 focus:border-slate-900 h-12 font-bold text-slate-700"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-black text-slate-400 uppercase tracking-wider">Legal Last Name</Label>
                                <Input
                                    {...register("lastName", { required: "Name is required" })}
                                    className="rounded-xl border-slate-200 focus:ring-slate-900/5 focus:border-slate-900 h-12 font-bold text-slate-700"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-black text-slate-400 uppercase tracking-wider">Business Email (System)</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        {...register("email")}
                                        disabled
                                        className="pl-11 rounded-xl border-slate-200 bg-slate-50 text-slate-400 h-12 font-bold cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-black text-slate-400 uppercase tracking-wider">Direct Contact line</Label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        {...register("phone")}
                                        placeholder="+1 (555) 000-0000"
                                        className="pl-11 rounded-xl border-slate-200 focus:ring-slate-900/5 focus:border-slate-900 h-12 font-bold text-slate-700"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 pt-8 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-px bg-slate-100 flex-1"></div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Registered Address</span>
                                    <div className="h-px bg-slate-100 flex-1"></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-xs font-black text-slate-400 uppercase tracking-wider">Street Address</Label>
                                        <Input
                                            {...register("address.street")}
                                            className="rounded-xl border-slate-200 h-12 font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black text-slate-400 uppercase tracking-wider">City</Label>
                                        <Input {...register("address.city")} className="rounded-xl h-12 font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black text-slate-400 uppercase tracking-wider">Country</Label>
                                        <Input {...register("address.country")} className="rounded-xl h-12 font-bold" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Sidebar Security & Business */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 space-y-6">
                        <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                            <Settings className="w-5 h-5 text-slate-400" /> Account Security
                        </h3>
                        <div className="pt-2 space-y-3">
                            <Button variant="outline" className="w-full rounded-xl py-6 font-bold text-slate-600 border-slate-200 hover:bg-slate-50">
                                Change Business Password
                            </Button>
                            <Button variant="ghost" className="w-full rounded-xl py-6 font-bold text-red-500 hover:text-red-600 hover:bg-red-50">
                                Terminate Partnership
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerProfile;
