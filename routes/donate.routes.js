import { Router } from "express";
import { sendDonationRequest } from "../controllers/donate.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route()