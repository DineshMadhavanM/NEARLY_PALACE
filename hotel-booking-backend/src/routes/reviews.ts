import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import Review from "../models/review";
import Hotel from "../models/hotel";
import Booking from "../models/booking";
import verifyToken from "../middleware/auth";

const router = express.Router();

// GET all reviews for a specific hotel
router.get("/hotel/:hotelId", async (req: Request, res: Response) => {
    try {
        const reviews = await Review.find({ hotelId: req.params.hotelId }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

// POST a new review
router.post(
    "/",
    verifyToken,
    [
        check("hotelId", "Hotel ID is required").notEmpty(),
        check("bookingId", "Booking ID is required").notEmpty(),
        check("rating", "Rating must be between 1 and 5").isInt({ min: 1, max: 5 }),
        check("comment", "Comment is required").notEmpty(),
        check("categories.cleanliness", "Cleanliness rating is required").isInt({ min: 1, max: 5 }),
        check("categories.service", "Service rating is required").isInt({ min: 1, max: 5 }),
        check("categories.location", "Location rating is required").isInt({ min: 1, max: 5 }),
        check("categories.value", "Value rating is required").isInt({ min: 1, max: 5 }),
        check("categories.amenities", "Amenities rating is required").isInt({ min: 1, max: 5 }),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { hotelId, bookingId, rating, comment, categories } = req.body;

            // Check if user has a confirmed booking for this hotel
            const booking = await Booking.findOne({
                _id: bookingId,
                userId: req.userId,
                hotelId: hotelId,
                status: "confirmed"
            });

            if (!booking) {
                return res.status(403).json({ message: "You can only review hotels you have booked" });
            }

            // Check if user already reviewed this booking
            const existingReview = await Review.findOne({ bookingId, userId: req.userId });
            if (existingReview) {
                return res.status(400).json({ message: "You have already reviewed this booking" });
            }

            const newReview = new Review({
                userId: req.userId,
                hotelId,
                bookingId,
                rating,
                comment,
                categories,
                isVerified: true,
                helpfulCount: 0
            });

            await newReview.save();

            // Update hotel average rating
            const allReviews = await Review.find({ hotelId });
            const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

            await Hotel.findByIdAndUpdate(hotelId, {
                averageRating: avgRating
            });

            res.status(201).json(newReview);
        } catch (error) {
            console.error("Error creating review:", error);
            res.status(500).json({ message: "Something went wrong" });
        }
    }
);

export default router;
