import express from "express";
import {
  createNote,
  deleteAllNotes,
  deleteNoteById,
  getNotes,
  updateNote,
} from "../controllers/Notes.js";
import { adminMiddleware, requireSignin } from "../middlewares/index.js";

const router = express.Router();

router.post("/notes/:userId", requireSignin, createNote);
router.get("/notes", requireSignin, getNotes);
router.put("/notes/:noteId", requireSignin, updateNote);
router.delete("/notes/:noteId", requireSignin, deleteNoteById);
router.delete("/notes", requireSignin, adminMiddleware, deleteAllNotes);

export default router;
