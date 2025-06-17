import Note from "../models/notes.js";
import Category from "../models/categories.js";
import Tag from "../models/tags.js";
import User from "../models/user.js";

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

    if (req.query.id) {
      if (!req.query.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res
          .status(400)
          .json({ status: 400, message: "Invalid note id format" });
      }
      filter._id = req.query.id;
    }

    if (req.query.user) {
      filter.user = req.query.user;
    }

    if (req.query.categoryId) {
      filter.categoryId = req.query.categoryId;
    }

    if (req.query.tagId) {
      filter.tagId = req.query.tagId;
    }

    if (req.query.title) {
      filter.title = { $regex: req.query.title, $options: "i" };
    }

    if (req.query.description) {
      filter.description = { $regex: req.query.description, $options: "i" };
    }

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    const totalNotes = await Note.countDocuments(filter);

    const totalPages = Math.ceil(totalNotes / size);

    const notes = await Note.find(filter)
      .populate("categoryId")
      .populate("tagId")
      .populate("user", "username email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * size)
      .limit(size);

    return res.status(200).json({
      status: 200,
      payload: {
        totalNotes,
        currentPage: page,
        totalPages,
        notes,
      },
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

const deleteNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;

    if (!noteId || !mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({
        status: "error",
        payload: { message: "Invalid or missing noteId" },
      });
    }

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({
        status: "error",
        payload: { message: "Note not found" },
      });
    }

    await Note.findByIdAndDelete(noteId);

    res.status(200).json({
      status: "success",
      payload: { message: "Note deleted successfully" },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      payload: { message: "Internal server error" },
    });
  }
};

const deleteAllNotes = async (req, res) => {
  try {
    await Note.deleteMany({});

    res.status(200).json({
      status: "success",
      payload: { message: "All notes deleted successfully" },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      payload: { message: "Internal server error" },
    });
  }
};

const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ status: 400, message: "Invalid note ID" });
    }

    const existingNote = await Note.findById(noteId);
    if (!existingNote) {
      return res.status(404).json({ status: 404, message: "Note not found" });
    }

    const { title, description, categoryId, tagId, user } = req.body;

    if (title !== undefined && typeof title !== "string") {
      return res
        .status(400)
        .json({ status: 400, message: "Title must be a string" });
    }

    if (description !== undefined && typeof description !== "string") {
      return res
        .status(400)
        .json({ status: 400, message: "Description must be a string" });
    }

    if (categoryId !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res
          .status(400)
          .json({ status: 400, message: "Invalid categoryId" });
      }
      const categoryExists = await Category.findById(categoryId);
      if (!categoryExists) {
        return res
          .status(404)
          .json({ status: 404, message: "Category not found" });
      }
    }

    if (tagId !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(tagId)) {
        return res.status(400).json({ status: 400, message: "Invalid tagId" });
      }
      const tagExists = await Tag.findById(tagId);
      if (!tagExists) {
        return res.status(404).json({ status: 404, message: "Tag not found" });
      }
    }

    if (user !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(user)) {
        return res
          .status(400)
          .json({ status: 400, message: "Invalid user ID" });
      }
      const userExists = await User.findById(user);
      if (!userExists) {
        return res.status(404).json({ status: 404, message: "User not found" });
      }
    }

    const updatedFields = {};
    if (title !== undefined) updatedFields.title = title;
    if (description !== undefined) updatedFields.description = description;
    if (categoryId !== undefined) updatedFields.categoryId = categoryId;
    if (tagId !== undefined) updatedFields.tagId = tagId;
    if (user !== undefined) updatedFields.user = user;

    const updatedNote = await Note.findByIdAndUpdate(noteId, updatedFields, {
      new: true,
    });

    return res.status(200).json({
      status: 200,
      message: "Note updated successfully",
      payload: updatedNote,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Failed to update note",
      error: error.message,
    });
  }
};

export { createNote, getNotes, deleteNoteById, deleteAllNotes, updateNote };
