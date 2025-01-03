import nodemailer from "nodemailer";
import connectToDB from "../../../../../configs/db";
import UserModel from "../../../../../Models/User";

export const POST = async (req) => {
  try {
    const body = await req.json();
    connectToDB();
    const { email } = body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found!" }), {
        status: 404,
      });
    }

    const generateRandomCode = () => {
      return Math.floor(100000 + Math.random() * 900000);
    };

    const resetCode = generateRandomCode();

    user.resetCode = resetCode;
    user.resetCodeExpiration = Date.now() + 10 * 60 * 1000; 
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Code",
        text: `Your password reset code is: ${resetCode}`,
      });
      return new Response(
        JSON.stringify({ message: "Reset code sent to your email!" }),
        { status: 200 }
      );
    } catch (mailError) {
      console.error("Error sending email:", mailError);
      return new Response(JSON.stringify({ message: "Failed to send email" }), {
        status: 500,
      });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
};
