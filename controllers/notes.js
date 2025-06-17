import Note from "../models/notes.js";
import Category from "../models/categories.js";
import Tag from "../models/tags.js";

import mongoose from "mongoose";

const createNote = async (req, res) => {
  try {
    const { title, content, categoryId, tagId } = req.body;
    const { userId } = req.params;

    if (!title || !content) {
      return res.status(400).json({
        status: "error",
        payload: { message: "Title and content are required" },
      });
    }

    if (!categoryId) {
      return res.status(400).json({
        status: "error",
        payload: { message: "categoryId is required" },
      });
    }

    if (!tagId) {
      return res.status(400).json({
        status: "error",
        payload: { message: "tagId is required" },
      });
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        status: "error",
        payload: { message: "Invalid categoryId format" },
      });
    }

    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({
        status: "error",
        payload: { message: "Category not found" },
      });
    }

    if (!mongoose.Types.ObjectId.isValid(tagId)) {
      return res.status(400).json({
        status: "error",
        payload: { message: "Invalid tagId format" },
      });
    }

    const tagExists = await Tag.findById(tagId);
    if (!tagExists) {
      return res.status(404).json({
        status: "error",
        payload: { message: "Tag not found" },
      });
    }

    const newNote = new Note({
      title,
      content,
      user: userId,
      categoryId,
      tagId,
    });

    const savedNote = await newNote.save();

    res.status(200).json({
      status: 200,
      payload: savedNote,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      payload: { message: "Internal Server Error", error: error.message },
    });
  }
};

const getNotes = async (req, res) => {
  try {
    const filter = {};

    if (req.query.user) {
      filter.user = req.query.user;
    }
    if (req.query.categoryId) {
      filter.categoryId = req.query.categoryId;
    }

    const notes = await Note.find(filter)
      .populate("categoryId")
      .populate("tagId")
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: 200,
      payload: notes,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Failed to fetch notes",
      error: error.message,
    });
  }
};

export { createNote, getNotes };
