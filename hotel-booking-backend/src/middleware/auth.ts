import { NextFunction, Request, Response } from "express";
import { createClerkClient } from "@clerk/clerk-sdk-node";
import User from "../models/user";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

declare global {
  namespace Express {
    interface Request {
      userId: string;
      userRole: string;
      userEmail: string;
      clerkId?: string;
    }
  }
}

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const headerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;

  const token = headerToken;

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    const sessionClaims = await clerk.verifyToken(token);

    // Clerk uses 'sub' for userId, and we can get email from session claims
    // Note: sessionClaims might need custom mapping depending on your Clerk setup
    const email = (sessionClaims as any).email;
    const clerkId = sessionClaims.sub;

    if (!email) {
      return res.status(401).json({ message: "Invalid token: Email missing" });
    }

    // Look up user in MongoDB by email to keep legacy data connected
    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist in DB but has a Clerk token, we might need to create them
      // For now, we'll mark them as "un-onboarded" by not setting a valid userId
      // or handle it in the onboarding flow.
      req.userEmail = email;
      req.clerkId = clerkId;
      req.userRole = "user"; // Default role
      return next();
    }

    // Link user to Clerk ID if not already done
    if (!user.clerkId) {
      user.clerkId = clerkId;
      await user.save();
    }

    req.userId = user._id.toString();
    req.userRole = user.role;
    req.userEmail = user.email;
    req.clerkId = clerkId;

    next();
  } catch (error) {
    console.error("Clerk Verify Error:", error);
    return res.status(401).json({ message: "Invalid session" });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
};

export default verifyToken;
