import { Router } from "express";
import * as taskController from "./task.controller.js";
import { authMiddleware } from "../../Middlewares/auth.middleware.js";
import { errorHandling } from "../../Middlewares/error-handle.middleware.js";

const taskRouter = Router();

taskRouter.post(
    "/add-task",
    errorHandling(authMiddleware()),
    errorHandling(taskController.addTask)
);

taskRouter.get(
    "/list-task",
    errorHandling(authMiddleware()),
    errorHandling(taskController.listTask)
);

taskRouter.get(
    "/specific-task/:_id",
    errorHandling(authMiddleware()),
    errorHandling(taskController.specificTask)
);

taskRouter.put(
    "/update-task/:_id",
    errorHandling(authMiddleware()),
    errorHandling(taskController.updatedTask)
);

taskRouter.delete(
    "/delete-task/:_id",
    errorHandling(authMiddleware()),
    errorHandling(taskController.deletedTask)
);

taskRouter.get(
    "/",
    errorHandling(authMiddleware()),
    errorHandling(taskController.allTasksWithPagination)
);

taskRouter.get(
    "/filter",
    errorHandling(authMiddleware()),
    errorHandling(taskController.filteredTask)
);
export default taskRouter;
