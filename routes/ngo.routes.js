import { Router } from "express";
import { getAllDonors } from "../controllers/ngo.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/viewalldonors").get(verifyJWT,getAllDonors)

export default Router