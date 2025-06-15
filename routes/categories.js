import express from "express";
import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
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
router.put("/categories/:id", requireSignin, adminMiddleware, updateCategory);

export default router;
