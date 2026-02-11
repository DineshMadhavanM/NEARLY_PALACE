import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import UserProfile from "../components/UserProfile";
import OwnerProfile from "../components/OwnerProfile";
import LoadingSpinner from "../components/LoadingSpinner";
import { UserType } from "../../../shared/types";

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
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <LoadingSpinner message="Fetching your profile..." />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="bg-red-50 border border-red-100 p-8 rounded-[2rem] text-center max-w-md">
                    <h2 className="text-2xl font-black text-red-900 mb-2">Oops! Something went wrong</h2>
                    <p className="text-red-700 font-medium mb-6">We couldn't load your profile details at this time. Please try again later.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-200"
                    >
                        Retry Loading
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="py-10 px-4 md:px-8 max-w-7xl mx-auto">
            {user.role === "hotel_owner" ? (
                <OwnerProfile user={user} />
            ) : (
                <UserProfile user={user} />
            )}
        </div>
    );
};

export default Profile;
