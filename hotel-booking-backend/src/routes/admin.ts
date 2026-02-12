import express, { Request, Response } from "express";
import User from "../models/user";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";

const router = express.Router();

// Middleware to check if the user is the master admin
const verifyAdmin = async (req: Request, res: Response, next: any) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || user.email !== "kit27.ad17@gmail.com") {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET all users for admin console
router.get("/users", verifyToken, verifyAdmin, async (req: Request, res: Response) => {
    try {
        const users = await User.find({}).select("-password").sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
});

// GET admin dashboard stats
router.get("/stats", verifyToken, verifyAdmin, async (req: Request, res: Response) => {
    try {
        const userCount = await User.countDocuments();
        const hotelCount = await Hotel.countDocuments();

        // Sum total revenue from all hotels
        const hotels = await Hotel.find({});
        const totalRevenue = hotels.reduce((acc, current) => acc + (current.totalRevenue || 0), 0);
        const totalBookings = hotels.reduce((acc, current) => acc + (current.totalBookings || 0), 0);

        res.json({
            userCount,
            hotelCount,
            totalRevenue,
            totalBookings
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching stats" });
    }
});

// GET all hotels for admin console
router.get("/hotels", verifyToken, verifyAdmin, async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({}).sort({ createdAt: -1 });
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: "Error fetching hotels" });
    }
});

// DELETE a user
router.delete("/users/:userId", verifyToken, verifyAdmin, async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        // Don't allow admin to delete themselves
        if (userId === req.userId) {
            return res.status(400).json({ message: "Admin cannot delete themselves" });
        }
        await User.findByIdAndDelete(userId);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
});

// UPDATE a user role
router.patch("/users/:userId/role", verifyToken, verifyAdmin, async (req: Request, res: Response) => {
    try {
        const { role } = req.body;
        const userId = req.params.userId;
        await User.findByIdAndUpdate(userId, { role });
        res.json({ message: "Role updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating role" });
    }
});

// DELETE a hotel
router.delete("/hotels/:hotelId", verifyToken, verifyAdmin, async (req: Request, res: Response) => {
    try {
        const hotelId = req.params.hotelId;
        await Hotel.findByIdAndDelete(hotelId);
        res.json({ message: "Hotel deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting hotel" });
    }
});

// APPROVE a hotel
router.patch("/hotels/:hotelId/approve", verifyToken, verifyAdmin, async (req: Request, res: Response) => {
    try {
        const hotelId = req.params.hotelId;
        const hotel = await Hotel.findByIdAndUpdate(hotelId, { isApproved: true }, { new: true });
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.json({ message: "Hotel approved successfully", hotel });
    } catch (error) {
        res.status(500).json({ message: "Error approving hotel" });
    }
});

export default router;
