"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { Toaster, toast } from "react-hot-toast";
import { registerUser } from "@/services/userService";
import { CloudinaryUploadWidget } from "@/components/CloudinaryUploadWidget";

export default function RegisterPage() {
  const router = useRouter();
  const initialFormState = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    image: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (error: any, result: any) => {
    if (!error && result && result.event === "success") {
      const uploadedImageUrl = result.info.secure_url;
      setFormData({ ...formData, image: uploadedImageUrl });
      setImagePreview(uploadedImageUrl);
      toast.success("Image uploaded successfully");
    } else if (error) {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        image: formData.image,
        street: formData.street,
        locality: formData.city,
        region: formData.state,
        postal_code: formData.zip,
        country: formData.country,
      };

      await registerUser(userData);

      toast.success(
        "Registration successful. Redirecting to the sign-in page..."
      );

      setFormData(initialFormState);
      setImagePreview(null);

      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Toaster toastOptions={{ duration: 4000 }} />
      <Card className="w-full max-w-6xl grid md:grid-cols-2 overflow-hidden">
        <div className="hidden md:block relative">
          {/* <Image
            src="/placeholder.svg?height=1080&width=1080"
            alt="Registration background"
            layout="fill"
            objectFit="cover"
          /> */}
          <div className="absolute inset-0 bg-primary/60 flex items-center justify-center">
            <div className="text-white text-center p-8">
              <h1 className="text-4xl font-bold mb-4">Welcome</h1>
              <p className="text-xl">
                Join our community and start your journey today!
              </p>
            </div>
          </div>
        </div>
        <div className="p-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center mb-6">
              Create an Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "firstName", label: "First Name", type: "text" },
                  { id: "lastName", label: "Last Name", type: "text" },
                  { id: "email", label: "Email", type: "email" },
                  { id: "password", label: "Password", type: "password" },
                  {
                    id: "confirmPassword",
                    label: "Confirm Password",
                    type: "password",
                  },
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
                      required
                      value={formData[id as keyof typeof formData]}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm font-medium">
                  Profile Image
                </Label>
                <div className="flex items-center space-x-4">
                  {imagePreview && (
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      width={100}
                      height={100}
                      className="rounded-full object-cover"
                    />
                  )}
                  <CloudinaryUploadWidget onUpload={handleImageUpload}>
                    Upload Image
                  </CloudinaryUploadWidget>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center mt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
