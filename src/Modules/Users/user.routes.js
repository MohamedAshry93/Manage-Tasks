import { Router } from "express";
import * as userController from "./user.controller.js";
import { errorHandling } from "../../Middlewares/error-handle.middleware.js";
import { checkDataExist } from "../../Middlewares/checkData.middleware.js";
import { authMiddleware } from "../../Middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post(
    "/signup",
    errorHandling(checkDataExist),
    errorHandling(userController.signUp)
);

userRouter.get(
    "/verify-email/:token",
    errorHandling(userController.verifyEmail)
);

userRouter.post("/login", errorHandling(userController.signIn));

userRouter.put(
    "/update-user",
    errorHandling(authMiddleware()),
    errorHandling(checkDataExist),
    errorHandling(userController.updatedAccount)
);

userRouter.delete(
    "/delete-user",
    errorHandling(authMiddleware()),
    errorHandling(userController.deletedAccount)
);

export default userRouter;
