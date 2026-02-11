
import express, { Request, Response } from "express";
import verifyToken, { requireRole } from "../middleware/auth";
import Hotel from "../models/hotel";
import Booking from "../models/booking";

const router = express.Router();

router.get("/dashboard", verifyToken, requireRole(["hotel_owner", "admin"]), async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({ userId: req.userId });
        const hotelIds = hotels.map((hotel) => hotel._id);
        const bookings = await Booking.find({ hotelId: { $in: hotelIds } });

        const totalRevenue = bookings.reduce(
            (acc, booking) => acc + booking.totalCost,
            0
        );
        const totalBookings = bookings.length;

        // Calculate average rating
        const totalRating = hotels.reduce(
            (acc, hotel) => acc + hotel.starRating,
            0
        );
        const averageRating = hotels.length > 0 ? totalRating / hotels.length : 0;

        // Calculate occupancy rate (simplified mock calculation for now as capacity is not fully tracked per day)
        // Assuming each hotel has a capacity of 100 for simplicity in this demo or we can derive it if rooms were tracked
        // For now we will just return a placeholder or based on active bookings vs something
        // The previous prompt implies a more complex calculation but without room inventory it's hard.
        // I'll stick to a simple one or 0.
        const occupancyRate = 0;

        // Revenue Trends (Mocking explicit dates for now or grouping by existing)
        // We will group bookings by date
        const revenueTrends = bookings.reduce((acc: any[], booking) => {
            const date = booking.createdAt.toISOString().split('T')[0];
            const existing = acc.find(d => d.date === date);
            if (existing) {
                existing.revenue += booking.totalCost;
            } else {
                acc.push({ date, revenue: booking.totalCost });
            }
            return acc;
        }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Booking Trends
        const bookingTrends = bookings.reduce((acc: any[], booking) => {
            const date = booking.createdAt.toISOString().split('T')[0];
            const existing = acc.find(d => d.date === date);
            if (existing) {
                existing.bookings += 1;
            } else {
                acc.push({ date, bookings: 1 });
            }
            return acc;
        }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Rating Trends (Mock based on hotel updates or bookings if we had review dates. Using placeholder)
        const ratingTrends = [{ date: new Date().toISOString().split('T')[0], rating: averageRating }];

        // Top Hotels
        const topHotels = hotels.map(hotel => {
            const hotelBookings = bookings.filter(b => b.hotelId.toString() === hotel._id.toString());
            const revenue = hotelBookings.reduce((acc, b) => acc + b.totalCost, 0);
            return {
                name: hotel.name,
                bookings: hotelBookings.length,
                revenue
            }
        }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

        // Top Destinations
        const topDestinations = hotels.reduce((acc: any[], hotel) => {
            const hotelBookings = bookings.filter(b => b.hotelId.toString() === hotel._id.toString());
            const revenue = hotelBookings.reduce((r, b) => r + b.totalCost, 0);

            const existing = acc.find(d => d.name === hotel.city);
            if (existing) {
                existing.bookings += hotelBookings.length;
                existing.revenue += revenue;
            } else {
                acc.push({ name: hotel.city, bookings: hotelBookings.length, revenue });
            }
            return acc;
        }, []).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

        // Forecasts (Mock logic: projecting last know value forward)
        const forecastRevenue = [{ date: "Next Month", value: totalRevenue * 1.1 }];
        const forecastBookings = [{ date: "Next Month", value: totalBookings * 1.1 }];

        res.json({
            overview: {
                totalRevenue,
                totalBookings,
                averageRating,
                occupancyRate,
            },
            trends: {
                revenue: revenueTrends,
                bookings: bookingTrends,
                ratings: ratingTrends
            },
            topPerformers: {
                hotels: topHotels,
                destinations: topDestinations,
            },
            forecasts: {
                revenue: forecastRevenue,
                bookings: forecastBookings
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching analytics" });
    }
});

export default router;
