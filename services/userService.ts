//services/userService.ts

import axios from "@/lib/axiosInstance";
import { getAdminToken, updateUserInKeycloak } from "@/utils/keycloak";

export const registerUser = async (userData: any) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/keycloak/user`, userData);
        return response.data;
    } catch (error) {
        console.error("Error registering user:", error);
        throw new Error("Failed to register user");
    }
};

export const updateUser = async (userId: string, userData: any) => {
    try {
        const adminToken = await getAdminToken();
        return await updateUserInKeycloak(userId, userData, adminToken);
    } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Failed to update user");
    }
};

export const getUser = async (userId: string) => {
    try {

        const adminToken = await getAdminToken();
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/api/keycloak/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${adminToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Failed to fetch user");
    }
}
