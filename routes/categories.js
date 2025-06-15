import express from "express";
import { addCategory } from "../controllers/categories.js";
import { adminMiddleware, requireSignin } from "../middlewares/index.js";

const router = express.Router();

router.post("/categories", requireSignin, adminMiddleware, addCategory);
// router.get("/categories", getAllCategories);

export default router;
