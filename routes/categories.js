import express from "express";
import { addCategory, getCategories } from "../controllers/categories.js";
import { adminMiddleware, requireSignin } from "../middlewares/index.js";

const router = express.Router();

router.post("/categories", requireSignin, adminMiddleware, addCategory);
router.get("/categories", requireSignin, getCategories);

export default router;
