export interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxSizeKB?: number
}

export function compressImage(
  file: File | string,
  options: CompressionOptions = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 1280,
      maxHeight = 720,
      quality = 0.8,
      maxSizeKB = 500
    } = options

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width *= ratio
        height *= ratio
      }

      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)
      
      // Start with the specified quality
      let currentQuality = quality
      let result = canvas.toDataURL('image/jpeg', currentQuality)
      
      // Reduce quality until file size is acceptable
      while (getDataUrlSizeKB(result) > maxSizeKB && currentQuality > 0.1) {
        currentQuality -= 0.1
        result = canvas.toDataURL('image/jpeg', currentQuality)
      }

      resolve(result)
    }

    img.onerror = () => reject(new Error('Failed to load image'))

    if (typeof file === 'string') {
      img.src = file
    } else {
      const reader = new FileReader()
      reader.onload = (e) => {
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    }
  })
}

function getDataUrlSizeKB(dataUrl: string): number {
  // Remove data URL prefix and calculate size
  const base64 = dataUrl.split(',')[1]
  const bytes = (base64.length * 3) / 4
  return bytes / 1024
}

export function resizeImageToFit(
  imageDataUrl: string,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.9
): Promise<string> {
  return compressImage(imageDataUrl, {
    maxWidth,
    maxHeight,
    quality,
    maxSizeKB: 1000 // Allow larger size for display quality
  })
}