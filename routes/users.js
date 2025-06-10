import express from "express";
import {
  getUsers,
} from "../controllers/users.js";
// import { adminMiddleware, requireSignin } from "../middlewares/index.js";

const router = express.Router();

router.get("/users" ,getUsers);
// router.delete("/users", requireSignin, deleteUser);
// router.put(
//   "/users/:id",
//   upload.single("profilePic"),
//   requireSignin,
//   updateUser
// );

export default router;