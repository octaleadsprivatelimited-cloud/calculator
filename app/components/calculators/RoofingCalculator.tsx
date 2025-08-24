'use client'

import React, { useState, useCallback } from 'react'
import { Home, Calculator, TrendingUp, Share2, Download, Printer, Ruler } from 'lucide-react'
import ShareModal from '../ShareModal'

interface RoofingMaterial {
  name: string
  key: string
  pricePerSqM: number
  wasteFactor: number
  description: string
  lifespan: number
}

const roofingMaterials: RoofingMaterial[] = [
  { name: 'Asphalt Shingles', key: 'asphalt', pricePerSqM: 25, wasteFactor: 10, description: 'Most common, affordable', lifespan: 20 },
  { name: 'Metal Roofing', key: 'metal', pricePerSqM: 45, wasteFactor: 5, description: 'Durable, long-lasting', lifespan: 50 },
  { name: 'Clay Tiles', key: 'clay', pricePerSqM: 80, wasteFactor: 15, description: 'Traditional, elegant', lifespan: 100 },
  { name: 'Slate Tiles', key: 'slate', pricePerSqM: 120, wasteFactor: 20, description: 'Premium, very long-lasting', lifespan: 150 },
  { name: 'Wood Shingles', key: 'wood', pricePerSqM: 60, wasteFactor: 12, description: 'Natural, rustic look', lifespan: 30 },
  { name: 'Synthetic Slate', key: 'synthetic', pricePerSqM: 70, wasteFactor: 8, description: 'Slate look, lighter weight', lifespan: 50 }
]

