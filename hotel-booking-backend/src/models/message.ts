import mongoose from "mongoose";
import { MessageType } from "../../../shared/types";

const messageSchema = new mongoose.Schema<MessageType>(
    {
        senderId: { type: String, required: true },
        receiverId: { type: String, required: true },
        senderName: { type: String, required: true },
        subject: { type: String, required: true },
        content: { type: String, required: true },
        isRead: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const Message = mongoose.model<MessageType>("Message", messageSchema);

export default Message;
