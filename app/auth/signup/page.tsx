"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { registerUser } from "@/services/userService";

type AlertType = "error" | "success" | null;

interface AlertProps {
  type: AlertType;
  title: string;
  message: string;
}

const CustomAlert: React.FC<AlertProps> = ({ type, title, message }) => {
  if (!type) return null;

  return (
    <Alert
      variant={type === "error" ? "destructive" : "default"}
      className="mb-4"
    >
      {type === "error" ? (
        <AlertCircle className="h-4 w-4" />
      ) : (
        <CheckCircle className="h-4 w-4" />
      )}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

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
  const [alert, setAlert] = useState<AlertProps>({
    type: null,
    title: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert({ type: null, title: "", message: "" });

    if (formData.password !== formData.confirmPassword) {
      setAlert({
        type: "error",
        title: "Error",
        message: "Passwords do not match",
      });
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

      // Call the service to register the user
      await registerUser(userData);

      setAlert({
        type: "success",
        title: "Success",
        message:
          "Registration successful. Redirecting to the sign-in page...",
      });

      // Clear the form
      setFormData(initialFormState);

      // Redirect to sign-in page
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000); // Delay for user to read the success message
    } catch (error) {
      setAlert({
        type: "error",
        title: "Error",
        message: error instanceof Error ? error.message : "Registration failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Register
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CustomAlert {...alert} />
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { id: "email", label: "Email", type: "email" },
                { id: "password", label: "Password", type: "password" },
                { id: "confirmPassword", label: "Confirm Password", type: "password" },
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
                    required
                    value={formData[id as keyof typeof formData]}
                    onChange={handleChange}
                  />
                </div>
              ))}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
