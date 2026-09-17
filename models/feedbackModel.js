import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
      required: [true, "Post ID is required"],
    },

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must contain at least 2 characters"]
    },

    description: {
      type: String,
      required: [true, "Feedback description is required"],
      trim: true,
      minlength: [3, "Feedback must contain at least 3 characters"]
    },

    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"]
    },
  },
  {
    timestamps: true,
  }
);

const feedbackModel =
  mongoose.models.Feedback ||
  mongoose.model("Feedback", feedbackSchema);

export default feedbackModel;