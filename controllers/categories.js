import Category from "../models/categories.js";

const addCategory = async (req, res) => {
  try {
    const { categoryCode, name, description } = req.body;

    if (!categoryCode || !name) {
      return res.status(400).json({
        status: 400,
        message: "categoryCode and name are required",
      });
    }

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

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const deletedCategory = await Category.findByIdAndDelete(id);

      if (!deletedCategory) {
        return res.status(404).json({
          status: 404,
          message: `Category with id '${id}' not found`,
        });
      }

      return res.status(200).json({
        status: 200,
        message: `Category with id '${id}' deleted successfully`,
        payload: deletedCategory,
      });
    } else {
      const result = await Category.deleteMany({});
      return res.status(200).json({
        status: 200,
        message: "All categories deleted successfully",
        payload: {
          deletedCount: result.deletedCount,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Failed to delete category(ies)",
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryCode, name } = req.body;

    if (categoryCode) {
      const existingCategoryCode = await Category.findOne({
        categoryCode,
        _id: { $ne: id },
      });

      if (existingCategoryCode) {
        return res.status(400).json({
          status: 400,
          message: "Category code already exists",
        });
      }
    }

    if (name) {
      const existingCategoryName = await Category.findOne({
        name,
        _id: { $ne: id },
      });

      if (existingCategoryName) {
        return res.status(400).json({
          status: 400,
          message: "Category name already exists",
        });
      }
    }

    const updatedFields = {
      ...req.body,
    };

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updatedFields,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        status: 404,
        message: `Category with id '${id}' not found`,
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Category updated successfully",
      payload: updatedCategory,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Failed to update category",
      error: error.message,
    });
  }
};

export { addCategory, getCategories, deleteCategory, updateCategory };
