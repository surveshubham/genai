// src/routes/api/v1/auth.routes.js
import { Router } from "express";
import { signup, signin, signout, me } from "../../../controllers/auth.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.get("/me", me);

export default router;
