import Category from '../models/Category.js';

// @desc   Get all categories
// @route  GET /api/categories
// @access Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Create category
// @route  POST /api/categories
// @access Private (Admin)
export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const category = await Category.create({ name, description });
    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update category
// @route  PUT /api/categories/:id
// @access Private (Admin)
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({
      success: true,
      data: category,
      message: 'Category updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete category
// @route  DELETE /api/categories/:id
// @access Private (Admin)
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    await category.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
