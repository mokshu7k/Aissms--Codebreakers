import { Router } from "express";
import {
    handleLogin,
    handleRegister,
} from "../controllers/auth.controllers.js";

const router = Router();

router.route("/login").post(handleLogin);
router.route("/register").post(handleRegister);

export default router;
