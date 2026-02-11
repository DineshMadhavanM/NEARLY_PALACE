import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Star, MessageSquarePlus, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import useAppContext from "../hooks/useAppContext";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    hotelId: string;
    hotelName: string;
    bookingId: string;
}

type FeedbackFormData = {
    rating: number;
    comment: string;
    categories: {
        cleanliness: number;
        service: number;
        location: number;
        value: number;
        amenities: number;
    };
};

const LeaveFeedbackModal = ({ isOpen, onClose, hotelId, hotelName, bookingId }: Props) => {
    const { showToast } = useAppContext();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FeedbackFormData>({
        defaultValues: {
            rating: 5,
            categories: {
                cleanliness: 5,
                service: 5,
                location: 5,
                value: 5,
                amenities: 5,
            },
        },
    });

    const mutation = useMutation(apiClient.createReview, {
        onSuccess: () => {
            showToast({ title: "Review submitted successfully!", type: "SUCCESS" });
            onClose();
        },
        onError: (error: Error) => {
            showToast({ title: error.message, type: "ERROR" });
        },
    });

    const onSubmit = handleSubmit((data) => {
        mutation.mutate({
            ...data,
            hotelId,
            bookingId,
        });
    });

    const rating = watch("rating");
    const categories = watch("categories") as FeedbackFormData["categories"];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto p-0 border-none rounded-[2rem] shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 z-50"></div>

                <form onSubmit={onSubmit}>
                    <DialogHeader className="p-8 pb-4 bg-slate-50/50 backdrop-blur-md">
                        <DialogTitle className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                            <div className="bg-blue-100 p-2 rounded-xl">
                                <MessageSquarePlus className="w-6 h-6 text-blue-600" />
                            </div>
                            Share Your Experience
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium mt-1">
                            How was your stay at <span className="text-slate-900 font-bold underline decoration-blue-500/30 underline-offset-4">{hotelName}</span>?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-8 space-y-8">
                        {/* Overall Rating */}
                        <div className="space-y-4 text-center pb-6 border-b border-slate-100">
                            <Label className="text-sm font-black text-slate-900 uppercase tracking-widest">Overall Satisfaction</Label>
                            <div className="flex justify-center gap-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setValue("rating", star)}
                                        className={`p-2 transition-all duration-300 transform hover:scale-125 ${star <= rating ? "text-amber-400" : "text-slate-200"
                                            }`}
                                    >
                                        <Star className={`w-10 h-10 ${star <= rating ? "fill-amber-400" : ""}`} />
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs font-bold text-slate-400">
                                {rating === 5 ? "Exceptional!" : rating === 4 ? "Great Experience" : rating === 3 ? "It was Okay" : rating === 2 ? "Could be better" : "Poor Experience"}
                            </p>
                        </div>

                        {/* Category Ratings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {[
                                { label: "Cleanliness", key: "cleanliness" },
                                { label: "Service", key: "service" },
                                { label: "Location", key: "location" },
                                { label: "Value for Money", key: "value" },
                                { label: "Amenities", key: "amenities" },
                            ].map((cat) => (
                                <div key={cat.key} className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{cat.label}</Label>
                                        <span className="text-xs font-black text-slate-900">{categories[cat.key as keyof typeof categories]} / 5</span>
                                    </div>
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3, 4, 5].map((val) => (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => setValue(`categories.${cat.key as keyof typeof categories}`, val)}
                                                className={`flex-1 h-2 rounded-full transition-all duration-300 ${val <= categories[cat.key as keyof typeof categories] ? "bg-indigo-500" : "bg-slate-100"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Comment Section */}
                        <div className="space-y-3">
                            <Label htmlFor="comment" className="text-sm font-black text-slate-900">Tell us more about your stay</Label>
                            <Textarea
                                id="comment"
                                placeholder="What did you love? What could be improved?"
                                className="min-h-[120px] rounded-2xl border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 resize-none p-4 font-medium"
                                {...register("comment", { required: "Please share your thoughts" })}
                            />
                            {errors.comment && (
                                <p className="text-xs font-bold text-red-500">{errors.comment.message}</p>
                            )}
                        </div>

                        <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex gap-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            <p className="text-[10px] font-medium text-emerald-700 leading-tight">
                                Your review will be marked as "Verified" since you have a confirmed booking.
                                Thank you for helping other travelers make better choices!
                            </p>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1 py-6 rounded-2xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={mutation.isLoading}
                                className="flex-[2] py-6 rounded-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 transition-all shadow-lg shadow-blue-200"
                            >
                                {mutation.isLoading ? "Submitting..." : "Submit Review"}
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default LeaveFeedbackModal;
