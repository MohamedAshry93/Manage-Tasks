import mongoose from "mongoose";

const { Schema, model } = mongoose;

const categorySchema = new Schema(
    {
        name: { type: String, required: true },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true, versionKey: "version_key" }
);

export default mongoose.models.Category || model("Category", categorySchema);
