import express from "express";
import {
  addCategory,
  deleteCategory,
  getCategories,
} from "../controllers/categories.js";
import { adminMiddleware, requireSignin } from "../middlewares/index.js";

const router = express.Router();

router.post("/categories", requireSignin, adminMiddleware, addCategory);
router.get("/categories", requireSignin, getCategories);
router.delete(
  "/categories/:id",
  requireSignin,
  adminMiddleware,
  deleteCategory
);

export default router;
