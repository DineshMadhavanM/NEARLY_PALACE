import express, { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import verifyToken from "../middleware/auth";
import Hotel from "../models/hotel";
import mongoose from "mongoose";

const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

// Listing fee amount (e.g., 10 INR)
const LISTING_FEE = 10;

router.post(
    "/create-listing-fee-order",
    verifyToken,
    async (req: Request, res: Response) => {
        try {
            const { hotelId } = req.body;

            if (!hotelId || !mongoose.Types.ObjectId.isValid(hotelId)) {
                return res.status(400).json({ message: "Invalid or missing hotel ID" });
            }

            const hotel = await Hotel.findById(hotelId);
            if (!hotel) {
                return res.status(404).json({ message: "Hotel not found" });
            }

            if (hotel.userId !== req.userId) {
                return res.status(403).json({ message: "Unauthorized" });
            }

            const options = {
                amount: LISTING_FEE * 100, // Amount in paise
                currency: "INR",
                receipt: `receipt_listing_${hotelId}`,
                notes: {
                    hotelId,
                    userId: req.userId,
                },
            };

            const order = await razorpay.orders.create(options);

            res.status(200).json(order);
        } catch (error) {
            console.error("Error creating Razorpay order:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
);

router.post(
    "/verify-listing-fee",
    verifyToken,
    async (req: Request, res: Response) => {
        try {
            const {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                hotelId,
            } = req.body;

            const body = razorpay_order_id + "|" + razorpay_payment_id;

            const expectedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
                .update(body.toString())
                .digest("hex");

            if (expectedSignature === razorpay_signature) {
                // Payment is verified
                await Hotel.findByIdAndUpdate(hotelId, {
                    isListingFeePaid: true,
                });

                res.status(200).json({ message: "Payment verified successfully" });
            } else {
                res.status(400).json({ message: "Invalid signature" });
            }
        } catch (error) {
            console.error("Error verifying Razorpay payment:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
);

export default router;
