import connectMongo from "../../../../utils/connectmongo"
import contactModel from "../../../../models/contactModel"

export async function POST(req) {
    try {
        const body = await req.json();
        await connectMongo();
        const postData = await contactModel.create({
            name: body?.name,
            email: body?.email,
            message: body?.message
        })
        if(!postData)
        {
            return Response.json({message:" There is some issue in posting data"},{status:400})
        }
        return Response.json({
            message: 'Data posted successfully'
        });
    } catch (error) {
        return Response.json({
            message: 'error.message'
        }, { status: 500 });
    }
}