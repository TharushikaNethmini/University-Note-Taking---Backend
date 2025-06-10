import express from "express";
import { signin, signup } from "../controllers/auth.js";
// import {
//   isRequestValidated,
//   validateSigninRequest,
//   validateSignupRequest,
// } from "../validators/auth.js";
const router = express.Router();

router.post("/signup", signup);
// router.post("/signup", validateSignupRequest, isRequestValidated, signup);
// router.post("/signin", validateSigninRequest, isRequestValidated, signin);
router.post("/signin", signin);

export default router;