
import connectMongo from "../../../../utils/connectmongo";
import feedbackModel from "../../../../models/feedbackModel";
import "../../../../models/postModel";

export async function GET() {
  try {
    await connectMongo();

    const recentFeedbacks = await feedbackModel
      .find({})
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .populate({
        path: "postId",
        select:
          "title description image category author",
      })
      .lean();

    return Response.json({
      success: true,
      count: recentFeedbacks.length,
      feedbacks: recentFeedbacks,
    });
  } catch (error) {

    return Response.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}