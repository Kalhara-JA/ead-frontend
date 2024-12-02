"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { updateUser } from "@/services/userService";
import axios from "@/lib/axiosInstance";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Toaster, toast } from "react-hot-toast";
import { CloudinaryUploadWidget } from "@/components/CloudinaryUploadWidget"; // Import the upload widget

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
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = session?.user?.id;
        if (!userId) {
          console.error("User ID not found in session");
          toast.error("User ID not found in session.");
          return;
        }
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/keycloak/user/${userId}`
        );
        const user = response.data;

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
        toast.error("Failed to load user details.");
      }
    };

    fetchUserDetails();
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (error: any, result: any) => {
    if (!error && result && result.event === "success") {
      const uploadedImageUrl = result.info.secure_url;
      setFormData({ ...formData, image: uploadedImageUrl });
      toast.success("Image uploaded successfully!");
    } else if (error) {
      toast.error("Image upload failed. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userId = session?.user?.id;
      if (!userId) {
        console.error("User ID not found in session");
        toast.error("User ID not found in session.");
        return;
      }
      await updateUser(userId, formData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Toaster toastOptions={{ duration: 4000 }} />
      <Card className="w-full max-w-6xl grid md:grid-cols-2 overflow-hidden">
        <div className="p-8 bg-primary/10 flex flex-col justify-center items-center">
          <Avatar className="w-48 h-48 mb-8">
            <AvatarImage
              src={formData.image}
              alt={`${formData.firstName} ${formData.lastName}`}
            />
            <AvatarFallback>
              {formData.firstName?.[0]}
              {formData.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-3xl font-bold mb-2">
            {formData.firstName} {formData.lastName}
          </h2>
          <p className="text-muted-foreground mb-4">{formData.email}</p>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Location</h3>
            <p>
              {formData.city}, {formData.state}
            </p>
            <p>{formData.country}</p>
          </div>
        </div>
        <div className="p-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center mb-6">
              Update Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "firstName", label: "First Name", type: "text" },
                  { id: "lastName", label: "Last Name", type: "text" },
                  { id: "street", label: "Street Address", type: "text" },
                  { id: "city", label: "City", type: "text" },
                  { id: "state", label: "State/Province", type: "text" },
                  { id: "zip", label: "Zip/Postal Code", type: "text" },
                  { id: "country", label: "Country", type: "text" },
                ].map(({ id, label, type }) => (
                  <div key={id} className="space-y-2">
                    <Label htmlFor={id} className="text-sm font-medium">
                      {label}
                    </Label>
                    <Input
                      id={id}
                      name={id}
                      type={type}
                      value={formData[id as keyof typeof formData]}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Profile Image</Label>
                <CloudinaryUploadWidget onUpload={handleImageUpload}>
                  Upload Image
                </CloudinaryUploadWidget>
              </div>
              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center mt-6">
            <Button variant="outline" asChild>
              <a href="/">Back to Dashboard</a>
            </Button>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
