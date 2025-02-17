import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Router } from "express";
const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(cookieParser());


export { app };