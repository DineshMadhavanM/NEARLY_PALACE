import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import UserProfile from "../components/UserProfile";
import OwnerProfile from "../components/OwnerProfile";
import LoadingSpinner from "../components/LoadingSpinner";
import { UserType } from "../../../shared/types";
import { ShieldCheck } from "lucide-react";

const Profile = () => {
    const { data: user, isLoading, error } = useQuery<UserType>(
        "fetchCurrentUser",
        apiClient.fetchCurrentUser,
        {
            retry: false,
        }
    );

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
                <LoadingSpinner message="Curating your palace profile..." />
                <p className="text-orange-600/60 font-serif italic animate-pulse">Refining the experience...</p>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="bg-white border border-orange-100 p-10 rounded-[2.5rem] text-center max-w-md shadow-luxury">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3 font-serif italic text-balance">Divine Intervention Required</h2>
                    <p className="text-slate-500 font-medium mb-8 leading-relaxed">We encountered a fleeting disturbance while gathering your details. Shall we attempt the passage again?</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2"
                    >
                        Re-attempt Passage
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
            <div className="max-w-4xl mx-auto">
                {user.role === "hotel_owner" ? (
                    <OwnerProfile user={user} />
                ) : (
                    <UserProfile user={user} />
                )}
            </div>
        </div>
    );
};

export default Profile;
