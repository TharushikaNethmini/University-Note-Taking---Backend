import express from "express";
import {
  getUsers, deleteUser, updateUser, upload
} from "../controllers/users.js";
import { adminMiddleware, requireSignin } from "../middlewares/index.js";

const router = express.Router();

router.get("/users", requireSignin, adminMiddleware, getUsers);
router.delete("/users", requireSignin, deleteUser);
router.put(
  "/users/:id",
  upload.single("profilePic"),
  updateUser
);

export default router;