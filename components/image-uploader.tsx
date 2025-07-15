"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Camera, ImagePlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ImageUploaderProps {
  image: string | null
  onImageUpload: (imageDataUrl: string) => void
  disabled?: boolean
}

export function ImageUploader({ image, onImageUpload, disabled = false }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageUpload(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
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

    const file = e.dataTransfer.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageUpload(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      const videoElement = document.createElement("video")
      const canvasElement = document.createElement("canvas")

      videoElement.srcObject = stream
      await videoElement.play()

      // Set canvas dimensions to match video
      canvasElement.width = videoElement.videoWidth
      canvasElement.height = videoElement.videoHeight

      // Draw video frame to canvas
      const context = canvasElement.getContext("2d")
      context?.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height)

      // Convert canvas to data URL
      const imageDataUrl = canvasElement.toDataURL("image/jpeg")
      // Ensure the result is a valid Data URL (starts with data:image/)
      if (imageDataUrl.startsWith('data:image/')) {
        onImageUpload(imageDataUrl)
      } else {
        alert('Camera capture failed: Could not generate Data URL.')
      }

      // Stop all video streams
      stream.getTracks().forEach((track) => track.stop())
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Could not access camera. Please check permissions or try uploading an image instead.")
    }
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

      {!image ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-4 transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
          }`}
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
              disabled={disabled}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleCameraCapture} disabled={disabled}>
              <Camera className="h-4 w-4 mr-2" />
              Take Photo
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
    </div>
  )
}
