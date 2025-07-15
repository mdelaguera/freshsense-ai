"use client"

import { useState, useRef } from "react"
import { Camera, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ImageUploadProps {
  onImageSelected: (file: File) => void
}

export function ImageUpload({ onImageSelected }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (file: File) => {
    // Create preview URL
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    
    // Pass file to parent component
    onImageSelected(file)
    
    // Clean up previous preview URL
    return () => URL.revokeObjectURL(objectUrl)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0])
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="w-full">
      <div
        className={`border-2 ${
          dragActive ? "border-primary" : "border-dashed"
        } rounded-lg p-4 flex flex-col items-center justify-center relative ${
          preview ? "bg-gray-50" : ""
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          className="hidden"
          onChange={handleInputChange}
        />
        
        {preview ? (
          <div className="relative w-full aspect-square">
            <Image
              src={preview}
              alt="Food preview"
              fill
              className="object-contain rounded-md"
            />
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="flex flex-col items-center justify-center">
              <div className="mb-3 flex flex-col items-center">
                <div className="bg-secondary rounded-full p-2 mb-2">
                  <Upload className="h-6 w-6 text-secondary-foreground" />
                </div>
                <p className="text-sm font-medium">Drag and drop your image here</p>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Supported formats: JPEG, PNG
              </p>
            </div>
            <div className="flex space-x-4">
              <Button onClick={handleButtonClick} variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Button onClick={handleButtonClick} variant="outline" size="sm">
                <Camera className="h-4 w-4 mr-2" />
                Camera
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
