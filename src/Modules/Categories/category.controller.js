import Category from "../../../database/Models/category.model.js";
import { errorHandling } from "../../Middlewares/error-handle.middleware.js";
import ErrorHandlerClass from "../../Utils/error-class.utils.js";

//! ========================================== Add category ========================================== //
const addCategory = async (req, res, next) => {
    const { _id: createdBy } = req.authUser;
    const { name } = req.body;
    const categoryInstance = new Category({ name, createdBy });
    const category = await categoryInstance.save();
    res.status(201).json({
        message: "Category created successfully",
        category,
    });
};

//! ====================================== Update category ====================================== //
const updatedCategory = async (req, res, next) => {
    const { _id } = req.params;
    const { _id: createdBy } = req.authUser;
    const { name } = req.body;
    const category = await Category.findOneAndUpdate(
        { _id, createdBy },
        {
            name,
            $inc: { version_key: 1 },
        },
        { new: true }
    );
    if (!category) {
        return next(
            new ErrorHandlerClass(
                "category not found",
                404,
                "at searching for category",
                "Error in update category controller",
                { category }
            )
        );
    }
    res.status(200).json({ message: "category updated successfully", category });
};

//! ====================================== Delete category ====================================== //
const deletedCategory = async (req, res, next) => {
    const { _id } = req.params;
    const category = await Category.findOneAndDelete({ _id });
    if (!category) {
        return next(
            new ErrorHandlerClass(
                "category not found",
                404,
                "at searching for category",
                "Error in delete category controller",
                { category }
            )
        );
    }
    res.status(200).json({ message: "category deleted successfully", category });
};

//! ====================================== Get all category ====================================== //
const listCategory = async (req, res, next) => {
    const categoryList = await Category.find();
    if (categoryList.length == 0) {
        return next(
            new ErrorHandlerClass(
                "categoryList not found",
                404,
                "at searching for category",
                "Error in list category controller",
                { categoryList }
            )
        );
    }
    res.status(200).json({ message: "category list", categoryList });
};

//! ====================================== Get category by Id ====================================== //
const specificCategory = async (req, res, next) => {
    const { _id } = req.params;
    const category = await Category.findById(_id);
    if (!category) {
        return next(
            new ErrorHandlerClass(
                "category not found",
                404,
                "at searching for category",
                "Error in specific category controller",
                { category }
            )
        );
    }
    res
        .status(200)
        .json({ message: "Specific category find successfully", category });
};

//! ====================================== Pagination ====================================== //
const allCategoriesWithPagination = async (req, res) => {
    const { page, limit } = req.query;
    const categories = await Category.find()
        .skip((page - 1) * limit)
        .limit(limit * 1)
        .exec();
    const count = await Category.countDocuments();
    res.status(200).json({
        message: "All categories retrieved successfully",
        categories,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
    });
};

//! ====================================== Filtering ====================================== //
const filteredCategory = async (req, res, next) => {
    const { name } = req.query;
    const filter = {};
    if (name) filter.name = name;
    const categories = await Category.find(filter).populate([
        { path: "createdBy", select: "name email _id" },
    ]);
    if (categories.length == 0) {
        return next(
            new ErrorHandlerClass(
                "categories not found",
                404,
                "at filteredCategory controller",
                "Error in filteredCategory controller",
                { categories }
            )
        );
    }
    res.status(200).json({
        message: "categories fetched successfully",
        categories,
    });
};

export {
    addCategory,
    updatedCategory,
    deletedCategory,
    listCategory,
    specificCategory,
    allCategoriesWithPagination,
    filteredCategory,
};
