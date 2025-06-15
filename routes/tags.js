import express from "express";
import { addTag } from "../controllers/tags.js";
import { adminMiddleware, requireSignin } from "../middlewares/index.js";

const router = express.Router();

router.post("/tags", requireSignin, adminMiddleware, addTag);

export default router;
