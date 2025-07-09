"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, Download, RotateCcw, Sparkles, Eye, Smile, Shield, Clock } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import api from "../utils/api"
import toast from "react-hot-toast"

interface ProcessedImage {
  originalImage: string
  processedImage: string
  processId: number
}

const VirtualTryOn: React.FC = () => {
  const { user } = useAuth()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null)
  const [selectedProcedure, setSelectedProcedure] = useState<string>("lip_fillers")
  const [enhancementLevel, setEnhancementLevel] = useState<number>(50)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const procedures = [
    {
      id: "lip_fillers",
      name: "Lip Enhancement",
      icon: Smile,
      description: "Fuller, more defined lips",
    },
    {
      id: "eye_brightening",
      name: "Eye Brightening",
      icon: Eye,
      description: "Brighter, more vibrant eyes",
    },
    {
      id: "skin_smoothing",
      name: "Skin Smoothing",
      icon: Sparkles,
      description: "Smoother, more radiant skin",
    },
  ]

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB")
        return
      }

      setSelectedImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setProcessedImage(null)
    }
  }

  const handleProcessImage = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first")
      return
    }

    if (!user) {
      toast.error("Please login to process images")
      return
    }

    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append("image", selectedImage)
      formData.append("procedureType", selectedProcedure)
      formData.append("enhancementLevel", enhancementLevel.toString())

      const response = await api.post("/image/process", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setProcessedImage({
        originalImage: `${process.env.REACT_APP_API_URL || "http://localhost:5000"}${response.data.originalImage}`,
        processedImage: `${process.env.REACT_APP_API_URL || "http://localhost:5000"}${response.data.processedImage}`,
        processId: response.data.processId,
      })

      toast.success("Image processed successfully!")
    } catch (error: any) {
      const message = error.response?.data?.error || "Image processing failed"
      toast.error(message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = async () => {
    if (!processedImage) return

    try {
      const response = await fetch(processedImage.processedImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `kulturaview-${selectedProcedure}-${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("Image downloaded successfully!")
    } catch (error) {
      toast.error("Download failed")
    }
  }

  const handleReset = () => {
    setSelectedImage(null)
    setPreviewUrl("")
    setProcessedImage(null)
    setEnhancementLevel(50)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Virtual Beauty Try-On</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your photo and see realistic previews of our beauty treatments before booking your appointment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <div className="card space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Customization</h2>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-avocado-500 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <button onClick={() => fileInputRef.current?.click()} className="btn-primary text-sm">
                    Choose File
                  </button>
                </div>
                {selectedImage && <p className="text-sm text-gray-600 mt-2">Selected: {selectedImage.name}</p>}
              </div>

              {/* Procedure Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Procedure</label>
                <div className="space-y-2">
                  {procedures.map((procedure) => {
                    const IconComponent = procedure.icon
                    return (
                      <label
                        key={procedure.id}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedProcedure === procedure.id
                            ? "border-avocado-500 bg-avocado-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="procedure"
                          value={procedure.id}
                          checked={selectedProcedure === procedure.id}
                          onChange={(e) => setSelectedProcedure(e.target.value)}
                          className="sr-only"
                        />
                        <IconComponent className="w-5 h-5 text-avocado-600 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">{procedure.name}</div>
                          <div className="text-sm text-gray-600">{procedure.description}</div>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Enhancement Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enhancement Level: {enhancementLevel}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={enhancementLevel}
                  onChange={(e) => setEnhancementLevel(Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Subtle</span>
                  <span>Dramatic</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleProcessImage}
                  disabled={!selectedImage || isProcessing || !user}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : "Process Image"}
                </button>

                {!user && (
                  <p className="text-sm text-gray-600 text-center">
                    <a href="/login" className="text-avocado-600 hover:underline">
                      Login
                    </a>{" "}
                    to process images
                  </p>
                )}

                <button
                  onClick={handleReset}
                  className="w-full btn-secondary flex items-center justify-center space-x-2"
                >
                  <RotateCcw size={16} />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Image Display */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original Image */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Original</h3>
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {previewUrl ? (
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Original"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-gray-500">
                        <Upload className="w-12 h-12 mx-auto mb-2" />
                        <p>Upload an image to get started</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Processed Image */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                    {processedImage && (
                      <button
                        onClick={handleDownload}
                        className="flex items-center space-x-2 text-avocado-600 hover:text-avocado-700 transition-colors"
                      >
                        <Download size={16} />
                        <span>Download</span>
                      </button>
                    )}
                  </div>
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {processedImage ? (
                      <img
                        src={processedImage.processedImage || "/placeholder.svg"}
                        alt="Processed"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-gray-500">
                        <Sparkles className="w-12 h-12 mx-auto mb-2" />
                        <p>Processed image will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {processedImage && (
                <div className="mt-6 p-4 bg-avocado-50 rounded-lg">
                  <p className="text-sm text-avocado-800">
                    <strong>Note:</strong> This is a preview visualization. Actual results may vary. Book a consultation
                    with our professionals for personalized advice.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center">
            <Shield className="w-12 h-12 text-avocado-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Processing</h3>
            <p className="text-gray-600">
              Your images are processed securely and automatically deleted after 24 hours.
            </p>
          </div>

          <div className="card text-center">
            <Eye className="w-12 h-12 text-avocado-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Realistic Results</h3>
            <p className="text-gray-600">
              Our AI technology provides highly accurate previews based on real treatment outcomes.
            </p>
          </div>

          <div className="card text-center">
            <Clock className="w-12 h-12 text-avocado-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Preview</h3>
            <p className="text-gray-600">
              Get your visualization results in seconds, not days. Make informed decisions quickly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VirtualTryOn
