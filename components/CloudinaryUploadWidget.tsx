"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

interface CloudinaryUploadWidgetProps {
  onUpload: (error: any, result: any) => void;
  children: React.ReactNode;
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

export function CloudinaryUploadWidget({
  onUpload,
  children,
}: CloudinaryUploadWidgetProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const widgetRef = useRef<any>();

  useEffect(() => {
    if (typeof window !== "undefined" && !window.cloudinary) {
      const script = document.createElement("script");
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.async = true;
      script.onload = () => setIsScriptLoaded(true);
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    } else {
      setIsScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isScriptLoaded && window.cloudinary) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        },
        onUpload
      );
    }
  }, [isScriptLoaded, onUpload]);

  const handleClick = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    } else {
      toast.error("Upload widget is not ready yet. Please try again.");
    }
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      variant="outline"
      disabled={!isScriptLoaded}
    >
      {isScriptLoaded ? children : "Loading..."}
    </Button>
  );
}
