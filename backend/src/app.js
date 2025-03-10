import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: [`${process.env.FRONT_URL}`, "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json({ limit: "16kb" }));
app.use("/static", express.static("public"));
app.use(cookieParser());

import { authRouter } from "./routes/auth.routes.js";
import { todoRouter } from "./routes/todo.routes.js";
import { tokenRouter } from "./routes/newAccessToken.routes.js";

app.use("/api/auth", authRouter);
app.use("/api/todo", todoRouter);
app.use("/api/token", tokenRouter);

export { app };
