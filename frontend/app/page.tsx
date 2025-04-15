"use client"

import type React from "react"

import { useState } from "react"
import { Upload, ArrowLeft, RefreshCw, FileDown, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AIVisualization } from "@/components/3d/ai-visualization"
import { ScanEffect } from "@/components/3d/scan-effect"

interface Measurement {
  name: string
  value: number
  unit: string
  description: string
}

// Function to generate a random number within a range
const getRandomValue = (min: number, max: number, precision = 0): number => {
  const value = Math.random() * (max - min) + min
  const multiplier = Math.pow(10, precision)
  return Math.round(value * multiplier) / multiplier
}

// Function to generate measurements based on a seed value
const generateMeasurements = (): Measurement[] => {
  return [
    {
      name: "Upper Body Width",
      value: getRandomValue(36, 48),
      unit: "inches",
      description: "The horizontal measurement around the widest part of the upper body",
    },
    {
      name: "Midsection",
      value: getRandomValue(28, 42),
      unit: "inches",
      description: "The horizontal measurement around the narrowest part of the natural waistline",
    },
    {
      name: "Lower Body Width",
      value: getRandomValue(34, 50),
      unit: "inches",
      description: "The horizontal measurement around the widest part of the lower body",
    },
    {
      name: "Shoulder Span",
      value: getRandomValue(15, 20),
      unit: "inches",
      description: "The horizontal distance across the back from shoulder point to shoulder point",
    },
    {
      name: "Arm Measurement",
      value: getRandomValue(22, 28),
      unit: "inches",
      description: "The length from shoulder point to wrist",
    },
    {
      name: "Torso Measurement",
      value: getRandomValue(16, 22),
      unit: "inches",
      description: "The vertical distance from the base of the neck to the natural waistline",
    },
    {
      name: "Leg Measurement",
      value: getRandomValue(28, 36),
      unit: "inches",
      description: "The vertical distance from the top of the leg to the ankle",
    },
  ]
}

// Function to generate clothing recommendations based on measurements
const generateRecommendations = (measurements: Measurement[]): string[] => {
  const upperBodyWidth = measurements.find((m) => m.name === "Upper Body Width")?.value || 0
  const midsection = measurements.find((m) => m.name === "Midsection")?.value || 0
  const lowerBodyWidth = measurements.find((m) => m.name === "Lower Body Width")?.value || 0
  const shoulderSpan = measurements.find((m) => m.name === "Shoulder Span")?.value || 0

  return [
    `Based on your upper body measurements, garments with a relaxed fit in the chest/shoulder area would provide optimal comfort.`,
    `Your proportions suggest balanced dimensions. Consider clothing styles that maintain your natural silhouette.`,
    `For lower body garments, look for items that provide comfortable room while maintaining a streamlined appearance.`,
    `Consider tops with a shoulder width of approximately ${shoulderSpan} inches for the most comfortable fit.`,
  ]
}

export default function SmartSizeAI() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [measurements, setMeasurements] = useState<Measurement[] | null>(null)
  const [recommendations, setRecommendations] = useState<string[] | null>(null)
  const [activeTab, setActiveTab] = useState("upload")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreview(event.target.result as string)
        }
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const processImage = () => {
    setIsProcessing(true)

    // Simulate processing delay
    setTimeout(() => {
      const generatedMeasurements = generateMeasurements()
      setMeasurements(generatedMeasurements)
      setRecommendations(generateRecommendations(generatedMeasurements))
      setIsProcessing(false)
      setActiveTab("results")
    }, 3000)
  }

  const resetForm = () => {
    setFile(null)
    setPreview(null)
    setMeasurements(null)
    setRecommendations(null)
    setActiveTab("upload")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex flex-col items-center justify-center p-4 font-['Poppins']">
      <Card className="w-full max-w-4xl shadow-lg border-teal-100 relative z-10 backdrop-blur-sm bg-white/90">
        <CardHeader className="border-b bg-white/80 flex flex-row items-center gap-2 p-3">
          <Button variant="ghost" size="icon" className="text-gray-500">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="w-full max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="/"
                  className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-500">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500">
              <FileDown className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="results" disabled={!measurements}>
                Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="m-0">
              <div className="p-8 flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-8">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">SmartSize AI</h1>
                  <p className="text-gray-600 mb-8">
                    Upload an image to get precise body measurements for better fitting clothes.
                  </p>

                  <div className="w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-teal-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-teal-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 10MB)</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>

                    {file && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-2">Selected file: {file.name}</p>
                      </div>
                    )}
                  </div>

                  {preview && (
                    <div className="mt-8 w-full">
                      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-gray-200">
                        <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />

                        {/* Scanning overlay when processing */}
                        {isProcessing && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className="w-full h-full">
                              <ScanEffect />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex justify-center">
                        <Button
                          onClick={processImage}
                          className="bg-teal-600 hover:bg-teal-700 text-white"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Analyze Measurements"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Visualization */}
                <div className="w-full md:w-1/2 h-[400px]">
                  <div className="w-full h-full rounded-lg overflow-hidden border border-teal-100">
                    <AIVisualization />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="results" className="m-0">
              <div className="p-8 flex flex-col md:flex-row">
                <div className="w-full md:w-3/5 mb-8 md:mb-0 md:pr-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Your Measurements</h2>

                    <p className="text-gray-600 mb-6 text-center">
                      Our AI has analyzed your image and calculated the following measurements with high precision.
                    </p>

                    <div className="overflow-hidden border border-gray-200 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Measurement
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Value
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Info
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {measurements?.map((measurement, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {measurement.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                {measurement.value} {measurement.unit}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="h-4 w-4 text-teal-500" />
                                    </TooltipTrigger>
                                    <TooltipContent side="left" className="max-w-xs">
                                      <p>{measurement.description}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Clothing Recommendations</h2>
                    <ul className="space-y-3 text-gray-700">
                      {recommendations?.map((recommendation, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-100 text-teal-800 mr-2 flex-shrink-0">
                            {index + 1}
                          </span>
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 flex flex-wrap gap-4 justify-between">
                      <Button
                        onClick={resetForm}
                        variant="outline"
                        className="border-teal-600 text-teal-600 hover:bg-teal-50"
                      >
                        Measure New Image
                      </Button>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                              <FileDown className="mr-2 h-4 w-4" />
                              Export Measurements
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Download your measurements as PDF</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>

                {/* AI Visualization for Results */}
                <div className="w-full md:w-2/5 h-[600px]">
                  <div className="w-full h-full rounded-lg overflow-hidden border border-teal-100">
                    <AIVisualization />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
