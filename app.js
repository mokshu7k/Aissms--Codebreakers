import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import donorRoutes from "./routes/donor.routes.js";
import ngoRoutes from "./routes/ngo.routes.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: false, limit: "16kb" }));
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/donor", donorRoutes);
app.use("/ngo", ngoRoutes);
app.use(errorHandler);

export { app };
