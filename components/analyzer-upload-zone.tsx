import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FilePreview {
  file: File;
  url: string;
  error?: string;
  originalSize?: number;
  compressedSize?: number;
}

interface AnalyzerUploadZoneProps {
  onFilesAccepted?: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  maxDimension?: number; // Maximum width/height in pixels
  accept?: string;
}

export const AnalyzerUploadZone: React.FC<AnalyzerUploadZoneProps> = ({
  onFilesAccepted,
  maxFiles = 5,
  maxSizeMB = 5, // Reduced to 5MB to prevent timeouts
  maxDimension = 1200, // Max width/height of 1200px
  accept = "image/*",
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFiles = async (files: FileList): Promise<FilePreview[]> => {
    const previews: FilePreview[] = [];
    const filePromises = Array.from(files).map(async (file) => {
      let error = "";
      let processedFile = file;
      let originalSize = file.size;
      let compressedSize = file.size;
      
      if (!file.type.startsWith("image/")) {
        error = "Invalid file type";
        return {
          file,
          url: URL.createObjectURL(file),
          error,
          originalSize,
          compressedSize
        };
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        // Image is too large, we'll try to resize it
        try {
          processedFile = await resizeImage(file, maxDimension, maxSizeMB * 1024 * 1024);
          compressedSize = processedFile.size;
          
          if (processedFile.size > maxSizeMB * 1024 * 1024) {
            error = `Image still too large after compression (${(processedFile.size / (1024 * 1024)).toFixed(1)}MB). Please try a smaller image.`;
          }
        } catch (e) {
          error = `Failed to process image. Please use a smaller image under ${maxSizeMB}MB.`;
        }
      }

      return {
        file: error ? file : processedFile, // Use original file only if there's an error
        url: URL.createObjectURL(error ? file : processedFile),
        error,
        originalSize,
        compressedSize
      };
    });

    return await Promise.all(filePromises);
  };

  // Function to resize images to prevent timeout errors
  const resizeImage = (file: File, maxDimension: number, maxSize: number): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          // Calculate dimensions to maintain aspect ratio
          let width = img.width;
          let height = img.height;
          let quality = 0.8; // Initial quality
          
          // Resize if needed
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
          
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Try different quality settings until file size is under maxSize
          const tryCompress = (q: number) => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error('Failed to create blob'));
                  return;
                }
                
                const newFile = new File(
                  [blob],
                  file.name.replace(/\.[^\.]+$/, '.jpg'), // Convert to jpg for better compression
                  { type: 'image/jpeg' }
                );
                
                // If still too large and quality can be reduced further, try again
                if (newFile.size > maxSize && q > 0.3) {
                  tryCompress(q - 0.1); // Reduce quality and try again
                } else {
                  resolve(newFile); // Return the compressed file
                }
              },
              'image/jpeg',
              q
            );
          };
          
          // Start compression attempt
          tryCompress(quality);
        };
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
    });
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (!files.length) return;
    
    setUploading(true);
    setProgress(10);
    
    try {
      const previews = await validateFiles(files);
      setProgress(70);
      setPreviews(previews);
      
      const validFiles = previews.filter((p) => !p.error).map((p) => p.file);
      setProgress(100);
      
      if (validFiles.length && onFilesAccepted) {
        onFilesAccepted(validFiles);
      }
      
      if (previews.some((p) => p.error)) {
        toast({ 
          title: "Some files were invalid or too large", 
          description: "Please check the error messages and try again with smaller images."
        });
      }
    } catch (error) {
      toast({ 
        title: "Failed to process images", 
        description: "Please try again with smaller images."
      });
    } finally {
      setUploading(false);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    setUploading(true);
    setProgress(10);
    
    try {
      const previews = await validateFiles(files);
      setProgress(70);
      setPreviews(previews);
      
      const validFiles = previews.filter((p) => !p.error).map((p) => p.file);
      setProgress(100);
      
      if (validFiles.length && onFilesAccepted) {
        onFilesAccepted(validFiles);
      }
      
      if (previews.some((p) => p.error)) {
        toast({ 
          title: "Some files were invalid or too large", 
          description: "Please check the error messages and try again with smaller images."
        });
      }
    } catch (error) {
      toast({ 
        title: "Failed to process images", 
        description: "Please try again with smaller images."
      });
    } finally {
      setUploading(false);
    }
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  return (
    <Card
      className={`w-full max-w-xl mx-auto p-6 border-2 transition-colors duration-200 ${dragActive ? "border-primary-blue bg-sky-50" : "border-border bg-surface"}`}
      onDragEnter={() => setDragActive(true)}
      onDragLeave={() => setDragActive(false)}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDrop={handleDrop}
      aria-label="Upload food images for analysis"
      tabIndex={0}
      role="region"
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={maxFiles > 1}
        className="hidden"
        onChange={handleChange}
        aria-label="File uploader"
      />
      <div className="flex flex-col items-center justify-center gap-4">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: dragActive ? 1.05 : 1 }}
          transition={{ duration: 0.2 }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-blue to-fresh-green flex items-center justify-center mb-2"
        >
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 16V4m0 0l-4 4m4-4l4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="3" y="16" width="18" height="4" rx="2" fill="#fff" fillOpacity=".2" />
          </svg>
        </motion.div>
        <Button
          variant="outline"
          className="w-full max-w-xs"
          onClick={openFileDialog}
          aria-label="Click to upload food images"
        >
          Click to upload or drag files here
        </Button>
        <span className="text-sm text-text-secondary mt-2">JPG, PNG, WebP. Max {maxSizeMB}MB each. Larger images will be automatically resized.</span>
        
        <Alert className="mt-4 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Image Size Limit</AlertTitle>
          <AlertDescription>
            Very large images may cause timeout errors during analysis. Images larger than {maxSizeMB}MB will be automatically compressed, but for best results, please use images under {maxSizeMB}MB.
          </AlertDescription>
        </Alert>
        {previews.length > 0 && (
          <div className="grid grid-cols-2 gap-2 w-full mt-4">
            {previews.map((preview, idx) => (
              <div key={idx} className="relative">
                <img
                  src={preview.url}
                  alt={preview.file.name}
                  className={`rounded-lg w-full h-24 object-cover border ${preview.error ? "border-danger-red" : "border-surface-dark"}`}
                />
                {preview.error && (
                  <span className="absolute top-1 left-1 bg-danger-red text-white text-xs px-2 py-1 rounded">
                    {preview.error}
                  </span>
                )}
                {preview.compressedSize && preview.originalSize && preview.compressedSize < preview.originalSize && !preview.error && (
                  <span className="absolute top-1 left-1 bg-green-600 text-white text-xs px-2 py-1 rounded">
                    Resized ({(preview.compressedSize / (1024 * 1024)).toFixed(1)}MB)
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
        {uploading && <Progress value={progress} className="w-full mt-4" />}
      </div>
    </Card>
  );
};

export default AnalyzerUploadZone;
