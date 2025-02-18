import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import donorRoutes from "./routes/donor.routes.js";
import ngoRoutes from "./routes/ngo.routes.js";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" })); // this is necessary without this incoming payload won't get parsed as json
app.use(express.urlencoded({ extended: false, limit: "16kb" })); // doesnt preserve nested json (eg: res.body.email)
app.use(cookieParser());


app.use("/auth", authRoutes);
app.use("/donor", donorRoutes);
app.use("/ngo", ngoRoutes);

export { app };
