import connectToDB from "../../../../../configs/db";
import UserModel from "../../../../../Models/User.js";
import { hashPassword, generateAccessToken } from "@/app/utils/auth";

export async function POST(req) {
  try {
    connectToDB();
    const body = await req.json();
    const { firstName, lastName, userName, email, password, role } = body;

    if (!firstName || !lastName || !userName || !email || !password || !role) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 }
      );
    }

    const allowedRoles = [
      "s",
      "o",
      "m",
    ];

    if (!allowedRoles.includes(role)) {
      return new Response(JSON.stringify({ message: "Invalid role" }), {
        status: 400,
      });
    }

    const isUserExist = await UserModel.findOne({
      $or: [{ email }, { userName }],
    });

    if (isUserExist) {
      return new Response(
        JSON.stringify({ message: "The username or email already exists" }),
        { status: 422 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const accessToken = generateAccessToken({ email });

    await UserModel.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
      role,
    });

    return new Response(
      JSON.stringify({ message: "User signed up successfully :))" }),
      {
        status: 201,
        headers: {
          "Set-Cookie": `token=${accessToken};path=/;httpOnly=true`,
        },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
