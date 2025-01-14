import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { response } from "../utils/response.util.js";
import {
  registerSchema,
  loginSchema,
  logoutSchema,
} from "../zodValidationSchemas/auth.zodSchema.js";
import { mongoose } from "mongoose";
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const result = registerSchema.safeParse({
    username,
    email,
    password,
  });

  if (!result.success) {
    return response(
      res,
      400,
      "Failed to register user",
      "",
      result.error.errors[0].message
    );
  }

  try {
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (user) return response(res, 400, "User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return response(res, 200, "User registered successfully");
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal Server Error", null, error);
  }
};

const loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  const result = loginSchema.safeParse({
    identifier,
    password,
  });

  if (!result.success) {
    return response(
      res,
      400,
      "Failed to login user",
      "",
      result.error.errors[0].message
    );
  }

  try {
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) return response(res, 400, "User does not exist");

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return response(res, 401, "Invalid credentials");

    const accessToken = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15d",
      }
    );

    user.refreshToken = refreshToken;
    await user.save();

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .json({
        message: "User logged in successfully",
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
        error: "none",
      });
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal Server Error", null, error);
  }
};

const logout = async (req, res) => {
  const { userid } = req.body;

  const result = logoutSchema.safeParse({
    userid,
  });

  if (!result.success) {
    return response(
      res,
      400,
      "Failed to logout user",
      "",
      result.error.errors[0].message
    );
  }

  const id = new mongoose.Types.ObjectId(userid);

  try {
    const user = await User.findOne({ _id: id });

    user.refreshToken = "";

    await user.save();

    return res
      .status(200)
      .cookie("accessToken", "", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .cookie("refreshToken", "", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .json({
        message: "User logged out successfully",
        data: "none",
        error: "none",
      });
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal Server Error", null, error);
  }
};

const validation = async (req, res) => {
  return response(res, 200, "Validated successfully", req.user);
};

export { registerUser, loginUser, logout , validation};
