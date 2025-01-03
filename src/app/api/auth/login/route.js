import {
  generateAccessToken,
  generateRefreshToken,
  verifyPassword,
} from "@/app/utils/auth";
import connectToDB from "../../../../../configs/db";
import UserModel from "../../../../../Models/User";

export async function POST(req) {
  try {
    connectToDB();
    const body = await req.json();
    const { userName, password } = body;

    const user = await UserModel.findOne({ userName });

    if (!user) {
      return Response.json({ message: "user not found" }, { status: 422 });
    }

    const isCorrectPasswordWithHash =await verifyPassword(password, user.password);

    if (!isCorrectPasswordWithHash) {
      return Response.json(
        { message: "userName or password is not correct" },
        { status: 401 } 
      );
    }

    const accessToken = generateAccessToken({ userName });
    const refreshToken = generateRefreshToken({ userName });

    await UserModel.findOneAndUpdate(
      { userName },
      {
        $set: {
          refreshToken,
        },
      }
    );

    const headers = new Headers();

    headers.append("Set-Cookie", `token=${accessToken};path=/;httpOnly=true`);
    headers.append(
      "Set-Cookie",
      `refresh-token=${refreshToken};path=/;httpOnly=true;`
    );
    return Response.json(
      { message: "User logged in successfully :))",refresh:refreshToken,access:accessToken },
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
