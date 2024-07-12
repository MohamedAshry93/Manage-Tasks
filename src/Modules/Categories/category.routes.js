import { Router } from "express";
import * as categoryController from "./category.controller.js";
import { authMiddleware } from "../../Middlewares/auth.middleware.js";
import { errorHandling } from "../../Middlewares/error-handle.middleware.js";

const categoryRouter = Router();

categoryRouter.post(
    "/add-category",
    errorHandling(authMiddleware()),
    errorHandling(categoryController.addCategory)
);

categoryRouter.patch(
    "/update-category/:_id",
    errorHandling(authMiddleware()),
    errorHandling(categoryController.updatedCategory)
);

categoryRouter.delete(
    "/delete-category/:_id",
    errorHandling(authMiddleware()),
    errorHandling(categoryController.deletedCategory)
);

categoryRouter.get(
    "/list-category",
    errorHandling(authMiddleware()),
    errorHandling(categoryController.listCategory)
);

categoryRouter.get(
    "/specific-category/:_id",
    errorHandling(authMiddleware()),
    errorHandling(categoryController.specificCategory)
);

categoryRouter.get(
    "/",
    errorHandling(authMiddleware()),
    errorHandling(categoryController.allCategoriesWithPagination)
);

categoryRouter.get(
    "/filter",
    errorHandling(authMiddleware()),
    errorHandling(categoryController.filteredCategory)
);

export default categoryRouter;
