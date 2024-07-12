import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        verified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true, versionKey: "version_key" }
);

export default mongoose.models.User || model("User", userSchema);
