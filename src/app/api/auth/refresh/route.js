
import { cookies } from "next/headers";
import UserModel from '../../../../../Models/User'
import { verify } from "jsonwebtoken"; 
import { generateAccessToken } from "@/app/utils/auth"; 
import connectToDB from "../../../../../configs/db";

export const POST = async (req) => {
  try {
    connectToDB();
    const refreshToken = cookies().get("refresh-token")?.value;
    if (!refreshToken) {
      return Response.json(
        { message: "No refresh token provided!" },
        { status: 401 }
      );
    }

    const user = await UserModel.findOne({ refreshToken });

    if (!user) {
      return Response.json(
        { message: "Invalid refresh token!" },
        { status: 401 }
      );
    }

    try {verify(refreshToken, process.env.RefreshTokenSecretKey);
    } catch (error) {
      return Response.json(
        { message: "Refresh token expired, please log in again." },
        { status: 403 }
      );
    }

    const newAccessToken = generateAccessToken({ email: user.email });
    return Response.json(
      { message: "New access token generated successfully :))" },
      {
        status: 200,
        headers: {
          "Set-Cookie": `token=${newAccessToken};path=/;httpOnly=true;`,
        },
      }
    );
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
};
