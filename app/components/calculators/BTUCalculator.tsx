'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Thermometer } from 'lucide-react'

export default function BTUCalculator() {
  const [length, setLength] = useState('')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateBTU = useCallback(() => {
    const l = parseFloat(length) || 0
    const w = parseFloat(width) || 0
    const h = parseFloat(height) || 0
    
    if (l === 0 || w === 0 || h === 0) return { heating: 0, cooling: 0 }
    
    const area = l * w
    const volume = area * h
    
    // Basic BTU calculation: 20 BTU per sq ft for heating, 25 BTU per sq ft for cooling
    const heatingBTU = area * 20
    const coolingBTU = area * 25
    
    return { heating: heatingBTU, cooling: coolingBTU }
  }, [length, width, height])

  const handleCalculate = () => {
    if (length && width && height) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setLength('')
    setWidth('')
    setHeight('')
    setShowResults(false)
  }

  const result = showResults ? calculateBTU() : { heating: 0, cooling: 0 }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">BTU Calculator</h1>
            <p className="text-emerald-100 text-lg">
              Calculate heating and cooling requirements for any room.
            </p>
          </div>
          <div className="hidden md:block">
            <Thermometer className="w-16 h-16 text-emerald-200" />
          </div>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="20"
              min="1"
              step="0.5"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Width (feet)</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="15"
              min="1"
              step="0.5"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Height (feet)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="8"
              min="6"
              step="0.5"
            />
          </div>
        </div>

        {length && width && height && (
          <div className="text-center mb-8">
            <button
              onClick={handleCalculate}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Calculate BTU Requirements
            </button>
          </div>
        )}

        {showResults && (
          <div className="space-y-6">
            <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-800 mb-4">BTU Requirements</h3>
              <div className="grid md:grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-emerald-700">{result.heating.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Heating BTU</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-700">{result.cooling.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Cooling BTU</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleReset}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Calculator Description Section */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">About BTU Calculator</h3>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 mb-4">
            Our comprehensive BTU calculator helps homeowners, contractors, and HVAC professionals 
            determine the heating and cooling requirements for any room or space. This essential 
            HVAC tool provides accurate BTU calculations to ensure proper system sizing, energy 
            efficiency, and optimal comfort in residential and commercial spaces.
          </p>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Heating BTU Requirements:</strong> Energy needed for heating (20 BTU/sq ft)</li>
            <li><strong>Cooling BTU Requirements:</strong> Energy needed for cooling (25 BTU/sq ft)</li>
            <li><strong>Room Dimensions:</strong> Length, width, and height calculations</li>
            <li><strong>Area and Volume:</strong> Square footage and cubic footage</li>
            <li><strong>System Sizing:</strong> HVAC equipment capacity requirements</li>
            <li><strong>Energy Planning:</strong> Heating and cooling load estimates</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">BTU Fundamentals</h4>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">What is BTU?</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>British Thermal Unit</li>
                <li>Standard energy measurement</li>
                <li>Amount of heat to raise 1 lb water 1°F</li>
                <li>Used in HVAC industry</li>
                <li>International standard</li>
                <li>Energy efficiency metric</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Heating vs. Cooling</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>Heating: 20 BTU per sq ft</li>
                <li>Cooling: 25 BTU per sq ft</li>
                <li>Different efficiency factors</li>
                <li>Climate considerations</li>
                <li>Equipment differences</li>
                <li>Load calculations vary</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Room Factors</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>Square footage</li>
                <li>Ceiling height</li>
                <li>Room orientation</li>
                <li>Window exposure</li>
                <li>Insulation quality</li>
                <li>Air infiltration</li>
              </ul>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <h5 className="font-semibold text-emerald-800 mb-1">Heating BTU</h5>
              <p className="text-emerald-700 text-sm">Energy needed for heating</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <h5 className="font-semibold text-blue-800 mb-1">Cooling BTU</h5>
              <p className="text-blue-700 text-sm">Energy needed for cooling</p>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
          <p className="text-gray-700 mb-4">
            Enter the length, width, and height of your room in feet. The calculator will provide 
            the heating and cooling BTU requirements based on standard industry calculations, helping 
            you determine the appropriate HVAC system size for your space.
          </p>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">BTU Calculation Methods</h4>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Basic Method (This Calculator):</strong></p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Heating: 20 BTU per square foot</li>
                  <li>Cooling: 25 BTU per square foot</li>
                  <li>Good for standard rooms</li>
                  <li>Quick estimates</li>
                  <li>General guidelines</li>
                  <li>Starting point for sizing</li>
                </ul>
              </div>
              <div>
                <p><strong>Advanced Methods:</strong></p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Manual J calculations</li>
                  <li>Heat load analysis</li>
                  <li>Climate zone factors</li>
                  <li>Building envelope analysis</li>
                  <li>Professional software</li>
                  <li>Detailed load calculations</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting BTU Requirements</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Climate Zone:</strong> Hot climates need more cooling, cold climates need more heating</li>
            <li><strong>Insulation Quality:</strong> Better insulation reduces BTU requirements</li>
            <li><strong>Window Area:</strong> Large windows increase heating/cooling loads</li>
            <li><strong>Room Orientation:</strong> South-facing rooms get more sun exposure</li>
            <li><strong>Ceiling Height:</strong> Higher ceilings increase volume and BTU needs</li>
            <li><strong>Air Infiltration:</strong> Drafty rooms need more heating/cooling</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Room Type Considerations</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Residential Spaces</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li><strong>Bedrooms:</strong> Standard calculations work well</li>
                <li><strong>Living Rooms:</strong> May need extra capacity for gatherings</li>
                <li><strong>Kitchens:</strong> Heat from appliances increases cooling needs</li>
                <li><strong>Bathrooms:</strong> Humidity affects cooling requirements</li>
                <li><strong>Basements:</strong> Often need less cooling, more heating</li>
                <li><strong>Attics:</strong> High heat gain in summer</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Commercial Spaces</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li><strong>Offices:</strong> Consider occupancy and equipment</li>
                <li><strong>Retail:</strong> Lighting and customer traffic affect loads</li>
                <li><strong>Restaurants:</strong> Kitchen heat significantly increases cooling</li>
                <li><strong>Warehouses:</strong> High ceilings and poor insulation</li>
                <li><strong>Gyms:</strong> High occupancy and activity levels</li>
                <li><strong>Medical:</strong> Specialized equipment and requirements</li>
              </ul>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">System Sizing Guidelines</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Undersizing:</strong> System can't meet demand, poor comfort, high energy bills</li>
            <li><strong>Oversizing:</strong> Short cycling, poor efficiency, reduced lifespan</li>
            <li><strong>Proper Sizing:</strong> Optimal comfort, efficiency, and longevity</li>
            <li><strong>Safety Factors:</strong> Add 10-20% for extreme conditions</li>
            <li><strong>Professional Input:</strong> Complex spaces need expert analysis</li>
            <li><strong>Future Considerations:</strong> Plan for potential additions or changes</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Energy Efficiency Tips</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Proper Insulation:</strong> Reduce heat transfer through walls and ceilings</li>
            <li><strong>Energy-Efficient Windows:</strong> Double or triple-pane with low-E coatings</li>
            <li><strong>Air Sealing:</strong> Reduce drafts and air infiltration</li>
            <li><strong>Programmable Thermostats:</strong> Adjust temperatures based on occupancy</li>
            <li><strong>Regular Maintenance:</strong> Clean filters and service equipment</li>
            <li><strong>Zoning Systems:</strong> Control different areas independently</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">When to Use Professional Calculations</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Complex Spaces:</strong> Multiple rooms, open floor plans, cathedral ceilings</li>
            <li><strong>Commercial Buildings:</strong> High occupancy, specialized equipment</li>
            <li><strong>Extreme Climates:</strong> Very hot or cold regions</li>
            <li><strong>Energy Code Compliance:</strong> New construction or major renovations</li>
            <li><strong>High-Efficiency Systems:</strong> Heat pumps, geothermal, solar systems</li>
            <li><strong>Historical Buildings:</strong> Unique construction and materials</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Common BTU Calculation Mistakes</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Ignoring Height:</strong> Only using square footage without considering volume</li>
            <li><strong>Forgetting Climate:</strong> Using same calculations for all regions</li>
            <li><strong>Missing Factors:</strong> Not considering windows, insulation, or orientation</li>
            <li><strong>Oversizing:</strong> Adding too much capacity "just to be safe"</li>
            <li><strong>Undersizing:</strong> Trying to save money with smaller systems</li>
            <li><strong>Ignoring Future Needs:</strong> Not planning for additions or changes</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">BTU to Equipment Sizing</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Window Units:</strong> 5,000-25,000 BTU range</li>
            <li><strong>Portable AC:</strong> 8,000-14,000 BTU range</li>
            <li><strong>Mini-Splits:</strong> 9,000-36,000 BTU range</li>
            <li><strong>Central AC:</strong> 18,000-60,000+ BTU range</li>
            <li><strong>Heat Pumps:</strong> Same BTU range as cooling capacity</li>
            <li><strong>Furnaces:</strong> 40,000-200,000+ BTU range</li>
          </ul>
          
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-emerald-500">
            <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
            <p className="text-gray-700 text-sm">
              While this calculator provides a good starting point for BTU requirements, remember that 
              proper HVAC sizing involves many factors beyond just room dimensions. Consider consulting 
              with an HVAC professional for complex spaces, commercial applications, or when installing 
              new systems. Also, remember that energy efficiency improvements like better insulation, 
              energy-efficient windows, and proper air sealing can significantly reduce your BTU 
              requirements, leading to smaller, more efficient systems and lower energy bills.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
