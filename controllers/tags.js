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

    // Check for duplicates
    const existingTag = await Tag.findOne({
      $or: [{ tagCode }, { name }, { colorCode }],
    });

    if (existingTag) {
      return res.status(400).json({
        status: 400,
        message: "Tag with same tagCode, name or colorCode already exists",
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

export { addTag };
