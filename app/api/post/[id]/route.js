import connectMongo from "../../../../utils/connectmongo";
import postModel from "../../../../models/postModel";
import path from "path";
import fs from "fs/promises";

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    await connectMongo();

    const deletedPost = await postModel.findByIdAndDelete(id);

    if (!deletedPost) {
      return Response.json(
        {
          message: "Post not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Post deleted successfully",
      data: deletedPost,
    });
  } catch (error) {
    return Response.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectMongo();
    const data = await postModel.findById(id);
    if (!data) {
      return Response.json({
        message: "No Data Found "
      }, { status: 200 })
    }
    return Response.json({
      message: "Post found Successfully",
      data
    }, { status: 200 })

  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 })

  }
}
export async function PATCH(request, { params }) {
  try {
    // Get post ID from URL
    const { id } = await params;

    // Connect to MongoDB
    await connectMongo();

    // Get form data
    const formData = await request.formData();

    // Get updated values
    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const author = formData.get("author");
    const image = formData.get("image");

    // Find existing post
    const existingPost = await postModel.findById(id);

    if (!existingPost) {
      return Response.json(
        {
          success: false,
          message: "Post not found",
        },
        { status: 404 }
      );
    }

    // Object containing updated post data
    const updatedData = {
      title,
      description,
      category,
      author,
    };

    // Check whether a new image was selected
    if (image && image.size > 0) {
      // Get image extension
      const extension = image.name.split(".").pop();

      // Create unique filename
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${extension}`;

      // Physical upload directory
      const uploadDir = path.join(
        process.cwd(),
        "public",
        "uploads"
      );

      // Create directory if it does not exist
      await fs.mkdir(uploadDir, { recursive: true });

      // Convert image to buffer
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Complete physical file path
      const filePath = path.join(uploadDir, fileName);

      // Save new image
      await fs.writeFile(filePath, buffer);

      // Delete old image
      if (existingPost.image) {
        const oldImagePath = path.join(
          process.cwd(),
          "public",
          existingPost.image.replace(/^\/+/, "")
        );

        try {
          await fs.unlink(oldImagePath);
        } catch (error) {
          console.log("Old image could not be deleted:", error.message);
        }
      }

      // Save new image path in MongoDB
      updatedData.image = `/uploads/${fileName}`;
    }

    // Update post in MongoDB
    const updatedPost = await postModel.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    return Response.json(
      {
        success: true,
        message: "Post updated successfully",
        post: updatedPost,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update post",
        error: error.message,
      },
      { status: 500 }
    );
  }
}












