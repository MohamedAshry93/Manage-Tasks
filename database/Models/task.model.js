import mongoose from "mongoose";

const { Schema, model } = mongoose;

const taskSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["text", "list"],
            required: true,
        },
        listItems: [{ text: String }],
        shared: {
            type: String,
            enum: ["public", "private"],
            default: "public",
        },
        category: {
            type: mongoose.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        addedBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true, versionKey: "version_key" }
);

export default mongoose.models.Task || model("Task", taskSchema);
