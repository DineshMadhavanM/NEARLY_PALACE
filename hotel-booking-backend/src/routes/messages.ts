import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import Message from "../models/message";
import User from "../models/user";

const router = express.Router();

// Get all messages for the current user
router.get("/inbox", verifyToken, async (req: Request, res: Response) => {
    try {
        const messages = await Message.find({ receiverId: req.userId }).sort("-createdAt");
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching inbox" });
    }
});

// Get unread count
router.get("/unread-count", verifyToken, async (req: Request, res: Response) => {
    try {
        const count = await Message.countDocuments({ receiverId: req.userId, isRead: false });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: "Error fetching unread count" });
    }
});

// Send a message
router.post("/send", verifyToken, async (req: Request, res: Response) => {
    try {
        const { receiverEmail, subject, content } = req.body;

        const receiver = await User.findOne({ email: receiverEmail });
        if (!receiver) {
            return res.status(404).json({ message: "Recipient not found" });
        }

        const sender = await User.findById(req.userId);
        if (!sender) {
            return res.status(404).json({ message: "Sender not found" });
        }

        const newMessage = new Message({
            senderId: req.userId,
            receiverId: receiver._id,
            senderName: `${sender.firstName} ${sender.lastName}`,
            subject,
            content,
        });

        await newMessage.save();
        res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error sending message" });
    }
});

// Send booking notification to hotel owner
router.post("/send-booking-notification", verifyToken, async (req: Request, res: Response) => {
    try {
        const { hotelOwnerId, hotelName, guestName, guestEmail, checkIn, checkOut, totalCost, phone, specialRequests } = req.body;

        const sender = await User.findById(req.userId);
        if (!sender) {
            return res.status(404).json({ message: "Sender not found" });
        }

        const subject = `New Booking Request for ${hotelName}`;
        let content = `You have received a new booking request:

Guest Name: ${guestName}
Guest Email: ${guestEmail}`;

        if (phone) {
            content += `\nGuest Phone: ${phone}`;
        }

        content += `
Check-in: ${checkIn}
Check-out: ${checkOut}
Estimated Total: £${totalCost}`;

        if (specialRequests) {
            content += `\n\nSpecial Requests:\n${specialRequests}`;
        }

        content += `\n\nPlease contact the guest to confirm the booking and discuss payment arrangements.`;

        const newMessage = new Message({
            senderId: req.userId,
            receiverId: hotelOwnerId,
            senderName: `${sender.firstName} ${sender.lastName}`,
            subject,
            content,
        });

        await newMessage.save();
        res.status(201).json({ message: "Booking notification sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error sending booking notification" });
    }
});

// Mark as read
router.patch("/:messageId/read", verifyToken, async (req: Request, res: Response) => {
    try {
        const message = await Message.findOneAndUpdate(
            { _id: req.params.messageId, receiverId: req.userId },
            { isRead: true },
            { new: true }
        );
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: "Error marking as read" });
    }
});

// Delete message
router.delete("/:messageId", verifyToken, async (req: Request, res: Response) => {
    try {
        const message = await Message.findOneAndDelete({ _id: req.params.messageId, receiverId: req.userId });
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        res.json({ message: "Message deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting message" });
    }
});

export default router;
