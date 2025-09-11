'use client'

import React, { useState, useCallback } from 'react'
import { Ruler, Calculator as CalculatorIcon, RotateCcw, ArrowRight, Thermometer, Scale } from 'lucide-react'
import ResultSharing from '../ResultSharing'

interface ConversionCategory {
  id: string
  name: string
  icon: React.ReactNode
  units: {
    id: string
    name: string
    symbol: string
    toBase: (value: number) => number
    fromBase: (value: number) => number
  }[]
}

export default function UnitConverter() {
  const [selectedCategory, setSelectedCategory] = useState('length')
  const [fromUnit, setFromUnit] = useState('')
  const [toUnit, setToUnit] = useState('')
  const [fromValue, setFromValue] = useState('1')
  const [toValue, setToValue] = useState('')

  const conversionCategories: ConversionCategory[] = [
    {
      id: 'length',
      name: 'Length',
      icon: <Ruler className="w-5 h-5" />,
      units: [
        { id: 'mm', name: 'Millimeter', symbol: 'mm', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
        { id: 'cm', name: 'Centimeter', symbol: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
        { id: 'm', name: 'Meter', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
        { id: 'km', name: 'Kilometer', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
        { id: 'in', name: 'Inch', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
        { id: 'ft', name: 'Foot', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
        { id: 'yd', name: 'Yard', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
        { id: 'mi', name: 'Mile', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 }
      ]
    },
    {
      id: 'weight',
      name: 'Weight',
      icon: <Scale className="w-5 h-5" />,
      units: [
        { id: 'mg', name: 'Milligram', symbol: 'mg', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
        { id: 'g', name: 'Gram', symbol: 'g', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
        { id: 'kg', name: 'Kilogram', symbol: 'kg', toBase: (v) => v, fromBase: (v) => v },
        { id: 't', name: 'Metric Ton', symbol: 't', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
        { id: 'oz', name: 'Ounce', symbol: 'oz', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
        { id: 'lb', name: 'Pound', symbol: 'lb', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
        { id: 'st', name: 'Stone', symbol: 'st', toBase: (v) => v * 6.35029, fromBase: (v) => v / 6.35029 }
      ]
    },
    {
      id: 'temperature',
      name: 'Temperature',
      icon: <Thermometer className="w-5 h-5" />,
      units: [
        { id: 'c', name: 'Celsius', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
        { id: 'f', name: 'Fahrenheit', symbol: '°F', toBase: (v) => (v - 32) * 5/9, fromBase: (v) => v * 9/5 + 32 },
        { id: 'k', name: 'Kelvin', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 }
      ]
    },
    {
      id: 'area',
      name: 'Area',
      icon: <Ruler className="w-5 h-5" />,
      units: [
        { id: 'mm2', name: 'Square Millimeter', symbol: 'mm²', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
        { id: 'cm2', name: 'Square Centimeter', symbol: 'cm²', toBase: (v) => v / 10000, fromBase: (v) => v * 10000 },
        { id: 'm2', name: 'Square Meter', symbol: 'm²', toBase: (v) => v, fromBase: (v) => v },
        { id: 'km2', name: 'Square Kilometer', symbol: 'km²', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
        { id: 'in2', name: 'Square Inch', symbol: 'in²', toBase: (v) => v * 0.00064516, fromBase: (v) => v / 0.00064516 },
        { id: 'ft2', name: 'Square Foot', symbol: 'ft²', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
        { id: 'ac', name: 'Acre', symbol: 'ac', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 }
      ]
    },
    {
      id: 'volume',
      name: 'Volume',
      icon: <Ruler className="w-5 h-5" />,
      units: [
        { id: 'ml', name: 'Milliliter', symbol: 'mL', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
        { id: 'l', name: 'Liter', symbol: 'L', toBase: (v) => v, fromBase: (v) => v },
        { id: 'm3', name: 'Cubic Meter', symbol: 'm³', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
        { id: 'gal', name: 'Gallon (US)', symbol: 'gal', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
        { id: 'qt', name: 'Quart (US)', symbol: 'qt', toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
        { id: 'pt', name: 'Pint (US)', symbol: 'pt', toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
        { id: 'cup', name: 'Cup (US)', symbol: 'cup', toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 }
      ]
    }
  ]

  const currentCategory = conversionCategories.find(cat => cat.id === selectedCategory)

  const convert = useCallback(() => {
    if (!fromUnit || !toUnit || !fromValue || !currentCategory) return

    const fromUnitData = currentCategory.units.find(u => u.id === fromUnit)
    const toUnitData = currentCategory.units.find(u => u.id === toUnit)

    if (!fromUnitData || !toUnitData) return

    const value = parseFloat(fromValue)
    if (isNaN(value)) return

    // Convert to base unit, then to target unit
    const baseValue = fromUnitData.toBase(value)
    const result = toUnitData.fromBase(baseValue)

    setToValue(result.toFixed(6).replace(/\.?0+$/, ''))
  }, [fromUnit, toUnit, fromValue, currentCategory])

  React.useEffect(() => {
    if (currentCategory && currentCategory.units.length > 0) {
      if (!fromUnit) setFromUnit(currentCategory.units[0].id)
      if (!toUnit) setToUnit(currentCategory.units[1]?.id || currentCategory.units[0].id)
    }
  }, [currentCategory, fromUnit, toUnit])

  React.useEffect(() => {
    convert()
  }, [convert])

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setFromUnit('')
    setToUnit('')
    setToValue('')
  }

  const swapUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    setFromValue(toValue)
    setToValue('')
  }

  const reset = () => {
    if (currentCategory) {
      setFromUnit(currentCategory.units[0].id)
      setToUnit(currentCategory.units[1]?.id || currentCategory.units[0].id)
      setFromValue('1')
      setToValue('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <Ruler className="w-12 h-12 mr-3 text-blue-600" />
            Unit Converter
          </h1>
          <p className="text-xl text-gray-600">
            Convert between different units of measurement
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <CalculatorIcon className="w-6 h-6 mr-2 text-blue-600" />
                Conversion Type
              </h2>

              <div className="space-y-3">
                {conversionCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`w-full flex items-center p-3 rounded-lg font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.icon}
                    <span className="ml-3">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {currentCategory?.name} Conversion
              </h2>

              {currentCategory && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From
                      </label>
                      <select
                        value={fromUnit}
                        onChange={(e) => setFromUnit(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        aria-label="From unit"
                        title="Select source unit"
                      >
                        {currentCategory.units.map((unit) => (
                          <option key={unit.id} value={unit.id}>
                            {unit.name} ({unit.symbol})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex justify-center">
                      <button
                        onClick={swapUnits}
                        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Swap units"
                        aria-label="Swap units"
                      >
                        <ArrowRight className="w-6 h-6 text-gray-600" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        To
                      </label>
                      <select
                        value={toUnit}
                        onChange={(e) => setToUnit(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        aria-label="To unit"
                        title="Select target unit"
                      >
                        {currentCategory.units.map((unit) => (
                          <option key={unit.id} value={unit.id}>
                            {unit.name} ({unit.symbol})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Value
                      </label>
                      <input
                        type="number"
                        value={fromValue}
                        onChange={(e) => setFromValue(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder="1"
                        step="any"
                        title="Enter value to convert"
                        aria-label="Value to convert"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Result
                      </label>
                      <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-lg font-semibold text-gray-800">
                        {toValue || '0'}
                      </div>
                    </div>
                  </div>

                  {/* Share Options - Moved to Top */}
                  {toValue && (
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <ResultSharing
                        title="Unit Conversion Result"
                        inputs={[
                          { label: "From", value: `${fromValue} ${currentCategory?.units.find(u => u.id === fromUnit)?.symbol || ''}` },
                          { label: "To", value: currentCategory?.units.find(u => u.id === toUnit)?.name || '' },
                          { label: "Category", value: currentCategory?.name || '' }
                        ]}
                        result={{ 
                          label: "Converted Value", 
                          value: toValue,
                          unit: currentCategory?.units.find(u => u.id === toUnit)?.symbol || ""
                        }}
                        calculatorName="Unit Converter"
                        className="mb-0"
                      />
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={reset}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      title="Reset to defaults"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200 mt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Conversion Tips</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• <strong>Length:</strong> Convert between metric and imperial units</p>
                <p>• <strong>Weight:</strong> Convert between different weight systems</p>
                <p>• <strong>Temperature:</strong> Convert between Celsius, Fahrenheit, and Kelvin</p>
                <p>• <strong>Area:</strong> Convert between different area measurements</p>
                <p>• <strong>Volume:</strong> Convert between different volume units</p>
                <p>• <strong>Swap:</strong> Use the arrow button to quickly swap units</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center mt-12 text-gray-500">
        </footer>
      </div>
    </div>
  )
}
