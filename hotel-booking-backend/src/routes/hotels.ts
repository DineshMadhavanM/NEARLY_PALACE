import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import Booking from "../models/booking";
import User from "../models/user";
import { BookingType, HotelSearchResponse } from "../../../shared/types";
import { param, validationResult } from "express-validator";
import Stripe from "stripe";
import verifyToken from "../middleware/auth";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);

    let sortOptions: any = {};
    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 }; // Default to newest first
        break;
    }

    const pageSize = 10;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const total = await Hotel.countDocuments(query);

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel ID is required")],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id.toString();

    try {
      const hotel = await Hotel.findById(id);
      res.json(hotel);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching hotel" });
    }
  }
);

router.post(
  "/:hotelId/bookings/payment-intent",
  verifyToken,
  async (req: Request, res: Response) => {
    const { numberOfNights } = req.body;
    const hotelId = req.params.hotelId;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(400).json({ message: "Hotel not found" });
    }

    const totalCost = hotel.pricePerNight * numberOfNights;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCost * 100,
      currency: "usd", // Updated to USD as per request
      metadata: {
        hotelId,
        userId: req.userId,
        // client-side or subsequent logic might need bookingId, but it's not created yet. 
        // We will include a placeholder or if the flow requires it, we'd need to pre-create.
        // For now, adhering to existing flow but adding the requested fields if available.
        // If bookingId is needed, we might generate a UUID here or similar, but leaving consistent with snippet request.
        // The snippet had bookingId. I'll add a provisional ID or similar if possible. 
        // Actually, let's assuming the booking is created AFTER payment success (standard flow here).
        // I will omit bookingId from metadata here as it doesn't exist, OR I will assume the user wants it to be generated.
        // Let's stick to the user's snippet variable names where possible but adapt to reality.
        // I will just add request based metadata.
      },
    });

    if (!paymentIntent.client_secret) {
      return res.status(500).json({ message: "Error creating payment intent" });
    }

    const response = {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret.toString(),
      totalCost,
    };

    res.send(response);
  }
);

router.post(
  "/:hotelId/bookings",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const paymentIntentId = req.body.paymentIntentId;

      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId as string
      );

      if (!paymentIntent) {
        return res.status(400).json({ message: "payment intent not found" });
      }

      if (
        paymentIntent.metadata.hotelId !== req.params.hotelId ||
        paymentIntent.metadata.userId !== req.userId
      ) {
        return res.status(400).json({ message: "payment intent mismatch" });
      }

      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({
          message: `payment intent not succeeded. Status: ${paymentIntent.status}`,
        });
      }

      const newBooking: BookingType = {
        ...req.body,
        userId: req.userId,
        hotelId: req.params.hotelId,
        createdAt: new Date(), // Add booking creation timestamp
        status: "confirmed", // Set initial status
        paymentStatus: "paid", // Set payment status since payment succeeded
      };

      // Create booking in separate collection
      const booking = new Booking(newBooking);
      await booking.save();

      // Update hotel analytics
      await Hotel.findByIdAndUpdate(req.params.hotelId, {
        $inc: {
          totalBookings: 1,
          totalRevenue: newBooking.totalCost,
        },
      });

      // Update user analytics
      await User.findByIdAndUpdate(req.userId, {
        $inc: {
          totalBookings: 1,
          totalSpent: newBooking.totalCost,
        },
      });

      res.status(200).send();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "something went wrong" });
    }
  }
);

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  // Filter out unapproved hotels (allow undefined/true for legacy, but enforce approval)
  constructedQuery.isApproved = { $ne: false };

  if (queryParams.destination && queryParams.destination.trim() !== "") {
    const destination = queryParams.destination.trim();

    // Escape special regex characters to prevent regex injection
    const escapedDestination = destination.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Split search into individual words for multi-word matching
    const searchWords = escapedDestination.split(/\s+/).filter(word => word.length > 0);

    if (searchWords.length === 1) {
      // Single word search - check if it matches location OR name
      const singleWordRegex = new RegExp(searchWords[0], "i");
      constructedQuery.$or = [
        { city: singleWordRegex },
        { country: singleWordRegex },
        { "location.address.city": singleWordRegex },
        { "location.address.country": singleWordRegex },
        { "location.address.state": singleWordRegex },
        { name: singleWordRegex },
      ];
    } else {
      // Multi-word search (e.g., "Vinoth Grand Hotel")
      // Require ALL words to be present in the name field
      // This ensures "Vinoth Grand Hotel" matches only hotels with all three words in the name
      const nameConditions = searchWords.map(word => ({
        name: new RegExp(word, "i")
      }));

      constructedQuery.$and = nameConditions;
    }
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice),
    };
  }

  return constructedQuery;
};

export default router;
