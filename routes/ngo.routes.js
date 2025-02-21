import { Router } from "express";
import { getAllDonors } from "../controllers/ngo.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import showrequests from "../controllers/requests.controller.js";
import { acceptRequest } from "../controllers/accept.controller.js";

const router = Router();

router.route("/viewalldonors").get(verifyJWT,getAllDonors);
router.route("/getRequests").get(verifyJWT, showrequests);
router.route("/accept").get(verifyJWT, acceptRequest);

export default Router