import { useQuery, useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import {
    Users,
    Building2,
    ShieldAlert,
    Trash2,
    Mail,
    Calendar,
    Search,
    CheckCircle2,
    TrendingUp,
    CreditCard,
    MapPin,
    Hotel,
    Filter,
    XCircle,
    AlertCircle,
    MoreVertical,
    UserCog
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import LoadingSpinner from "../components/LoadingSpinner";
import { Badge } from "../components/ui/badge";
import { useState, useMemo, useEffect } from "react";
import { UserType, HotelType } from "../../../shared/types";
import useAppContext from "../hooks/useAppContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const Admin = () => {
    const { showToast } = useAppContext();
    const queryClient = useQueryClient();

    // Core Queries
    const { data: users, isLoading: usersLoading } = useQuery("fetchAdminUsers", apiClient.fetchAdminUsers);
    const { data: hotels, isLoading: hotelsLoading } = useQuery("fetchAdminHotels", apiClient.fetchAdminHotels);
    const { data: stats, isLoading: statsLoading } = useQuery("fetchAdminStats", apiClient.fetchAdminStats);

    // Mutations
    const deleteUserMutation = useMutation(apiClient.deleteAdminUser, {
        onSuccess: () => {
            queryClient.invalidateQueries("fetchAdminUsers");
            queryClient.invalidateQueries("fetchAdminStats");
            showToast({ title: "User deleted successfully", type: "SUCCESS" });
        },
        onError: (err: any) => showToast({ title: err.message, type: "ERROR" })
    });

    const deleteHotelMutation = useMutation(apiClient.deleteAdminHotel, {
        onSuccess: () => {
            queryClient.invalidateQueries("fetchAdminHotels");
            queryClient.invalidateQueries("fetchAdminStats");
            showToast({ title: "Hotel deleted successfully", type: "SUCCESS" });
        },
        onError: (err: any) => showToast({ title: err.message, type: "ERROR" })
    });

    const updateRoleMutation = useMutation(
        ({ userId, role }: { userId: string, role: string }) => apiClient.updateAdminUserRole(userId, role),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("fetchAdminUsers");
                showToast({ title: "User role updated", type: "SUCCESS" });
            },
            onError: (err: any) => showToast({ title: err.message, type: "ERROR" })
        }
    );

    const [userSearch, setUserSearch] = useState("");
    const [hName, setHName] = useState("");
    const [hPlace, setHPlace] = useState("");
    const [hPrice, setHPrice] = useState("");

    const filteredUsers = useMemo(() => {
        return users?.filter(user =>
            user.firstName.toLowerCase().includes(userSearch.toLowerCase()) ||
            user.lastName.toLowerCase().includes(userSearch.toLowerCase()) ||
            user.email.toLowerCase().includes(userSearch.toLowerCase())
        );
    }, [users, userSearch]);

    const filteredHotels = useMemo(() => {
        return hotels?.filter(hotel => {
            const matchesName = hotel.name.toLowerCase().includes(hName.toLowerCase());
            const matchesPlace = (hotel.city + hotel.country).toLowerCase().includes(hPlace.toLowerCase());
            const matchesPrice = hPrice === "" || hotel.pricePerNight <= parseInt(hPrice);
            return matchesName && matchesPlace && matchesPrice;
        });
    }, [hotels, hName, hPlace, hPrice]);

    // Popup logic for "not found"
    useEffect(() => {
        const isSearching = hName.trim() !== "" || hPlace.trim() !== "" || hPrice.trim() !== "";
        if (isSearching && filteredHotels && filteredHotels.length === 0) {
            const timeoutId = setTimeout(() => {
                showToast({
                    title: "Hotel Not Found",
                    description: "No hotels match your specific search criteria.",
                    type: "ERROR"
                });
            }, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [filteredHotels, hName, hPlace, hPrice, showToast]);

    if (usersLoading || hotelsLoading || statsLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6">
                <LoadingSpinner message="Securing Admin Console..." />
            </div>
        );
    }

    const statCards = [
        { label: "Platform Users", value: stats?.userCount || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
        { label: "Partner Hotels", value: stats?.hotelCount || 0, icon: Building2, color: "text-purple-600", bg: "bg-purple-100" },
        { label: "Total Bookings", value: stats?.totalBookings || 0, icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-100" },
        { label: "Platform Revenue", value: `£${(stats?.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-100" },
    ];

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 space-y-12">
            {/* Admin Header */}
            <div className="bg-slate-950 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-600/10 to-transparent"></div>

                <div className="relative space-y-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center shadow-lg shadow-red-500/20 ring-1 ring-white/20">
                                <ShieldAlert className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tight text-white">System Administration</h1>
                                <p className="text-slate-400 font-medium flex items-center gap-2 mt-1 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Authorized Admin Access Only
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {statCards.map((stat, idx) => (
                            <div key={idx} className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 hover:bg-white/10 transition-all group">
                                <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">{stat.label}</p>
                                <p className="text-3xl font-black text-white">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Platform Users Section */}
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 text-slate-900">
                        <Users className="w-6 h-6 text-blue-600" />
                        Platform Users
                    </h2>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search users..."
                            className="pl-10 rounded-xl h-11 bg-slate-50 border-none focus-visible:ring-blue-500/20 font-bold"
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50">
                            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <th className="px-8 py-5">User Identity</th>
                                <th className="px-8 py-5">Role</th>
                                <th className="px-8 py-5">Member Since</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
                            {filteredUsers?.map((user: UserType) => (
                                <tr key={user._id} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-black">
                                                {user.firstName[0]}{user.lastName[0]}
                                            </div>
                                            <div>
                                                <div className="text-slate-900 font-bold">{user.firstName} {user.lastName}</div>
                                                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium italic">
                                                    <Mail className="w-3 h-3" /> {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <Badge className={`rounded-lg px-3 py-1 font-black text-[9px] border-none ${user.role === 'admin' ? 'bg-red-50 text-red-600' :
                                            user.role === 'hotel_owner' ? 'bg-purple-50 text-purple-600' :
                                                'bg-blue-50 text-blue-600'
                                            }`}>
                                            {user.role.toUpperCase()}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 opacity-30" />
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl p-2 min-w-[160px]">
                                                <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400 px-3 py-2">Quick Actions</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    className="rounded-lg gap-2 cursor-pointer font-bold focus:bg-slate-50"
                                                    onClick={() => updateRoleMutation.mutate({ userId: user._id, role: user.role === 'user' ? 'hotel_owner' : 'user' })}
                                                >
                                                    <UserCog className="w-4 h-4 text-blue-500" />
                                                    Set as {user.role === 'user' ? 'Owner' : 'User'}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-1" />
                                                <DropdownMenuItem
                                                    className="rounded-lg gap-2 cursor-pointer font-bold text-red-600 focus:bg-red-50 focus:text-red-700"
                                                    onClick={() => {
                                                        if (window.confirm(`Are you sure you want to delete ${user.firstName}?`)) {
                                                            deleteUserMutation.mutate(user._id);
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete Account
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Platform Hotels Section */}
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden relative min-h-[400px]">
                <div className="p-8 border-b border-slate-50">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 text-slate-900">
                            <Hotel className="w-6 h-6 text-purple-600" />
                            Platform Hotels Management
                        </h2>
                        <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                            <Filter className="w-3 h-3" /> Filters Active
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Hotel Name..."
                                className="pl-10 rounded-2xl h-12 bg-white border-slate-200 font-bold text-sm"
                                value={hName}
                                onChange={(e) => setHName(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Place / City..."
                                className="pl-10 rounded-2xl h-12 bg-white border-slate-200 font-bold text-sm"
                                value={hPlace}
                                onChange={(e) => setHPlace(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                type="number"
                                placeholder="Max Price..."
                                className="pl-10 rounded-2xl h-12 bg-white border-slate-200 font-bold text-sm"
                                value={hPrice}
                                onChange={(e) => setHPrice(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-0 overflow-x-auto min-h-[300px]">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50">
                            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <th className="px-8 py-5">Hotel Identity</th>
                                <th className="px-8 py-5">Location</th>
                                <th className="px-8 py-5">Nightly Rate</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
                            {filteredHotels?.map((hotel: HotelType) => (
                                <tr key={hotel._id} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-lg font-black overflow-hidden relative shadow-inner">
                                                {hotel.imageUrls && hotel.imageUrls.length > 0 ? (
                                                    <img src={hotel.imageUrls[0]} alt={hotel.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    hotel.name[0]
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-slate-900 font-black text-lg leading-tight">{hotel.name}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className="text-[8px] py-0 px-2 uppercase border-slate-200">{hotel.type}</Badge>
                                                    <span className="text-amber-500 text-[10px]">★ {hotel.starRating}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="text-slate-900 flex items-center gap-1.5 font-black uppercase tracking-tight text-xs bg-rose-50 text-rose-600 w-fit px-3 py-1 rounded-full border border-rose-100">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {hotel.city}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-slate-900 font-black text-2xl">£{hotel.pricePerNight}</div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                                onClick={() => {
                                                    if (window.confirm(`Are you sure you want to delete ${hotel.name}?`)) {
                                                        deleteHotelMutation.mutate(hotel._id);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Empty State: No search results found */}
                    {hotels && hotels.length > 0 && filteredHotels && filteredHotels.length === 0 && (
                        <div className="absolute inset-0 top-[180px] flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm z-20">
                            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6 animate-pulse">
                                <AlertCircle className="w-10 h-10 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Hotel Not Found</h3>
                            <p className="text-slate-500 font-medium max-w-sm mx-auto text-center px-6">
                                No records match <span className="text-red-600 font-bold">"{hName || hPlace || hPrice}"</span>.
                                Try refining your search or resetting the filters.
                            </p>
                            <Button
                                onClick={() => { setHName(""); setHPlace(""); setHPrice(""); }}
                                className="mt-8 bg-slate-900 text-white rounded-2xl px-10 py-6 font-black uppercase tracking-widest hover:scale-105 transition-all"
                            >
                                <XCircle className="w-4 h-4 mr-2" /> Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;
