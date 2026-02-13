import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.get("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});


router.put(
  "/me",
  verifyToken,
  [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("phone", "Phone is required").optional().isString(),
    check("address", "Address is required").optional().isObject(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findByIdAndUpdate(
        req.userId,
        {
          $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            address: req.body.address,
            preferences: req.body.preferences,
          },
        },
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.post(
  "/onboarding",
  verifyToken,
  [check("role", "Role is required").isIn(["user", "hotel_owner"])],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { role } = req.body;
    const email = req.userEmail;
    const clerkId = req.clerkId;

    try {
      let user = await User.findOne({ email });

      if (user) {
        // Update existing user
        user.role = role as "user" | "hotel_owner";
        user.clerkId = clerkId;
        await user.save();
      } else {
        // Create new user record for this Clerk identity
        user = new User({
          email,
          clerkId,
          role,
          // Placeholder names as Clerk holds the real ones
          firstName: "New",
          lastName: "User",
          password: "clerk_managed_" + Math.random().toString(36).slice(-8),
        });
        await user.save();
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Onboarding Error:", error);
      res.status(500).json({ message: "Something went wrong during onboarding" });
    }
  }
);

export default router;
