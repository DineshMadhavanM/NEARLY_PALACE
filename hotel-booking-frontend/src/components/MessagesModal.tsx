import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { MessageType } from "../../../shared/types";
import { Mail, Send, Trash2, X, Plus, Inbox, MailOpen, CheckCircle, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import useAppContext from "../hooks/useAppContext";

const MessagesModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { showToast } = useAppContext();
    const queryClient = useQueryClient();
    const [isComposing, setIsComposing] = useState(false);
    const [receiverEmail, setReceiverEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");

    const { data: messages, isLoading } = useQuery<MessageType[]>(
        "fetchInbox",
        apiClient.fetchInbox,
        { enabled: isOpen }
    );

    const sendMutation = useMutation(apiClient.sendMessage, {
        onSuccess: () => {
            showToast({ title: "Message sent successfully!", type: "SUCCESS" });
            queryClient.invalidateQueries("fetchInbox");
            queryClient.invalidateQueries("fetchUnreadCount");
            setIsComposing(false);
            setReceiverEmail("");
            setSubject("");
            setContent("");
        },
        onError: (err: any) => showToast({ title: err.message || "Failed to send message", type: "ERROR" })
    });

    const markAsReadMutation = useMutation(apiClient.markAsRead, {
        onSuccess: () => {
            queryClient.invalidateQueries("fetchInbox");
            queryClient.invalidateQueries("fetchUnreadCount");
        }
    });

    const deleteMutation = useMutation(apiClient.deleteMessage, {
        onSuccess: () => {
            showToast({ title: "Message deleted", type: "SUCCESS" });
            queryClient.invalidateQueries("fetchInbox");
            queryClient.invalidateQueries("fetchUnreadCount");
        },
        onError: (err: any) => showToast({ title: err.message || "Failed to delete message", type: "ERROR" })
    });

    const handleSend = () => {
        if (!receiverEmail || !subject || !content) {
            showToast({ title: "Please fill all fields", type: "ERROR" });
            return;
        }
        sendMutation.mutate({ receiverEmail, subject, content });
    };

    const respondToBookingMutation = useMutation(apiClient.sendMessage, {
        onSuccess: () => {
            showToast({ title: "Response sent successfully!", type: "SUCCESS" });
            queryClient.invalidateQueries("fetchInbox");
            queryClient.invalidateQueries("fetchUnreadCount");
        },
        onError: (err: any) => showToast({ title: err.message || "Failed to send response", type: "ERROR" })
    });

    const handleAcceptBooking = (message: MessageType) => {
        const guestEmailMatch = message.content.match(/Guest Email: (.+)/);
        const guestEmail = guestEmailMatch ? guestEmailMatch[1].trim() : "";

        if (!guestEmail) {
            showToast({ title: "Could not find guest email", type: "ERROR" });
            return;
        }

        // Extract hotel name from subject (format: "New Booking Request for [Hotel Name]")
        const hotelName = message.subject.replace("New Booking Request for ", "");

        const responseSubject = `Booking Accepted - ${hotelName}`;
        const responseContent = `Great news! Your booking request for ${hotelName} has been ACCEPTED.

We will call you within 5 minutes to confirm the details and finalize your reservation.

Thank you for choosing ${hotelName}!`;

        respondToBookingMutation.mutate({
            receiverEmail: guestEmail,
            subject: responseSubject,
            content: responseContent
        });
    };

    const handleRejectBooking = (message: MessageType) => {
        const guestEmailMatch = message.content.match(/Guest Email: (.+)/);
        const guestEmail = guestEmailMatch ? guestEmailMatch[1].trim() : "";

        if (!guestEmail) {
            showToast({ title: "Could not find guest email", type: "ERROR" });
            return;
        }

        // Extract hotel name from subject
        const hotelName = message.subject.replace("New Booking Request for ", "");

        const responseSubject = `Booking Request Update - ${hotelName}`;
        const responseContent = `Thank you for your interest in ${hotelName}.

Unfortunately, we are unable to accommodate your booking request at this time due to availability constraints.

We apologize for any inconvenience and hope to serve you in the future.

Best regards,
${hotelName}`;

        respondToBookingMutation.mutate({
            receiverEmail: guestEmail,
            subject: responseSubject,
            content: responseContent
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                            <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">Messages</h2>
                            <p className="text-xs text-slate-500 font-medium">Your inbox</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => setIsComposing(!isComposing)}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 font-bold flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> New Message
                        </Button>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-600" />
                        </button>
                    </div>
                </div>

                {/* Compose Form */}
                {isComposing && (
                    <div className="p-6 border-b border-slate-100 bg-slate-50 space-y-4">
                        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                            <Send className="w-5 h-5 text-blue-600" /> Compose Message
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recipient Email</Label>
                                <Input
                                    value={receiverEmail}
                                    onChange={(e) => setReceiverEmail(e.target.value)}
                                    placeholder="recipient@example.com"
                                    className="rounded-xl h-11 font-medium"
                                />
                            </div>
                            <div>
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</Label>
                                <Input
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Message subject"
                                    className="rounded-xl h-11 font-medium"
                                />
                            </div>
                            <div>
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message</Label>
                                <Textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Type your message here..."
                                    className="rounded-xl min-h-[120px] font-medium resize-none"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleSend}
                                    disabled={sendMutation.isLoading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 font-bold"
                                >
                                    {sendMutation.isLoading ? "Sending..." : "Send Message"}
                                </Button>
                                <Button
                                    onClick={() => setIsComposing(false)}
                                    variant="outline"
                                    className="rounded-xl px-6 font-bold"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : messages && messages.length > 0 ? (
                        messages.map((message) => (
                            <div
                                key={message._id}
                                className={`p-5 rounded-2xl border transition-all hover:shadow-md ${message.isRead ? "bg-white border-slate-100" : "bg-blue-50 border-blue-200"
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${message.isRead ? "bg-slate-100" : "bg-blue-600"
                                                }`}>
                                                {message.isRead ? (
                                                    <MailOpen className="w-4 h-4 text-slate-400" />
                                                ) : (
                                                    <Mail className="w-4 h-4 text-white" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-slate-900">{message.senderName}</span>
                                                    {!message.isRead && (
                                                        <span className="bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">New</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium">
                                                    {new Date(message.createdAt).toLocaleDateString()} at {new Date(message.createdAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-slate-900 text-sm">{message.subject}</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{message.content}</p>

                                        {/* Accept/Reject Buttons for Booking Requests */}
                                        {message.subject.includes("New Booking Request for") && (
                                            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                                                <Button
                                                    onClick={() => handleAcceptBooking(message)}
                                                    disabled={respondToBookingMutation.isLoading}
                                                    className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-4 py-2 font-bold flex items-center gap-2 text-xs"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Accept Booking
                                                </Button>
                                                <Button
                                                    onClick={() => handleRejectBooking(message)}
                                                    disabled={respondToBookingMutation.isLoading}
                                                    variant="outline"
                                                    className="border-red-600 text-red-600 hover:bg-red-50 rounded-xl px-4 py-2 font-bold flex items-center gap-2 text-xs"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    Reject Booking
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2">{!message.isRead && (
                                        <button
                                            onClick={() => markAsReadMutation.mutate(message._id)}
                                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                                            title="Mark as read"
                                        >
                                            <MailOpen className="w-4 h-4 text-blue-600" />
                                        </button>
                                    )}
                                        <button
                                            onClick={() => {
                                                if (window.confirm("Delete this message?")) {
                                                    deleteMutation.mutate(message._id);
                                                }
                                            }}
                                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                <Inbox className="w-10 h-10 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">No Messages</h3>
                            <p className="text-slate-500 font-medium">Your inbox is empty</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagesModal;
