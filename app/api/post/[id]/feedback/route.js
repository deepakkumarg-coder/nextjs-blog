import mongoose from "mongoose";
import connectMongo from "../../../../../utils/connectmongo";
import postModel from "../../../../../models/postModel";
import feedbackModel from "../../../../../models/feedbackModel";

export async function POST(req, { params }) {
  try {
    const { id } = await params;

    // Check whether the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid post ID",
        },
        {
          status: 400,
        }
      );
    }

    // Connect to MongoDB
    await connectMongo();

    // Check whether the post exists
    // const post = await postModel.findById(id);

    // if (!post) {
    //   return Response.json(
    //     {
    //       success: false,
    //       message: "Post not found",
    //     },
    //     {
    //       status: 404,
    //     }
    //   );
    // }

    // Read request body
    const body = await req.json();

    const {
      postId,
      name,
      description,
      rating,
    } = body;

    // Validate required fields
    if (!postId || !name || !description || rating === undefined) {
      return Response.json(
        {
          success: false,
          message: "postId, name, description and rating are required",
        },
        {
          status: 400,
        }
      );
    }

    // Make sure the body postId matches the URL ID
    if (postId !== id) {
      return Response.json(
        {
          success: false,
          message: "Post ID does not match the URL ID",
        },
        {
          status: 400,
        }
      );
    }

    // Validate rating
    if (!Number.isInteger(Number(rating)) || rating < 1 || rating > 5) {
      return Response.json(
        {
          success: false,
          message: "Rating must be a number between 1 and 5",
        },
        {
          status: 400,
        }
      );
    }

    // Create feedback
    const newFeedback = await feedbackModel.create({
      postId: id,
      name: name.trim(),
      description: description.trim(),
      rating: Number(rating),
    });

    return Response.json(
      {
        success: true,
        message: "Feedback submitted successfully",
        data: newFeedback,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Feedback POST error:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      return Response.json(
        {
          success: false,
          message: "Validation failed",
          errors: Object.values(error.errors).map(
            (item) => item.message
          ),
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}