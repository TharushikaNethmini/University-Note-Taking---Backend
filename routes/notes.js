import express from "express";
import { createNote } from "../controllers/Notes.js";
import { requireSignin } from "../middlewares/index.js";

const router = express.Router();

router.post("/notes/:userId", requireSignin, createNote);

export default router;
