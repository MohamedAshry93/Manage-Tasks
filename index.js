import express from 'express'
import { globalResponse } from './src/Middlewares/error-handle.middleware.js';
import ErrorHandlerClass from './src/Utils/error-class.utils.js';
import { connectionDB } from './database/connection.js';
import userRouter from './src/Modules/Users/user.routes.js';
import categoryRouter from './src/Modules/Categories/category.routes.js';
import taskRouter from './src/Modules/Tasks/task.routes.js';

const app = express()
const port = 3000

app.use(express.json());
app.use("/users", userRouter);
app.use("/categories", categoryRouter);
app.use("/tasks", taskRouter);

connectionDB();
app.use("*", (req, res, next) =>
    next(
        new ErrorHandlerClass(
            `Invalid url ${req.originalUrl}`,
            404,
            "at index.js or modules.routes.js",
            "error in API route",
            "No route found"
        )
    )
);
app.use(globalResponse);
app.listen(port, () => console.log(`Example app listening on port ${port}!`))