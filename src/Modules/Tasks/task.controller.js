import Task from "../../../database/Models/task.model.js";
import ErrorHandlerClass from "../../Utils/error-class.utils.js";

//! ========================================== Add task ========================================== //
const addTask = async (req, res, next) => {
    const { _id: addedBy } = req.authUser;
    const { type, listItems, shared, category } = req.body;
    const taskInstance = new Task({
        type,
        listItems,
        shared,
        category,
        addedBy,
    });
    const task = await taskInstance.save();
    res.status(201).json({
        message: "Task created successfully",
        task,
    });
};

//! ========================================== Get all tasks ========================================== //
const listTask = async (req, res, next) => {
    const tasks = await Task.find();
    if (tasks.length == 0) {
        return next(
            new ErrorHandlerClass(
                "No tasks found",
                404,
                "at listTask controller",
                "Error in listTask controller",
                { tasks }
            )
        );
    }
    res.status(200).json({
        message: "Tasks fetched successfully",
        tasks,
    });
};

//! ========================================== Get task by id ========================================== //
const specificTask = async (req, res, next) => {
    const { _id } = req.params;
    const task = await Task.findById(_id);
    if (!task) {
        return next(
            new ErrorHandlerClass(
                "Task not found",
                404,
                "at specificTask controller",
                "Error in specificTask controller",
                { task }
            )
        );
    }
    res.status(200).json({
        message: "Task fetched successfully",
        task,
    });
};

//! ========================================== Update task ========================================== //
const updatedTask = async (req, res, next) => {
    const { _id } = req.params;
    const { _id: addedBy } = req.authUser;
    const { type, listItems, shared } = req.body;
    const task = await Task.findOneAndUpdate(
        { _id, addedBy },
        { type, listItems, shared, $inc: { version_key: 1 } },
        { new: true }
    );
    if (!task) {
        return next(
            new ErrorHandlerClass(
                "Task not found",
                404,
                "at updatedTask controller",
                "Error in updatedTask controller",
                { task }
            )
        );
    }
    res.status(200).json({
        message: "Task updated successfully",
        task,
    });
};

//! ========================================== Delete task ========================================== //
const deletedTask = async (req, res, next) => {
    const { _id } = req.params;
    const { _id: addedBy } = req.authUser;
    const task = await Task.findOneAndDelete({ _id, addedBy });
    if (!task) {
        return next(
            new ErrorHandlerClass(
                "Task not found",
                404,
                "at deletedTask controller",
                "Error in deletedTask controller",
                { task }
            )
        );
    }
    res.status(200).json({
        message: "Task deleted successfully",
        task,
    });
};

//! ====================================== Pagination ====================================== //
const allTasksWithPagination = async (req, res) => {
    const { page, limit } = req.query;
    const tasks = await Task.find()
        .skip((page - 1) * limit)
        .limit(limit * 1)
        .exec();
    const count = await Task.countDocuments();
    res.status(200).json({
        message: "All tasks retrieved successfully",
        tasks,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
    });
};

//! ====================================== Filtering ====================================== //
const filteredTask = async (req, res, next) => {
    const { shared } = req.query;
    const filter = {};
    if (shared) filter.shared = shared;
    const tasks = await Task.find(filter).populate([
        { path: "addedBy", select: "name email _id" },
    ]);
    if (tasks.length == 0) {
        return next(
            new ErrorHandlerClass(
                "Tasks not found",
                404,
                "at filteredTask controller",
                "Error in filteredTask controller",
                { tasks }
            )
        );
    }
    res.status(200).json({
        message: "Tasks fetched successfully",
        tasks,
    });
};

export {
    addTask,
    listTask,
    specificTask,
    updatedTask,
    deletedTask,
    allTasksWithPagination,
    filteredTask,
};
