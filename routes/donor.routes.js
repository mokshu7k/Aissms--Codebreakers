import { Router } from "express";
import { getAllDonations } from "../controllers/donor.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/viewpastdonations").get(verifyJWT, getAllDonations);

export default Router;
