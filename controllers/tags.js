import Tag from "../models/tags.js";

const addTag = async (req, res) => {
  try {
    const { tagCode, name, colorCode } = req.body;

    if (!tagCode || !name || !colorCode) {
      return res.status(400).json({
        status: 400,
        message: "tagCode, name and colorCode are required",
      });
    }

    const existingTagByCode = await Tag.findOne({ tagCode });
    if (existingTagByCode) {
      return res.status(400).json({
        status: 400,
        message: "Tag with the same tagCode already exists",
      });
    }

    const existingTagByName = await Tag.findOne({ name });
    if (existingTagByName) {
      return res.status(400).json({
        status: 400,
        message: "Tag with the same name already exists",
      });
    }

    const existingTagByColorCode = await Tag.findOne({ colorCode });
    if (existingTagByColorCode) {
      return res.status(400).json({
        status: 400,
        message: "Tag with the same colorCode already exists",
      });
    }

    const newTag = new Tag({ tagCode, name, colorCode });

    const savedTag = await newTag.save();

    return res.status(200).json({
      status: 200,
      message: "Tag created successfully",
      payload: savedTag,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Server error",
      error: error.message,
    });
  }
};

const getTags = async (req, res) => {
  try {
    const filter = {};

    if (req.query.tagCode) {
      filter.tagCode = req.query.tagCode;
    }
    if (req.query.name) {
      filter.name = req.query.name;
    }

    const tags = await Tag.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      status: 200,
      payload: tags,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Failed to fetch tags",
      error: error.message,
    });
  }
};

const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { tagCode, name, colorCode } = req.body;

    if (!id) {
      return res.status(400).json({
        status: 400,
        message: "Tag ID is required in the URL",
      });
    }

    if (tagCode) {
      const existingTagByCode = await Tag.findOne({ tagCode });
      if (existingTagByCode && existingTagByCode._id.toString() !== id) {
        return res.status(400).json({
          status: 400,
          message: "Tag with the same tagCode already exists",
        });
      }
    }

    if (name) {
      const existingTagByName = await Tag.findOne({ name });
      if (existingTagByName && existingTagByName._id.toString() !== id) {
        return res.status(400).json({
          status: 400,
          message: "Tag with the same name already exists",
        });
      }
    }

    if (colorCode) {
      const existingTagByColorCode = await Tag.findOne({ colorCode });
      if (
        existingTagByColorCode &&
        existingTagByColorCode._id.toString() !== id
      ) {
        return res.status(400).json({
          status: 400,
          message: "Tag with the same colorCode already exists",
        });
      }
    }

    const updatedTag = await Tag.findByIdAndUpdate(
      id,
      { tagCode, name, colorCode },
      { new: true, runValidators: true }
    );

    if (!updatedTag) {
      return res.status(404).json({
        status: 404,
        message: "Tag not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Tag updated successfully",
      payload: updatedTag,
    });
  } catch (error) {
    console.error("Error updating tag:", error);
    res.status(500).json({
      status: 500,
      message: "Server error while updating tag",
      error: error.message,
    });
  }
};

export { addTag, getTags, updateTag };
