import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must contain at least 2 characters"]
    },

    email: {
      type: String,
      required: [true, "Email  is required"],
      trim: true,
      minlength: [3, "email must contain at least 3 characters"]
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      min: [1, "Message must be at least 1"]
    },
  },
  {
    timestamps: true,
  }
);

const contactModel =
  mongoose.models.Contact ||
  mongoose.model("Contact", contactSchema);

export default contactModel;