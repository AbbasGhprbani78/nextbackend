import { hash } from "bcryptjs";
import connectToDB from "../../../../../configs/db";
import UserModel from "../../../../../Models/User";

export const POST = async (req) => {
  try {
    const { email, resetCode, newPassword } = await req.json();
    connectToDB();

    const user = await UserModel.findOne({ email });
    if (!user) {
      return Response.json({ message: "User not found!" }, { status: 404 });
    }

    if (user.resetCode !== resetCode || user.resetCodeExpiration < Date.now()) {
      return Response.json(
        { message: "Invalid or expired reset code." },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetCode = undefined;
    user.resetCodeExpiration = undefined;
    await user.save();

    return Response.json(
      { message: "Password updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: "Failed to reset password.", error: error.message },
      { status: 500 }
    );
  }
};
