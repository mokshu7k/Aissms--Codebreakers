import { Router } from "express";
import { getNGOs, getPastDonations, getActiveDonations } from "../controllers/donor.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { sendDonationRequest } from "../controllers/donate.controller.js";



const router = Router();

router.route("/viewpastdonations").get(verifyJWT, getPastDonations);
router.route("/getlistofngos").get(verifyJWT,getNGOs);
router.route("/donate").post(verifyJWT, sendDonationRequest);
router.route("/viewactivedonations").get(verifyJWT,getActiveDonations)

export default router;
