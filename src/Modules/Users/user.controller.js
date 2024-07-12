import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../../database/Models/user.model.js";
import ErrorHandlerClass from "../../Utils/error-class.utils.js";
import { sendEmailService } from "../../Services/send-email.service.js";
import Category from "../../../database/Models/category.model.js";
import Task from "../../../database/Models/task.model.js";

//! ========================================== Registration ========================================== //
const signUp = async (req, res, next) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const userInstance = new User({
        name,
        email,
        password: hashedPassword,
    });
    const token = jwt.sign(
        {
            userId: userInstance._id,
            name: userInstance.name,
            email: userInstance.email,
        },
        "confirmationLinkToken",
        { expiresIn: "1h" }
    );
    const confirmationLink = `${req.protocol}://${req.headers.host}/users/verify-email/${token}`;
    const isEmailSent = await sendEmailService(
        email,
        "Welcome to Our App - Verify your email address",
        "Please verify your email address",
        `<a href=${confirmationLink}>Please verify your email address</a>`
    );
    if (!isEmailSent) {
        return next(
            new ErrorHandlerClass(
                "Verification sending email is failed, please try again",
                400,
                "at checking isEmailSent",
                "Error in signUp controller",
                { email }
            )
        );
    }
    const user = await userInstance.save();
    res.status(201).json({
        message: "User created successfully",
        userData: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
    });
};

//! ============================================= Verify email ============================================= //
const verifyEmail = async (req, res, next) => {
    const { token } = req.params;
    const decodedData = jwt.verify(token, "confirmationLinkToken");
    if (!decodedData?.userId) {
        return next(
            new ErrorHandlerClass(
                "Invalid token payload",
                401,
                "at verify decodedData",
                "Error in verifyEmail controller",
                { token }
            )
        );
    }
    const confirmedUser = await User.findOneAndUpdate(
        {
            _id: decodedData?.userId,
            verified: false,
        },
        { verified: true },
        { new: true }
    );
    if (!confirmedUser) {
        return next(
            new ErrorHandlerClass(
                "Invalid verification link",
                404,
                "at checking confirmedUser",
                "Error in verifyEmail controller",
                { token }
            )
        );
    }
    res
        .status(200)
        .json({ message: "Email verified successfully", confirmedUser });
};

//! ============================================= Login ============================================= //
const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        console.log(user);
        return next(
            new ErrorHandlerClass(
                "Invalid Login credentials",
                404,
                "at checking user",
                "Error in signIn controller"
            )
        );
    }
    if (!bcrypt.compareSync(password, user.password)) {
        return next(
            new ErrorHandlerClass(
                "Invalid Login credentials",
                401,
                "at comparing password",
                "Error in signIn controller"
            )
        );
    }
    const token = jwt.sign(
        {
            userId: user._id,
            name: user.name,
            email: user.email,
        },
        "accessTokenSignature",
        { expiresIn: "1h" }
    );
    (user.status = "online"), await user.save();
    res.status(200).json({ message: "User logIn successfully", token });
};

//! ============================================= Update user =============================================//
const updatedAccount = async (req, res, next) => {
    const { name, email } = req.body;
    const { _id } = req.authUser;
    const user = await User.findOneAndUpdate(
        _id,
        {
            name,
            email,
            $inc: { version_key: 1 },
        },
        { new: true }
    );
    if (email) {
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
            },
            "confirmationLinkToken",
            { expiresIn: "1h" }
        );
        const confirmationLink = `${req.protocol}://${req.headers.host}/users/verify-email/${token}`;
        const isEmailSent = await sendEmailService(
            email,
            "Welcome to Our App - Verify your email address",
            "Please verify your email address",
            `<a href=${confirmationLink}>Please verify your email address</a>`
        );
        if (!isEmailSent) {
            return next(
                new ErrorHandlerClass(
                    "Verification sending email is failed, please try again",
                    400,
                    "at checking isEmailSent",
                    "Error in updatedAccount controller",
                    { email }
                )
            );
        }
    }
    res.status(200).json({
        message: "User updated successfully",
        userData: {
            id: user._id,
            name: user.name,
            verified: user.verified,
        },
    });
};

//! ============================================= Delete user =============================================//
const deletedAccount = async (req, res, next) => {
    const { _id } = req.authUser;
    const user = await User.findById(_id);
    await Category.findOneAndDelete({ createdBy: _id });
    await Task.findOneAndDelete({ addedBy: _id });
    await User.findByIdAndDelete(_id);
    if (!user) {
        return next(
            new ErrorHandlerClass(
                "User not found",
                404,
                "at checking user",
                "Error in deletedAccount controller",
                { user }
            )
        );
    }
    res
        .status(200)
        .json({
            message: "User deleted successfully",
            userData: { id: user._id, name: user.name, email: user.email },
        });
};
export { signUp, verifyEmail, signIn, updatedAccount,deletedAccount };
