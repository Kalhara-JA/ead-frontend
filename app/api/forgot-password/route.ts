import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import crypto from "crypto";
import axios from "axios";

const keycloakTokenUrl = `${process.env.NEXT_PUBLIC_KEYCLOAK_HOST_URL}/realms/store/protocol/openid-connect/token`;

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return new Response(
        JSON.stringify({ error: "Invalid content type. Expected JSON." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const body = await req.json(); // Parse the JSON body
    const { email } = body;

    console.log("Email:", email);

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get the Keycloak admin token
    const keycloakResponse = await axios.post(
      keycloakTokenUrl,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "",
        client_secret: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET || "",
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const keycloakToken = keycloakResponse.data.access_token;

    // Encrypt the token
    const algorithm = "aes-256-cbc";
    const encryptionKey = crypto.randomBytes(32); // Generate a 32-byte key
    const iv = crypto.randomBytes(16); // Initialization vector

    const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);
    let encryptedToken = cipher.update(keycloakToken, "utf8", "hex");
    encryptedToken += cipher.final("hex");

    const tokenPackage = `${encryptedToken}:${iv.toString(
      "hex"
    )}:${encryptionKey.toString("hex")}`;

    // Generate the reset link
    const resetUrl = `${
      process.env.NEXT_PUBLIC_APP_URL
    }/auth/reset-password?token=${encodeURIComponent(tokenPackage)}`;

    console.log("Reset URL:", resetUrl);
    // Send the email with NodeMailer
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525, // Convert to number if stored as a string
      auth: {
        user: "f1ae3f4cd9129c",
        pass: "7a5977b1392262",
      },
    } as SMTPTransport.Options);

    await transporter.sendMail({
      from: `"Shop Us" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>You have requested to reset your password. Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    return new Response(
      JSON.stringify({ message: "Reset link sent successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending reset email:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to send reset email. Please try again later.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
