import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";

interface FilePreview {
  file: File;
  url: string;
  error?: string;
}

interface AnalyzerUploadZoneProps {
  onFilesAccepted?: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: string;
}

export const AnalyzerUploadZone: React.FC<AnalyzerUploadZoneProps> = ({
  onFilesAccepted,
  maxFiles = 5,
  maxSizeMB = 10,
  accept = "image/*",
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: FileList): FilePreview[] => {
    const previews: FilePreview[] = [];
    Array.from(files).forEach((file) => {
      let error = "";
      if (file.size > maxSizeMB * 1024 * 1024) {
        error = `File too large (> ${maxSizeMB}MB)`;
      } else if (!file.type.startsWith("image/")) {
        error = "Invalid file type";
      }
      previews.push({
        file,
        url: URL.createObjectURL(file),
        error,
      });
    });
    return previews;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (!files.length) return;
    const previews = validateFiles(files);
    setPreviews(previews);
    const validFiles = previews.filter((p) => !p.error).map((p) => p.file);
    if (validFiles.length && onFilesAccepted) onFilesAccepted(validFiles);
    if (previews.some((p) => p.error)) toast({ title: "Some files were invalid." });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const previews = validateFiles(files);
    setPreviews(previews);
    const validFiles = previews.filter((p) => !p.error).map((p) => p.file);
    if (validFiles.length && onFilesAccepted) onFilesAccepted(validFiles);
    if (previews.some((p) => p.error)) toast({ title: "Some files were invalid." });
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
        <span className="text-sm text-text-secondary mt-2">JPG, PNG, WebP. Max {maxSizeMB}MB each.</span>
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
