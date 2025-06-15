import Note from "../models/notes.js";

const createNote = async (req, res) => {
  try {
    const { title, content, categoryId } = req.body;
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

    const newNote = new Note({
      title,
      content,
      user: userId,
      categoryId,
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
      payload: { message: "Server error" },
    });
  }
};

export { createNote };
