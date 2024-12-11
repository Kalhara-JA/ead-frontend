import crypto from "crypto";
import axios from "axios";

const keycloakTokenUrl = `${process.env.NEXT_PUBLIC_KEYCLOAK_HOST_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/token`;
const keycloakUsersUrl = `${process.env.NEXT_PUBLIC_KEYCLOAK_HOST_URL}/admin/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/users`;

export async function POST(req: Request) {
  try {
    // Check Content-Type
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return new Response(
        JSON.stringify({ error: "Invalid content type. Expected JSON." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse body
    const body = await req.json();
    const { token, password } = body;

    if (!token || !password) {
      return new Response(
        JSON.stringify({ error: "Token and password are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // console.log("Token:", token);

    // Split token into encrypted payload and IV
    const [encryptedPayload, ivBase64] = token.split(":");
    if (!encryptedPayload || !ivBase64) {
      return new Response(JSON.stringify({ error: "Invalid token format." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Decrypt token
    const algorithm = "aes-256-cbc";
    const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY!, "hex");
    const iv = Buffer.from(ivBase64, "hex");

    if (iv.length !== 16) {
      return new Response(
        JSON.stringify({ error: "Invalid IV length in token." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let decryptedPayload: string;
    try {
      const decipher = crypto.createDecipheriv(algorithm, encryptionKey, iv);
      decryptedPayload = decipher.update(encryptedPayload, "hex", "utf8");
      decryptedPayload += decipher.final("utf8");
    } catch (error) {
      console.error("Decryption error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to decrypt token." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse decrypted payload
    const { email } = JSON.parse(decryptedPayload);
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Decrypted token is missing email." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // console.log("Decrypted email:", email);

    // Fetch Keycloak admin token
    let adminToken: string;
    try {
      const adminResponse = await axios.post(
        keycloakTokenUrl,
        new URLSearchParams({
          grant_type: "password",
          client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "",
          client_secret: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET || "",
          username: process.env.NEXT_PUBLIC_KEYCLOAK_ADMIN_USERNAME || "",
          password: process.env.NEXT_PUBLIC_KEYCLOAK_ADMIN_PASSWORD || "",
          scope: "openid roles",
        }).toString(),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      adminToken = adminResponse.data.access_token;
    } catch (error) {
      console.error("Keycloak admin token fetch error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch Keycloak admin token." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // console.log("Admin token fetched successfully." , adminToken);

    // Fetch user by email
    let user;
    try {
      const usersResponse = await axios.get(keycloakUsersUrl, {
        headers: { Authorization: `Bearer ${adminToken}` },
        params: { email },
      });

    //   console.log("Users fetched successfully." , usersResponse.data);

      const users = usersResponse.data;
      if (users.length === 0) {
        return new Response(JSON.stringify({ error: "User not found." }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      user = users[0];
    } catch (error) {
      console.error("Keycloak user fetch error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch user information." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // console.log("User found:", user.id);

    // Update user's password
    try {
      await axios.put(
        `${keycloakUsersUrl}/${user.id}/reset-password`,
        {
          type: "password",
          value: password,
          temporary: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
    } catch (error) {
      console.error("Keycloak password reset error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to reset password." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Password reset successfully." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to reset password. Please try again later.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
