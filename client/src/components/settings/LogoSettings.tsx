import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AppLogo } from '@/components/AppLogo';
import { toast } from '@/hooks/use-toast';

export default function LogoSettings() {
  const [useCustomLogo, setUseCustomLogo] = useState(localStorage.getItem('useCustomLogo') === 'true');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoToggle = (checked: boolean) => {
    setUseCustomLogo(checked);
    localStorage.setItem('useCustomLogo', checked.toString());
    
    // Show appropriate toast based on the toggle state
    if (checked) {
      toast({
        title: "Custom Logo Enabled",
        description: "Your custom logo is now being used in the app."
      });
    } else {
      toast({
        title: "Default Logo Restored",
        description: "The app is now using the default logo."
      });
    }
  };

  const handleUploadClick = () => {
    // Trigger the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (PNG, JPG, etc.).",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 300KB)
    if (file.size > 300 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 300KB.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);

      // Create a new image to process it
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = function(e) {
        img.src = e.target?.result as string;
        
        img.onload = function() {
          // Create a canvas to resize the image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set dimensions to a reasonable size for an icon
          const maxDimension = 128;
          const width = img.width;
          const height = img.height;
          
          // Calculate new dimensions while preserving aspect ratio
          let newWidth, newHeight;
          if (width > height) {
            newWidth = maxDimension;
            newHeight = (height * maxDimension) / width;
          } else {
            newHeight = maxDimension;
            newWidth = (width * maxDimension) / height;
          }
          
          canvas.width = newWidth;
          canvas.height = newHeight;
          
          // Draw the resized image
          ctx?.drawImage(img, 0, 0, newWidth, newHeight);
          
          // Convert to a blob
          canvas.toBlob(async (blob) => {
            if (blob) {
              try {
                // Create a fake form data to simulate upload
                const formData = new FormData();
                formData.append('logo', blob, 'custom-logo.png');
                
                // In a real app, you'd upload this to a server
                // Since we're just doing a client-side demo, we'll simulate success
                
                // Instead of actual upload, we'll save it to localStorage
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function() {
                  const base64data = reader.result as string;
                  localStorage.setItem('customLogoData', base64data);
                  
                  // Store the blob URL for display
                  const blobUrl = URL.createObjectURL(blob);
                  localStorage.setItem('customLogoBlobUrl', blobUrl);
                  
                  // Display success message
                  toast({
                    title: "Logo Uploaded Successfully",
                    description: "Your custom logo has been set. Enable it to use it in the app."
                  });
                  
                  // Automatically enable the custom logo
                  setUseCustomLogo(true);
                  localStorage.setItem('useCustomLogo', 'true');
                  
                  setIsUploading(false);
                };
              } catch (error) {
                console.error("Error processing image:", error);
                toast({
                  title: "Upload Failed",
                  description: "There was an error processing your image.",
                  variant: "destructive"
                });
                setIsUploading(false);
              }
            }
          }, 'image/png', 0.9); // 90% quality PNG
        };
      };
      
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your logo.",
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>App Logo</CardTitle>
        <CardDescription>Customize the application logo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <div className="bg-background p-2 rounded-md border">
              <AppLogo size={64} useCustomLogo={useCustomLogo} />
            </div>
            <div>
              <Label htmlFor="use-custom-logo">Use Custom Logo</Label>
              <p className="text-sm text-muted-foreground">
                Toggle between default and custom logo
              </p>
            </div>
          </div>
          <Switch
            id="use-custom-logo"
            checked={useCustomLogo}
            onCheckedChange={handleLogoToggle}
          />
        </div>
        
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <Label>Upload Custom Logo</Label>
            {/* Hidden file input */}
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
            />
          </div>
          <Button 
            variant="outline" 
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Select Image"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Recommended: 128x128px PNG with transparent background. Max 300KB.
          </p>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <p className="text-xs text-muted-foreground">
          Note: The custom logo is stored locally in your browser and will persist until you clear your browser data.
        </p>
      </CardFooter>
    </Card>
  );
} 