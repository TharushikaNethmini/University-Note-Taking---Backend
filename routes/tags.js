import express from "express";
import { addTag, getTags, updateTag } from "../controllers/tags.js";
import { adminMiddleware, requireSignin } from "../middlewares/index.js";

const router = express.Router();

router.post("/tags", requireSignin, adminMiddleware, addTag);
router.get("/tags", requireSignin, getTags);
router.put("/tags/:id", requireSignin, adminMiddleware, updateTag);

export default router;
