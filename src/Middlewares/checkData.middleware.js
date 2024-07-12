import User from "../../database/Models/user.model.js";
import ErrorHandlerClass from "../Utils/error-class.utils.js";

const checkDataExist = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        return next(
            new ErrorHandlerClass(
                "User already exists",
                400,
                "at checkDataExist API",
                "Error in checkData middleware",
                {email}
            )
        );
    }
    next();
};

export { checkDataExist };
