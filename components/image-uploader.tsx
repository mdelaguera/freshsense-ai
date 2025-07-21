"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Camera, ImagePlus, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { compressImage } from "@/lib/image-compression"

interface ImageUploaderProps {
  image: string | null
  onImageUpload: (imageDataUrl: string) => void
  disabled?: boolean
}

export function ImageUploader({ image, onImageUpload, disabled = false }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [cameraLoading, setCameraLoading] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const [compressionProgress, setCompressionProgress] = useState(0)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCompressing(true)
      setCompressionProgress(20)
      
      try {
        setCompressionProgress(50)
        const compressedImage = await compressImage(file, {
          maxWidth: 1280,
          maxHeight: 720,
          quality: 0.8,
          maxSizeKB: 500
        })
        
        setCompressionProgress(80)
        onImageUpload(compressedImage)
        setCompressionProgress(100)
      } catch (error) {
        console.error('Error compressing image:', error)
        // Fallback to original file without compression
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            onImageUpload(event.target.result as string)
          }
        }
        reader.readAsDataURL(file)
      } finally {
        setTimeout(() => {
          setCompressing(false)
          setCompressionProgress(0)
        }, 500)
      }
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      setCompressing(true)
      setCompressionProgress(20)
      
      try {
        setCompressionProgress(50)
        const compressedImage = await compressImage(file, {
          maxWidth: 1280,
          maxHeight: 720,
          quality: 0.8,
          maxSizeKB: 500
        })
        
        setCompressionProgress(80)
        onImageUpload(compressedImage)
        setCompressionProgress(100)
      } catch (error) {
        console.error('Error compressing image:', error)
        // Fallback to original file without compression
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            onImageUpload(event.target.result as string)
          }
        }
        reader.readAsDataURL(file)
      } finally {
        setTimeout(() => {
          setCompressing(false)
          setCompressionProgress(0)
        }, 500)
      }
    }
  }

  const startCamera = async () => {
    setCameraLoading(true)
    setShowCamera(true) // Show modal first
    
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
      setShowCamera(false) // Close modal on error
      
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
      
      alert(errorMessage)
    } finally {
      setCameraLoading(false)
    }
  }

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      setCompressing(true)
      setCompressionProgress(20)
      
      try {
        const video = videoRef.current
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw video frame to canvas
        context?.drawImage(video, 0, 0, canvas.width, canvas.height)

        setCompressionProgress(40)
        
        // Convert canvas to data URL with initial compression
        const initialImageDataUrl = canvas.toDataURL("image/jpeg", 0.9)
        
        setCompressionProgress(60)
        
        // Further compress the image
        const compressedImage = await compressImage(initialImageDataUrl, {
          maxWidth: 1280,
          maxHeight: 720,
          quality: 0.8,
          maxSizeKB: 500
        })
        
        setCompressionProgress(90)
        
        if (compressedImage.startsWith('data:image/')) {
          onImageUpload(compressedImage)
          setCompressionProgress(100)
          closeCamera()
        } else {
          alert('Camera capture failed: Could not generate image.')
        }
      } catch (error) {
        console.error('Error compressing camera image:', error)
        alert('Failed to process camera image.')
      } finally {
        setTimeout(() => {
          setCompressing(false)
          setCompressionProgress(0)
        }, 500)
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

  const handleRemoveImage = () => {
    onImageUpload("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />

      {compressing && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Compressing image...</span>
          </div>
          <Progress value={compressionProgress} className="w-full" />
        </div>
      )}

      {!image ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-4 transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
          } ${compressing ? "opacity-50 pointer-events-none" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <ImagePlus className="h-10 w-10 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium">Drag and drop your image here</p>
            <p className="text-xs text-muted-foreground mt-1">or select an option below</p>
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || compressing}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={startCamera} disabled={disabled || cameraLoading || compressing}>
              <Camera className="h-4 w-4 mr-2" />
              {cameraLoading ? "Starting Camera..." : "Take Photo"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt="Food image"
            width={400}
            height={300}
            className="w-full h-64 object-cover"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyeyKFcFW2D6+KKhobhfAlIx40qHAAA=="
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

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
            
            {compressing && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Processing photo...</span>
                </div>
                <Progress value={compressionProgress} className="w-full" />
              </div>
            )}
            
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={closeCamera} disabled={compressing}>
                Cancel
              </Button>
              <Button onClick={capturePhoto} disabled={cameraLoading || compressing}>
                <Camera className="h-4 w-4 mr-2" />
                {compressing ? "Processing..." : "Capture Photo"}
              </Button>
            </div>
          </div>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
