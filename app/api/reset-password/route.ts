import crypto from "crypto";
import axios from "axios";

const keycloakTokenUrl = `${process.env.NEXT_PUBLIC_KEYCLOAK_HOST_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/token`;
const keycloakUsersUrl = `${process.env.NEXT_PUBLIC_KEYCLOAK_HOST_URL}/admin/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/users`;

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

    const body = await req.json();
    const { token, password } = body;

    console.log("Token:", token);
    console.log("Password:", password);

    if (!token || !password) {
      return new Response(
        JSON.stringify({ error: "Token and password are required." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Decode the token
    const [encryptedToken, ivHex, keyHex] = token.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const key = Buffer.from(keyHex, "hex");

    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decryptedToken = decipher.update(encryptedToken, "hex", "utf8");
    decryptedToken += decipher.final("utf8");

    console.log("Decrypted token:", decryptedToken);


    const adminToken = decryptedToken;

    // Use the decrypted token to find the user and reset the password
    const userId = await getUserIdFromToken(decryptedToken, adminToken);

    console.log("User ID:", userId);

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Update the password in Keycloak
    await axios.put(
      `${keycloakUsersUrl}/${userId}/reset-password`,
      {
        type: "password",
        value: password,
        temporary: false,
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return new Response(
      JSON.stringify({ message: "Password reset successfully." }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to reset password. Please try again later.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

async function getUserIdFromToken(decryptedToken: string, adminToken: string) {
  try {
    const userInfo = await axios.get(keycloakUsersUrl, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    const users = userInfo.data;

    const user = users.find(
      (u: { attributes: { resetToken: string[] } }) =>
        u.attributes?.resetToken?.[0] === decryptedToken
    );

    return user?.id || null;
  } catch (error) {
    console.error("Error fetching user ID from token:", error);
    return null;
  }
}
