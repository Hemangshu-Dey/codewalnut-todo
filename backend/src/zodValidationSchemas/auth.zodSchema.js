import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
    })
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(15, { message: "Username must not exceed 15 characters" }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({ message: "Invalid email address" }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character",
    }),
});

export const loginSchema = z.object({
  identifier: z
    .string({
      required_error: "Identifier (username or email) is required",
    })
    .min(1, { message: "Identifier cannot be empty" }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(1, { message: "Password cannot be empty" }),
});


export const logoutSchema = z.object({
  userid: z
    .string({
      required_error: "User ID is required",
    })
    .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
      message: "Invalid ObjectId format",
    }),})
