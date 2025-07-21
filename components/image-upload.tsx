"use client"

import { useState, useRef } from "react"
import { Camera, Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import Image from "next/image"

interface ImageUploadProps {
  onImageSelected: (file: File) => void
}

// File validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

export function ImageUpload({ onImageSelected }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [cameraLoading, setCameraLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`;
    }

    // Check file type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return `File type not supported. Please use: ${ACCEPTED_EXTENSIONS.join(', ')}`;
    }

    // Check file extension as additional validation
    const fileExtension = file.name.toLowerCase().split('.').pop();
    if (!fileExtension || !ACCEPTED_EXTENSIONS.some(ext => ext.substring(1) === fileExtension)) {
      return `File extension not supported. Please use: ${ACCEPTED_EXTENSIONS.join(', ')}`;
    }

    return null; // File is valid
  };

  const handleFileChange = (file: File) => {
    // Validate the file
    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    // Log file info for testing
    console.log('Image upload:', {
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)}MB`,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString()
    });

    // Show success toast
    toast.success(`Image selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
    
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

  const startCamera = async () => {
    setCameraLoading(true)
    setShowCamera(true)
    
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported in this browser")
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment", // Use back camera by default on mobile
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        
        // Wait for video to load metadata
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().catch(console.error)
          }
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setShowCamera(false)
      
      let errorMessage = "Could not access camera. "
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          errorMessage += "Please allow camera access and try again."
        } else if (error.name === "NotFoundError") {
          errorMessage += "No camera found on this device."
        } else if (error.name === "NotSupportedError") {
          errorMessage += "Camera not supported in this browser."
        } else {
          errorMessage += error.message
        }
      }
      errorMessage += " Try uploading an image instead."
      
      toast.error(errorMessage)
    } finally {
      setCameraLoading(false)
    }
  }

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      try {
        const video = videoRef.current
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw video frame to canvas
        context?.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        // Convert canvas to blob
        canvas.toBlob(async (blob) => {
          if (blob) {
            // Create a File object from the blob
            const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
              type: 'image/jpeg',
              lastModified: Date.now()
            })
            
            // Validate and use the captured image
            const validationError = validateFile(file)
            if (validationError) {
              toast.error(validationError)
              return
            }

            // Create preview and pass to parent
            const objectUrl = URL.createObjectURL(file)
            setPreview(objectUrl)
            onImageSelected(file)
            
            toast.success(`Photo captured successfully (${(file.size / (1024 * 1024)).toFixed(2)}MB)`)
            closeCamera()
          } else {
            toast.error('Failed to capture photo. Please try again.')
          }
        }, 'image/jpeg', 0.9)
        
      } catch (error) {
        console.error('Error capturing photo:', error)
        toast.error('Failed to capture photo. Please try again.')
      }
    }
  }

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
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
                Supported formats: JPEG, PNG (max 10MB)
              </p>
            </div>
            <div className="flex space-x-4">
              <Button onClick={handleButtonClick} variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Button 
                onClick={startCamera} 
                variant="outline" 
                size="sm"
                disabled={cameraLoading}
              >
                {cameraLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4 mr-2" />
                )}
                {cameraLoading ? "Starting..." : "Camera"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Camera Modal */}
      <Dialog open={showCamera} onOpenChange={closeCamera}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Take Photo</DialogTitle>
            <DialogDescription>
              {cameraLoading ? "Starting camera..." : "Position your food in the camera view and tap capture"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {cameraLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                  <div className="text-center text-white">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm">Starting camera...</p>
                  </div>
                </div>
              )}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={closeCamera}>
                Cancel
              </Button>
              <Button onClick={capturePhoto} disabled={cameraLoading}>
                <Camera className="h-4 w-4 mr-2" />
                Capture Photo
              </Button>
            </div>
          </div>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
