import connectMongo from "../../../utils/connectmongo"
import postModel from "../../../models/postModel"
import fs from "fs/promises";
import path from "path";


export async function GET(req) {
    try {
        const type = req.nextUrl.searchParams.get('type');
        await connectMongo();
        const getData = await postModel.find({})
        return Response.json({
            message: getData
        });
    } catch (error) {
        return Response.json({
            message: 'error.message'
        }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectMongo();

        const formData = await request.formData();

        const title = formData.get("title");
        const description = formData.get("description");
        const category = formData.get("category");
        const author = formData.get("author");
        const image = formData.get("image");

        // Check image
        if (!image || image.size === 0) {
            return Response.json(
                {
                    success: false,
                    message: "Image is required",
                },
                { status: 400 }
            );
        }

        // Create unique filename
        const extension = image.name.split(".").pop();

        const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}.${extension}`;

        // Path to public/uploads
        const uploadDir = path.join(process.cwd(), "public", "uploads");

        // Create uploads folder if it doesn't exist
        await fs.mkdir(uploadDir, { recursive: true });

        // Convert image to buffer
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Save image
        const filePath = path.join(uploadDir, fileName);

        await fs.writeFile(filePath, buffer);

        // URL that browser can access
        const imageUrl = `/uploads/${fileName}`;

        // Save post in MongoDB
        const post = await postModel.create({
            title,
            description,
            image: imageUrl,
            category,
            author,
        });

        return Response.json({
            success: true,
            message: "Post created successfully",
            post,
        });
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Failed to create post",
            },
            { status: 500 }
        );
    }
}