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

export { addTag, getTags };
