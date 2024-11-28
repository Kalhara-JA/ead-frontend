"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { updateUser } from "@/services/userService";
import axios from "@/lib/axiosInstance";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        image: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const { data: session } = useSession();

    // Fetch user details on page load
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userId = session?.user?.id;
                if (!userId) {
                    console.error("User ID not found in session");
                    setAlertMessage("User ID not found in session.");
                    return;
                }
                const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/api/keycloak/user/${userId}`);
                const user = response.data;

                // Map Keycloak user details to form fields
                setFormData({
                    email: session?.user?.email || "",
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    image: user.attributes?.image || "",
                    street: user.attributes?.street || "",
                    city: user.attributes?.locality || "",
                    state: user.attributes?.region || "",
                    zip: user.attributes?.postal_code || "",
                    country: user.attributes?.country || "",
                });
            } catch (error) {
                console.error("Error fetching user details:", error);
                setAlertMessage("Failed to load user details.");
            }
        };

        fetchUserDetails();
    }, [session]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setAlertMessage("");

        try {
            const userId = session?.user?.id;
            if (!userId) {
                console.error("User ID not found in session");
                setAlertMessage("User ID not found in session.");
                return;
            }
            await updateUser(userId, formData);
            setAlertMessage("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            setAlertMessage("Failed to update profile.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Update Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    {alertMessage && (
                        <div className={`mb-4 text-center ${alertMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>
                            {alertMessage}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Field (Read-Only) */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                disabled
                            />
                        </div>

                        {/* Other Editable Fields */}
                        {[
                            { id: "firstName", label: "First Name", type: "text" },
                            { id: "lastName", label: "Last Name", type: "text" },
                            { id: "image", label: "Image URL", type: "text" },
                            { id: "street", label: "Street", type: "text" },
                            { id: "city", label: "City or Locality", type: "text" },
                            { id: "state", label: "State, Province, or Region", type: "text" },
                            { id: "zip", label: "Zip or Postal Code", type: "text" },
                            { id: "country", label: "Country", type: "text" },
                        ].map(({ id, label, type }) => (
                            <div key={id} className="space-y-2">
                                <Label htmlFor={id}>{label}</Label>
                                <Input
                                    id={id}
                                    name={id}
                                    type={type}
                                    value={formData[id as keyof typeof formData]}
                                    onChange={handleChange}
                                />
                            </div>
                        ))}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Updating..." : "Update Profile"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        <a href="/" className="text-primary hover:underline">
                            Back to Dashboard
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