export default function RoofingCalculator() {
  const [roofType, setRoofType] = useState('gable')
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    pitch: '4.5',
    overhang: '0.3'
  })
  const [selectedMaterial, setSelectedMaterial] = useState(0)
  const [installationCost, setInstallationCost] = useState(35)
  const [underlayment, setUnderlayment] = useState(12)
  const [showShareModal, setShowShareModal] = useState(false)

  const calculateRoofArea = useCallback((): number => {
    const length = parseFloat(dimensions.length) || 0
    const width = parseFloat(dimensions.width) || 0
    const pitch = parseFloat(dimensions.pitch) || 4.5
    const overhang = parseFloat(dimensions.overhang) || 0.3

    if (roofType === 'gable') {
      const roofLength = length + (2 * overhang)
      const roofWidth = width + (2 * overhang)
      const pitchMultiplier = Math.sqrt(1 + Math.pow(pitch / 12, 2))
      return roofLength * roofWidth * pitchMultiplier
    } else if (roofType === 'hip') {
      const roofLength = length + (2 * overhang)
      const roofWidth = width + (2 * overhang)
      const pitchMultiplier = Math.sqrt(1 + Math.pow(pitch / 12, 2))
      return roofLength * roofWidth * pitchMultiplier * 1.1 // 10% extra for hip roof complexity
    } else if (roofType === 'flat') {
      const roofLength = length + (2 * overhang)
      const roofWidth = width + (2 * overhang)
      return roofLength * roofWidth
    }
    return 0
  }, [roofType, dimensions])

  const calculateMaterials = useCallback(() => {
    const roofArea = calculateRoofArea()
    const material = roofingMaterials[selectedMaterial]
    
    if (!material || roofArea === 0) return null

    const wasteArea = roofArea * (material.wasteFactor / 100)
    const totalAreaWithWaste = roofArea + wasteArea
    const materialCost = totalAreaWithWaste * material.pricePerSqM
    const underlaymentCost = roofArea * underlayment
    const installationCostTotal = roofArea * installationCost
    const totalCost = materialCost + underlaymentCost + installationCostTotal

    // Calculate bundles/squares (1 square = 100 sq ft = 9.29 sq m)
    const squares = Math.ceil(totalAreaWithWaste / 9.29)

    return {
      roofArea: Math.round(roofArea * 100) / 100,
      wasteArea: Math.round(wasteArea * 100) / 100,
      totalAreaWithWaste: Math.round(totalAreaWithWaste * 100) / 100,
      squares: squares,
      materialCost: Math.round(materialCost * 100) / 100,
      underlaymentCost: Math.round(underlaymentCost * 100) / 100,
      installationCost: Math.round(installationCostTotal * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100
    }
  }, [calculateRoofArea, selectedMaterial, underlayment, installationCost])

  const handleDimensionChange = (field: string, value: string) => {
    setDimensions(prev => ({ ...prev, [field]: value }))
  }

  const handleShare = () => setShowShareModal(true)
  const handlePrint = () => window.print()
  const handleDownload = () => {
    const materials = calculateMaterials()
    
    const data = `Roofing Calculator Results\n\nRoof Type: ${roofType}\nDimensions: ${dimensions.length}m × ${dimensions.width}m\nPitch: ${dimensions.pitch}/12\n\nMaterial: ${roofingMaterials[selectedMaterial].name}\nRoof Area: ${materials?.roofArea} m²\nWaste Area: ${materials?.wasteArea} m²\nTotal with Waste: ${materials?.totalAreaWithWaste} m²\nSquares: ${materials?.squares}\n\nCosts:\nMaterial: $${materials?.materialCost}\nUnderlayment: $${materials?.underlaymentCost}\nInstallation: $${materials?.installationCost}\nTotal: $${materials?.totalCost}`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'roofing-calculator-results.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const materials = calculateMaterials()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <Home className="w-16 h-16 mr-4 text-slate-600" />
            Roofing Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate roofing materials, costs, and waste for different roof types. Get accurate estimates for shingles, tiles, metal, and other roofing materials.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Calculator className="w-6 h-6 mr-2 text-slate-600" />
                Roof Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Roof Type</label>
                  <select
                    value={roofType}
                    onChange={(e) => setRoofType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    title="Select the roof type"
                    aria-label="Roof type"
                  >
                    <option value="gable">Gable Roof</option>
                    <option value="hip">Hip Roof</option>
                    <option value="flat">Flat Roof</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Building Length (m)</label>
                  <input
                    type="number"
                    value={dimensions.length}
                    onChange={(e) => handleDimensionChange('length', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    title="Enter building length in meters"
                    aria-label="Building length in meters"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Building Width (m)</label>
                  <input
                    type="number"
                    value={dimensions.width}
                    onChange={(e) => handleDimensionChange('width', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    title="Enter building width in meters"
                    aria-label="Building width in meters"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Roof Pitch (rise/12)</label>
                  <input
                    type="number"
                    value={dimensions.pitch}
                    onChange={(e) => handleDimensionChange('pitch', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    placeholder="4.5"
                    step="0.5"
                    min="0"
                    title="Enter roof pitch as rise over 12 inches"
                    aria-label="Roof pitch rise over 12 inches"
                  />
                  <p className="text-xs text-gray-500 mt-1">4.5 = 4.5:12 pitch (common residential)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Overhang (m)</label>
                  <input
                    type="number"
                    value={dimensions.overhang}
                    onChange={(e) => handleDimensionChange('overhang', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    placeholder="0.30"
                    step="0.05"
                    min="0"
                    title="Enter roof overhang in meters"
                    aria-label="Roof overhang in meters"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Roofing Material</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Material Type</label>
                  <select
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    title="Select the roofing material"
                    aria-label="Roofing material"
                  >
                    {roofingMaterials.map((material, index) => (
                      <option key={index} value={index}>
                        {material.name} - ${material.pricePerSqM}/m²
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {roofingMaterials[selectedMaterial]?.description} • {roofingMaterials[selectedMaterial]?.lifespan} year lifespan
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Installation Cost ($/m²)</label>
                  <input
                    type="number"
                    value={installationCost}
                    onChange={(e) => setInstallationCost(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    min="0"
                    step="1"
                    title="Enter installation cost per square meter"
                    aria-label="Installation cost per square meter"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Underlayment ($/m²)</label>
                  <input
                    type="number"
                    value={underlayment}
                    onChange={(e) => setUnderlayment(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    min="0"
                    step="1"
                    title="Enter underlayment cost per square meter"
                    aria-label="Underlayment cost per square meter"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Examples</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setRoofType('gable')
                    setDimensions({
                      ...dimensions,
                      length: '12',
                      width: '8',
                      pitch: '4.5',
                      overhang: '0.3'
                    })
                  }}
                  className="w-full text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                  title="Set example: 12m x 8m gable roof"
                  aria-label="Set example: 12m x 8m gable roof"
                >
                  🏠 Standard House (12m × 8m, 4.5:12 pitch)
                </button>
                <button
                  onClick={() => {
                    setRoofType('hip')
                    setDimensions({
                      ...dimensions,
                      length: '15',
                      width: '10',
                      pitch: '6',
                      overhang: '0.4'
                    })
                  }}
                  className="w-full text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                  title="Set example: 15m x 10m hip roof"
                  aria-label="Set example: 15m x 10m hip roof"
                >
                  🏗️ Large House (15m × 10m, 6:12 pitch, hip)
                </button>
                <button
                  onClick={() => {
                    setRoofType('flat')
                    setDimensions({
                      ...dimensions,
                      length: '20',
                      width: '15',
                      pitch: '0',
                      overhang: '0.2'
                    })
                  }}
                  className="w-full text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                  title="Set example: 20m x 15m flat roof"
                  aria-label="Set example: 20m x 15m flat roof"
                >
                  🏢 Commercial Building (20m × 15m, flat)
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-slate-600" />
                  Calculation Results
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Roof Area</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Roof Type:</span>
                        <span className="font-semibold text-slate-800">{roofType.charAt(0).toUpperCase() + roofType.slice(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Building Size:</span>
                        <span className="font-semibold text-slate-800">{dimensions.length || 0}m × {dimensions.width || 0}m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Roof Area:</span>
                        <span className="font-semibold text-slate-800">{materials?.roofArea || 0} m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Waste Area:</span>
                        <span className="font-semibold text-slate-800">{materials?.wasteArea || 0} m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Total with Waste:</span>
                        <span className="font-semibold text-slate-800">{materials?.totalAreaWithWaste || 0} m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Squares:</span>
                        <span className="font-semibold text-slate-800">{materials?.squares || 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">Cost Breakdown</h3>
                    {materials ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-blue-600">Material:</span>
                          <span className="font-semibold text-blue-800">${materials.materialCost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-600">Underlayment:</span>
                          <span className="font-semibold text-blue-800">${materials.underlaymentCost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-600">Installation:</span>
                          <span className="font-semibold text-blue-800">${materials.installationCost}</span>
                        </div>
                        <div className="border-t pt-2 mt-3">
                          <div className="flex justify-between">
                            <span className="text-blue-800 font-semibold">Total Cost:</span>
                            <span className="text-blue-800 font-bold text-lg">${materials.totalCost}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-blue-600">Enter dimensions to calculate costs</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">💡 Tips</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Steeper pitches require more material due to increased surface area</li>
                    <li>• Hip roofs typically need 10-15% more material than gable roofs</li>
                    <li>• Consider local building codes for minimum pitch requirements</li>
                    <li>• Factor in ventilation and flashing materials</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Share roofing calculator results"
                  aria-label="Share roofing calculator results"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  title="Download results as text file"
                  aria-label="Download roofing calculator results"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  title="Print roofing calculator results"
                  aria-label="Print roofing calculator results"
                >
                  <Printer className="w-5 h-5" />
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            title="Back to all calculators"
            aria-label="Back to all calculators"
          >
            <Calculator className="w-5 h-5" />
            Back to All Calculators
          </a>
        </div>
      </div>

      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          calculation={{
            expression: `${roofType} Roof - ${roofingMaterials[selectedMaterial]?.name}`,
            result: `${materials?.roofArea} m² - $${materials?.totalCost} total cost`,
            timestamp: new Date()
          }}
        />
      )}
    </div>
  )
}
