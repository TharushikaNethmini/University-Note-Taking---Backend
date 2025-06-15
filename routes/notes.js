import express from "express";
import { createNote, getNotes } from "../controllers/Notes.js";
import { requireSignin } from "../middlewares/index.js";

const router = express.Router();

router.post("/notes/:userId", requireSignin, createNote);
router.get("/notes", requireSignin, getNotes);

export default router;
