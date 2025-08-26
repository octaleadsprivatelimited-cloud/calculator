'use client'
import React, { useState } from 'react'
import { Calculator, TreePine, Package } from 'lucide-react'
import ResultSharing from '../ResultSharing'

export default function MulchCalculator() {
  const [length, setLength] = useState('')
  const [width, setWidth] = useState('')
  const [depth, setDepth] = useState('3')
  const [showResults, setShowResults] = useState(false)

  const calculateMulch = () => {
    const l = parseFloat(length)
    const w = parseFloat(width)
    const d = parseFloat(depth)
    
    if (!l || !w || !d) return null
    
    const area = l * w
    const volume = area * (d / 12) // Convert inches to feet
    const cubicYards = volume / 27 // Convert cubic feet to cubic yards
    const bags = Math.ceil(volume * 13.5) // 1 cubic foot = 13.5 bags
    
    return { area, volume, cubicYards, bags }
  }

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setLength('')
    setWidth('')
    setDepth('3')
    setShowResults(false)
  }

  const mulch = showResults ? calculateMulch() : null

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mulch Calculator</h1>
            <p className="text-green-100 text-lg">Calculate mulch requirements for your garden or landscaping project</p>
          </div>
          <TreePine className="w-16 h-16 text-green-200" />
        </div>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Length (feet)</label>
            <input
              type="number"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              min="0"
              step="0.1"
              title="Enter length in feet"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Width (feet)</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              min="0"
              step="0.1"
              title="Enter width in feet"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Depth (inches)</label>
            <input
              type="number"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              min="1"
              max="12"
              title="Enter depth in inches"
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Calculate Mulch Needs
          </button>
        </div>

        {showResults && mulch && (
          <>
            {/* Share Options - Moved to Top */}
            <div className="bg-white p-6 rounded-lg border border-green-200 mb-4">
              <ResultSharing
                title="Mulch Calculation Result"
                inputs={[
                  { label: "Length", value: `${length} feet` },
                  { label: "Width", value: `${width} feet` },
                  { label: "Depth", value: `${depth} inches` }
                ]}
                result={{ 
                  label: "Mulch Needed", 
                  value: `${mulch.bags} bags`,
                  unit: ""
                }}
                calculatorName="Mulch Calculator"
                className="mb-0"
              />
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Mulch Calculation Results</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold text-green-600">{mulch.area.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Square Feet</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{mulch.volume.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Cubic Feet</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{mulch.cubicYards.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Cubic Yards</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{mulch.bags}</div>
                <div className="text-sm text-gray-600">2 cu ft Bags</div>
              </div>
            </div>
            <div className="mt-4">
              <button onClick={handleReset} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                Reset
              </button>
            </div>
          </div>
          </>
        )}
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Mulch Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive mulch calculator helps gardeners, landscapers, and homeowners 
              determine the exact amount of mulch needed for their projects. This essential 
              tool provides accurate calculations for garden beds, landscaping areas, and 
              mulching projects, ensuring you purchase the right amount of material.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Area Coverage:</strong> Total square footage to be mulched</li>
              <li><strong>Volume Requirements:</strong> Cubic feet and cubic yards needed</li>
              <li><strong>Bag Quantities:</strong> Number of standard 2 cubic foot bags</li>
              <li><strong>Depth Optimization:</strong> Recommended mulch depth for different applications</li>
              <li><strong>Cost Estimation:</strong> Material quantity for budget planning</li>
              <li><strong>Project Planning:</strong> Accurate material requirements</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Mulch Depth Guidelines</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Light Applications</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>1-2 inches:</strong> Annual flower beds</li>
                  <li><strong>2 inches:</strong> Perennial gardens</li>
                  <li><strong>2-3 inches:</strong> Vegetable gardens</li>
                  <li><strong>Benefits:</strong> Weed suppression, moisture retention</li>
                  <li><strong>Considerations:</strong> May need replenishing</li>
                  <li><strong>Best For:</strong> Delicate plants and annuals</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Heavy Applications</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>3-4 inches:</strong> Tree and shrub beds</li>
                  <li><strong>4-6 inches:</strong> Pathways and walkways</li>
                  <li><strong>6+ inches:</strong> Erosion control</li>
                  <li><strong>Benefits:</strong> Long-lasting, maximum weed control</li>
                  <li><strong>Considerations:</strong> Higher cost, may smother plants</li>
                  <li><strong>Best For:</strong> Established landscapes</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Square Feet</h5>
                <p className="text-green-700 text-sm">Area to be covered</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Cubic Feet</h5>
                <p className="text-blue-700 text-sm">Volume of mulch needed</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Cubic Yards</h5>
                <p className="text-purple-700 text-sm">Bulk delivery measure</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-800 mb-1">Bags</h5>
                <p className="text-orange-700 text-sm">Retail bag quantity</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter the length and width of your area in feet, and select the desired mulch depth in inches. 
              The calculator will automatically compute the area, volume, and quantity of mulch needed. 
              Use the results to determine whether to purchase bags or order bulk delivery.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Mulch Types and Applications</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Organic Mulches:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li><strong>Bark Mulch:</strong> Long-lasting, decorative</li>
                    <li><strong>Wood Chips:</strong> Affordable, good for paths</li>
                    <li><strong>Straw:</strong> Lightweight, good for vegetables</li>
                    <li><strong>Compost:</strong> Nutrient-rich, soil improvement</li>
                    <li><strong>Pine Needles:</strong> Acid-loving plants</li>
                    <li><strong>Leaves:</strong> Free, natural decomposition</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Inorganic Mulches:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li><strong>Landscape Fabric:</strong> Weed barrier, long-lasting</li>
                    <li><strong>Gravel/Stone:</strong> Permanent, low maintenance</li>
                    <li><strong>Rubber Mulch:</strong> Playgrounds, safety</li>
                    <li><strong>Plastic Sheeting:</strong> Weed control, heat retention</li>
                    <li><strong>Lava Rock:</strong> Decorative, permanent</li>
                    <li><strong>Glass Mulch:</strong> Decorative, unique appearance</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Benefits of Proper Mulching</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Plant Health</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Moisture Retention:</strong> Reduces water evaporation</li>
                  <li><strong>Temperature Regulation:</strong> Insulates soil from extremes</li>
                  <li><strong>Weed Suppression:</strong> Blocks light from weed seeds</li>
                  <li><strong>Soil Protection:</strong> Prevents erosion and compaction</li>
                  <li><strong>Nutrient Addition:</strong> Organic mulches decompose</li>
                  <li><strong>Root Protection:</strong> Shields from damage</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Landscape Benefits</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Aesthetic Appeal:</strong> Clean, finished appearance</li>
                  <li><strong>Path Definition:</strong> Clear walkway boundaries</li>
                  <li><strong>Low Maintenance:</strong> Reduces garden upkeep</li>
                  <li><strong>Professional Look:</strong> Enhanced curb appeal</li>
                  <li><strong>Seasonal Interest:</strong> Year-round visual appeal</li>
                  <li><strong>Property Value:</strong> Improved landscape quality</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Mulching Best Practices</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Prepare the Area:</strong> Remove weeds and level the surface</li>
              <li><strong>Edge the Beds:</strong> Create clean boundaries with edging</li>
              <li><strong>Apply Evenly:</strong> Spread mulch to consistent depth</li>
              <li><strong>Avoid Plant Contact:</strong> Keep mulch away from stems and trunks</li>
              <li><strong>Refresh Annually:</strong> Top up mulch as it decomposes</li>
              <li><strong>Choose Quality:</strong> Select appropriate mulch for your needs</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Seasonal Mulching Guide</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Spring Mulching</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Timing:</strong> After soil warms up</li>
                  <li><strong>Purpose:</strong> Weed suppression, moisture retention</li>
                  <li><strong>Depth:</strong> 2-3 inches for most applications</li>
                  <li><strong>Materials:</strong> Fresh bark, wood chips</li>
                  <li><strong>Benefits:</strong> Early season weed control</li>
                  <li><strong>Considerations:</strong> Allow soil to warm first</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Fall Mulching</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Timing:</strong> After first frost</li>
                  <li><strong>Purpose:</strong> Winter protection, soil insulation</li>
                  <li><strong>Depth:</strong> 3-4 inches for winter protection</li>
                  <li><strong>Materials:</strong> Shredded leaves, straw</li>
                  <li><strong>Benefits:</strong> Root protection from freezing</li>
                  <li><strong>Considerations:</strong> Remove in spring</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Cost Considerations</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Bulk vs. Bags:</strong> Compare cost per cubic yard</li>
              <li><strong>Delivery Fees:</strong> Factor in bulk delivery costs</li>
              <li><strong>Quality Differences:</strong> Premium mulches cost more</li>
              <li><strong>Volume Discounts:</strong> Larger orders often cheaper</li>
              <li><strong>Local Sources:</strong> Check for free or low-cost options</li>
              <li><strong>Long-term Value:</strong> Consider durability and lifespan</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Mulching Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Too Much Mulch:</strong> Can smother plants and roots</li>
              <li><strong>Volcano Mulching:</strong> Piling mulch against tree trunks</li>
              <li><strong>Wrong Material:</strong> Using inappropriate mulch type</li>
              <li><strong>Uneven Application:</strong> Inconsistent depth and coverage</li>
              <li><strong>Ignoring Edges:</strong> Poor boundary definition</li>
              <li><strong>Forgetting Maintenance:</strong> Not refreshing as needed</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Environmental Considerations</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Sustainable Sources:</strong> Choose locally produced materials</li>
              <li><strong>Organic Options:</strong> Support natural decomposition</li>
              <li><strong>Water Conservation:</strong> Mulch reduces irrigation needs</li>
              <li><strong>Soil Health:</strong> Organic mulches improve soil structure</li>
              <li><strong>Wildlife Support:</strong> Natural mulches provide habitat</li>
              <li><strong>Carbon Sequestration:</strong> Organic materials store carbon</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Always measure your area accurately and consider adding 10-15% extra mulch to account for 
                settling and uneven application. For large projects, compare bulk delivery costs with bag 
                prices - bulk is usually more cost-effective. Remember that different mulch types have 
                different lifespans and maintenance requirements. Choose the right depth for your specific 
                application and plants, and don't forget to edge your beds for a professional finish.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
