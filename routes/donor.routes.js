import { Router } from "express";
import { getNGOs, getDonorPastDonations, getRequestData } from "../controllers/donor.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router();

router.route("/viewpastdonations").get(verifyJWT, getDonorPastDonations);
router.route("/getlistofngos").get(verifyJWT,getNGOs)
router.route("/getRequestData").get(verifyJWT,getRequestData)
// router.route("donatefood").post(verifyJWT, sendDonationRequest)

export default router;
