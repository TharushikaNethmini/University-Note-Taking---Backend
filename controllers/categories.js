import Category from "../models/categories.js";

// Add a new category
const addCategory = async (req, res) => {
  try {
    const { categoryCode, name, description } = req.body;

    // Check for required fields
    if (!categoryCode || !name) {
      return res.status(400).json({
        status: 400,
        message: "categoryCode and name are required",
      });
    }

    // Check for existing categoryCode or name
    const existingCategory = await Category.findOne({
      $or: [{ categoryCode }, { name }],
    });

    if (existingCategory) {
      return res.status(400).json({
        status: 400,
        message: "Category code or name already exists",
      });
    }

    const category = new Category({
      categoryCode,
      name,
      description,
    });

    const savedCategory = await category.save();

    return res.status(200).json({
      status: 200,
      message: "Category created successfully",
      payload: savedCategory,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const { categoryCode, name } = req.query;

    let filter = {};

    if (categoryCode) {
      filter.categoryCode = categoryCode;
    }

    if (name) {
      filter.name = name;
    }

    const categories = await Category.find(filter);

    return res.status(200).json({
      status: 200,
      payload: categories,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

export { addCategory, getCategories };
