import MenuItem from '../models/MenuItem.js';

// @desc   Get all menu items (with optional category filter)
// @route  GET /api/menu
// @access Public
export const getMenuItems = async (req, res, next) => {
  try {
    const { category, search, available } = req.query;
    const query = {};

    if (category && category !== 'all') {
      query.category = category.toLowerCase();
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (available !== undefined) {
      query.available = available === 'true';
    }

    const items = await MenuItem.find(query);

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get single menu item by ID
// @route  GET /api/menu/:id
// @access Public
export const getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Create new menu item
// @route  POST /api/menu
// @access Private (Admin)
export const createMenuItem = async (req, res, next) => {
  try {
    const { name, description, price, category, image, badge, available, featured } = req.body;

    const item = await MenuItem.create({
      name,
      description,
      price: Number(price),
      category: category.toLowerCase(),
      image,
      badge: badge || '',
      available: available !== undefined ? available : true,
      featured: featured || false,
    });

    res.status(201).json({
      success: true,
      data: item,
      message: 'Menu item created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update menu item
// @route  PUT /api/menu/:id
// @access Private (Admin)
export const updateMenuItem = async (req, res, next) => {
  try {
    let item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    if (req.body.category) {
      req.body.category = req.body.category.toLowerCase();
    }

    item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: item,
      message: 'Menu item updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete menu item
// @route  DELETE /api/menu/:id
// @access Private (Admin)
export const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
