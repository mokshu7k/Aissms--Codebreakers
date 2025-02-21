import { Router } from "express";
import { getNGOs, getUserDonations } from "../controllers/donor.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { sendDonationRequest } from "../controllers/donate.controller.js";

const router = Router();

router.route("/viewpastdonations").get(verifyJWT, getUserDonations);
router.route("/getlistofngos").get(verifyJWT,getNGOs);
router.route("/donate").post(verifyJWT, sendDonationRequest);

export default router;
