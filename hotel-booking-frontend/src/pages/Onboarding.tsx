import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { axiosInstance } from "../lib/api-client";
import useAppContext from "../hooks/useAppContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { User, Building2, Sparkles, CheckCircle } from "lucide-react";

const Onboarding = () => {
    const { isLoaded } = useUser();
    const { showToast } = useAppContext();
    const [role, setRole] = useState<"user" | "hotel_owner">("user");
    const [isLoading, setIsLoading] = useState(false);

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    const handleOnboarding = async () => {
        setIsLoading(true);
        try {
            await axiosInstance.post("/api/users/onboarding", { role });

            showToast({
                title: "Welcome aboard!",
                description: `You are now registered as a ${role === "hotel_owner" ? "Hotel Owner" : "Standard User"}.`,
                type: "SUCCESS",
            });

            // Refresh to update Clerk's publicMetadata in the frontend
            window.location.href = "/";
        } catch (error) {
            console.error("Onboarding failed:", error);
            showToast({
                title: "Onboarding Failed",
                description: "Something went wrong. Please try again.",
                type: "ERROR",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl w-full">
                <Card className="border-0 shadow-2xl bg-white overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>

                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
                            <Sparkles className="w-8 h-8 text-amber-600" />
                        </div>
                        <CardTitle className="text-3xl font-bold text-slate-900">Final Step!</CardTitle>
                        <CardDescription className="text-slate-600 text-lg">
                            How do you plan to use Nearly Palace?
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-8 pt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => setRole("user")}
                                className={`flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-300 ${role === "user"
                                    ? "border-amber-500 bg-amber-50 ring-4 ring-amber-100 shadow-lg"
                                    : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                                    }`}
                            >
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${role === "user" ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-500"
                                    }`}>
                                    <User className="w-8 h-8" />
                                </div>
                                <div className="text-center">
                                    <span className={`block font-bold text-lg ${role === "user" ? "text-amber-900" : "text-slate-900"}`}>Standard User</span>
                                    <span className="text-sm text-slate-500">I want to book luxury hotels</span>
                                </div>
                                {role === "user" && <CheckCircle className="absolute top-4 right-4 w-6 h-6 text-amber-500 fill-white" />}
                            </button>

                            <button
                                onClick={() => setRole("hotel_owner")}
                                className={`flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-300 ${role === "hotel_owner"
                                    ? "border-amber-500 bg-amber-50 ring-4 ring-amber-100 shadow-lg"
                                    : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                                    }`}
                            >
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${role === "hotel_owner" ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-500"
                                    }`}>
                                    <Building2 className="w-8 h-8" />
                                </div>
                                <div className="text-center">
                                    <span className={`block font-bold text-lg ${role === "hotel_owner" ? "text-amber-900" : "text-slate-900"}`}>Hotel Owner</span>
                                    <span className="text-sm text-slate-500">I want to list my palace</span>
                                </div>
                                {role === "hotel_owner" && <CheckCircle className="absolute top-4 right-4 w-6 h-6 text-amber-500 fill-white" />}
                            </button>
                        </div>

                        <Button
                            onClick={handleOnboarding}
                            disabled={isLoading}
                            className="w-full py-6 text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-xl shadow-amber-200 transition-all duration-300 transform hover:scale-[1.01]"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-3">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    Setting up your palace...
                                </div>
                            ) : (
                                "Complete Setup"
                            )}
                        </Button>

                        <p className="text-center text-xs text-slate-400">
                            By continuing, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Onboarding;
