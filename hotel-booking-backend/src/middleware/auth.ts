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
  console.log("--- Auth Middleware Begin ---");
  console.log("URL:", req.originalUrl);
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Cookies:", JSON.stringify(req.cookies || {}, null, 2));

  const headerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;

  const cookieToken = req.cookies?.auth_token || req.cookies?.__session;
  const token = headerToken || cookieToken;

  if (!token) {
    console.warn("Auth Middleware: No token found in Authorization header or cookies");
    return res.status(401).json({ message: "Access denied: No token provided" });
  }

  try {
    const sessionClaims = await clerk.verifyToken(token);
    const clerkId = sessionClaims.sub as string;

    // Try to get email from claims first (if configured in Clerk Dashboard)
    let email = (sessionClaims as any).email;

    // If missing in claims, fetch from Clerk API directly
    if (!email) {
      const clerkUser = await clerk.users.getUser(clerkId);
      email = clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      )?.emailAddress;
    }

    if (!email) {
      return res.status(401).json({ message: "Invalid token: Email missing" });
    }

    // Look up user in MongoDB by email to keep legacy data connected
    let user = await User.findOne({ email });

    if (!user) {
      console.log(`Auth Middleware: email ${email} not found in MongoDB. Proceeding as 'user' role.`);
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

    console.log(`Auth Middleware: Verified User ${req.userEmail} with role ${req.userRole}`);
    next();
  } catch (error) {
    console.error("Clerk Verify Error:", error);
    return res.status(401).json({ message: "Invalid session or token" });
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

export const requireEmail = (emails: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userEmail || !emails.includes(req.userEmail)) {
      return res.status(403).json({ message: "Access denied: Specific email required" });
    }
    next();
  };
};

export default verifyToken;
