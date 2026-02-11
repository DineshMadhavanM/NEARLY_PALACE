import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Star, MessageSquareCode, Calendar, User, CheckCircle2, ShieldCheck } from "lucide-react";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ReviewType } from "../../../shared/types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    hotelId: string;
    hotelName: string;
}

const ReviewModal = ({ isOpen, onClose, hotelId, hotelName }: Props) => {
    const { data: reviews, isLoading } = useQuery(
        ["fetchHotelReviews", hotelId],
        () => apiClient.fetchHotelReviews(hotelId),
        {
            enabled: isOpen && !!hotelId,
        }
    );

    const calculateAverage = (reviews: ReviewType[]) => {
        if (!reviews || reviews.length === 0) return 0;
        return reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
    };

    const calculateCategoryAverage = (reviews: ReviewType[], category: keyof ReviewType["categories"]) => {
        if (!reviews || reviews.length === 0) return 0;
        return reviews.reduce((acc, curr) => acc + curr.categories[category], 0) / reviews.length;
    };

    const avgRating = reviews ? calculateAverage(reviews) : 0;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 border-none rounded-3xl shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 z-50"></div>

                <DialogHeader className="p-8 pb-4 bg-slate-50/50 backdrop-blur-md">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <DialogTitle className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                                <div className="bg-amber-100 p-2 rounded-xl">
                                    <MessageSquareCode className="w-6 h-6 text-amber-600" />
                                </div>
                                Guest Feedback
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium mt-1">
                                Authentic reviews and ratings for <span className="text-slate-900 font-bold underline decoration-amber-500/30 underline-offset-4">{hotelName}</span>
                            </DialogDescription>
                        </div>
                        {reviews && reviews.length > 0 && (
                            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                <div className="text-center">
                                    <div className="flex items-center gap-1 text-amber-500">
                                        <Star className="w-5 h-5 fill-amber-500" />
                                        <span className="text-2xl font-black text-slate-900">{avgRating.toFixed(1)}</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall Rating</p>
                                </div>
                                <Separator orientation="vertical" className="h-10" />
                                <div className="text-center">
                                    <span className="text-2xl font-black text-slate-900">{reviews.length}</span>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reviews</p>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden p-8 pt-0 flex flex-col gap-8">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-4">
                            <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
                            <p className="text-slate-500 font-bold animate-pulse">Analyzing feedback...</p>
                        </div>
                    ) : !reviews || reviews.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 text-center">
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg mb-6 transform -rotate-12">
                                <Star className="w-10 h-10 text-slate-200" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">No Reviews Yet</h3>
                            <p className="text-slate-500 max-w-xs font-medium">
                                Wait for your first guests to checkout. Good feedback starts with great service!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 overflow-hidden h-full">
                            {/* Sidebar: Analytics */}
                            <div className="md:col-span-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        Score Breakdown
                                    </h4>

                                    {[
                                        { label: "Cleanliness", key: "cleanliness" as keyof ReviewType["categories"], color: "emerald" },
                                        { label: "Service", key: "service" as keyof ReviewType["categories"], color: "blue" },
                                        { label: "Location", key: "location" as keyof ReviewType["categories"], color: "amber" },
                                        { label: "Value", key: "value" as keyof ReviewType["categories"], color: "violet" },
                                        { label: "Amenities", key: "amenities" as keyof ReviewType["categories"], color: "pink" },
                                    ].map((cat) => {
                                        const score = calculateCategoryAverage(reviews, cat.key);
                                        return (
                                            <div key={cat.key} className="space-y-2">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-xs font-bold text-slate-500">{cat.label}</span>
                                                    <span className="text-sm font-black text-slate-900">{score.toFixed(1)}</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full bg-${cat.color}-500 transition-all duration-500`}
                                                        style={{ width: `${score * 20}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                        <h4 className="font-black text-emerald-900 tracking-tight">Owner Insights</h4>
                                    </div>
                                    <p className="text-xs font-medium text-emerald-700 leading-relaxed">
                                        Properties with a 4.5+ average rating see 30% more bookings on average.
                                    </p>
                                </div>
                            </div>

                            {/* Main: Review Feed */}
                            <div className="md:col-span-2 overflow-hidden flex flex-col bg-white rounded-[2rem] border border-slate-100 p-2">
                                <div className="flex-1 overflow-y-auto px-6 py-4">
                                    <div className="space-y-6">
                                        {reviews.map((review) => (
                                            <div key={review._id} className="group animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                <div className="flex gap-4 p-5 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 shadow-sm hover:shadow-md">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-slate-100">
                                                            <User className="w-6 h-6 text-slate-400" />
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 space-y-3">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h5 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
                                                                    Guest Review
                                                                    {review.isVerified && (
                                                                        <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-600 border-emerald-100 font-black h-4 px-1.5 leading-none">
                                                                            VERIFIED
                                                                        </Badge>
                                                                    )}
                                                                </h5>
                                                                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                                                    <span className="flex items-center gap-1">
                                                                        <Calendar className="w-3 h-3" />
                                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`w-3 h-3 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`}
                                                                    />
                                                                ))}
                                                                <span className="ml-2 text-xs font-black text-amber-700">{review.rating}</span>
                                                            </div>
                                                        </div>

                                                        <div className="relative">
                                                            <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                                                                "{review.comment}"
                                                            </p>
                                                        </div>

                                                        <div className="pt-2 flex flex-wrap gap-2">
                                                            {Object.entries(review.categories).slice(0, 3).map(([key, val]) => (
                                                                <div key={key} className="bg-slate-100 px-2 py-1 rounded-md text-[9px] font-black text-slate-500 uppercase flex items-center gap-1">
                                                                    {key}: <span className="text-slate-900">{val}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewModal;
