
import { verifyAccessToken } from "@/app/utils/auth"; 
import { cookies } from "next/headers";
import UserModel from '../../../../../Models/User'
import connectToDB from "../../../../../configs/db";

export async function GET(req) {
  connectToDB();
  const token = cookies().get("token");
  let user = null;

  if (token) {
    const tokenPayload = verifyAccessToken(token.value);
    if (tokenPayload) {
      user = await UserModel.findOne(
        { userName: tokenPayload.userName },
        "-password -refreshToken -__v"
      );
    }
    
    return Response.json(user);
  } else {
    return Response.json(
      {
        data: null,
        message: "Not access !!",
      },
      { status: 401 }
    );
  }
}
