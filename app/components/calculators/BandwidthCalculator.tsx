'use client'
import React, { useState } from 'react'
import { Calculator, Wifi, Download, Upload } from 'lucide-react'
import ResultSharing from '../ResultSharing'

export default function BandwidthCalculator() {
  const [fileSize, setFileSize] = useState('100')
  const [fileSizeUnit, setFileSizeUnit] = useState('MB')
  const [speed, setSpeed] = useState('10')
  const [speedUnit, setSpeedUnit] = useState('Mbps')
  const [showResults, setShowResults] = useState(false)

  const calculateTime = () => {
    let sizeInBits = parseFloat(fileSize)
    let speedInBits = parseFloat(speed)
    
    // Convert file size to bits
    switch(fileSizeUnit) {
      case 'KB': sizeInBits *= 1024 * 8; break
      case 'MB': sizeInBits *= 1024 * 1024 * 8; break
      case 'GB': sizeInBits *= 1024 * 1024 * 1024 * 8; break
      case 'TB': sizeInBits *= 1024 * 1024 * 1024 * 1024 * 8; break
      default: sizeInBits *= 8; break
    }
    
    // Convert speed to bits per second
    switch(speedUnit) {
      case 'Kbps': speedInBits *= 1000; break
      case 'Mbps': speedInBits *= 1000000; break
      case 'Gbps': speedInBits *= 1000000000; break
      default: break
    }
    
    const timeInSeconds = sizeInBits / speedInBits
    return timeInSeconds
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(1)} seconds`
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)} minutes`
    if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} hours`
    return `${(seconds / 86400).toFixed(1)} days`
  }

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setFileSize('100')
    setFileSizeUnit('MB')
    setSpeed('10')
    setSpeedUnit('Mbps')
    setShowResults(false)
  }

  const time = showResults ? calculateTime() : 0

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bandwidth Calculator</h1>
            <p className="text-purple-100 text-lg">Calculate download/upload time based on file size and connection speed</p>
          </div>
          <Wifi className="w-16 h-16 text-purple-200" />
        </div>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">File Size</label>
            <div className="flex">
              <input
                type="number"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="0"
                title="Enter file size"
              />
              <select
                value={fileSizeUnit}
                onChange={(e) => setFileSizeUnit(e.target.value)}
                className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                title="Select file size unit"
              >
                <option value="B">Bytes</option>
                <option value="KB">KB</option>
                <option value="MB">MB</option>
                <option value="GB">GB</option>
                <option value="TB">TB</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Connection Speed</label>
            <div className="flex">
              <input
                type="number"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="0"
                title="Enter connection speed"
              />
              <select
                value={speedUnit}
                onChange={(e) => setSpeedUnit(e.target.value)}
                className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                title="Select speed unit"
              >
                <option value="bps">bps</option>
                <option value="Kbps">Kbps</option>
                <option value="Mbps">Mbps</option>
                <option value="Gbps">Gbps</option>
              </select>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Calculate Transfer Time
          </button>
        </div>

        {showResults && (
          <>
            {/* Share Options - Moved to Top */}
            <div className="bg-white p-6 rounded-lg border border-purple-200 mb-4">
              <ResultSharing
                title="Bandwidth Calculation Result"
                inputs={[
                  { label: "File Size", value: `${fileSize} ${fileSizeUnit}` },
                  { label: "Connection Speed", value: `${speed} ${speedUnit}` },
                  { label: "Calculation Type", value: "Transfer Time" }
                ]}
                result={{ 
                  label: "Transfer Time", 
                  value: formatTime(time),
                  unit: ""
                }}
                calculatorName="Bandwidth Calculator"
                className="mb-0"
              />
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 text-center">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Transfer Time Results</h3>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {formatTime(time)}
            </div>
            <div className="mt-4">
              <button onClick={handleReset} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                Reset
              </button>
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  )
}
