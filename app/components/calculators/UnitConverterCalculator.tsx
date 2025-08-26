'use client';

import React, { useState } from 'react';
import { Calculator, Ruler, Scale, Thermometer, Square, Package, Zap } from 'lucide-react';

interface ConversionCategory {
  name: string;
  icon: React.ReactNode;
  units: { name: string; value: number; symbol: string }[];
}

const UnitConverterCalculator: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('length');
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');
  const [fromValue, setFromValue] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const conversionCategories: ConversionCategory[] = [
    {
      name: 'length',
      icon: <Ruler className="w-6 h-6" />,
      units: [
        { name: 'Meter', value: 1, symbol: 'm' },
        { name: 'Kilometer', value: 1000, symbol: 'km' },
        { name: 'Centimeter', value: 0.01, symbol: 'cm' },
        { name: 'Millimeter', value: 0.001, symbol: 'mm' },
        { name: 'Mile', value: 1609.344, symbol: 'mi' },
        { name: 'Yard', value: 0.9144, symbol: 'yd' },
        { name: 'Foot', value: 0.3048, symbol: 'ft' },
        { name: 'Inch', value: 0.0254, symbol: 'in' },
      ]
    },
    {
      name: 'weight',
      icon: <Scale className="w-6 h-6" />,
      units: [
        { name: 'Kilogram', value: 1, symbol: 'kg' },
        { name: 'Gram', value: 0.001, symbol: 'g' },
        { name: 'Milligram', value: 0.000001, symbol: 'mg' },
        { name: 'Pound', value: 0.45359237, symbol: 'lb' },
        { name: 'Ounce', value: 0.028349523125, symbol: 'oz' },
        { name: 'Ton', value: 1000, symbol: 't' },
        { name: 'Stone', value: 6.35029318, symbol: 'st' },
      ]
    },
    {
      name: 'temperature',
      icon: <Thermometer className="w-6 h-6" />,
      units: [
        { name: 'Celsius', value: 0, symbol: '°C' },
        { name: 'Fahrenheit', value: 1, symbol: '°F' },
        { name: 'Kelvin', value: 2, symbol: 'K' },
      ]
    },
    {
      name: 'area',
      icon: <Square className="w-6 h-6" />,
      units: [
        { name: 'Square Meter', value: 1, symbol: 'm²' },
        { name: 'Square Kilometer', value: 1000000, symbol: 'km²' },
        { name: 'Square Centimeter', value: 0.0001, symbol: 'cm²' },
        { name: 'Square Mile', value: 2589988.110336, symbol: 'mi²' },
        { name: 'Acre', value: 4046.8564224, symbol: 'ac' },
        { name: 'Square Yard', value: 0.83612736, symbol: 'yd²' },
        { name: 'Square Foot', value: 0.09290304, symbol: 'ft²' },
        { name: 'Square Inch', value: 0.00064516, symbol: 'in²' },
      ]
    },
    {
      name: 'volume',
      icon: <Package className="w-6 h-6" />,
      units: [
        { name: 'Cubic Meter', value: 1, symbol: 'm³' },
        { name: 'Liter', value: 0.001, symbol: 'L' },
        { name: 'Milliliter', value: 0.000001, symbol: 'mL' },
        { name: 'Gallon (US)', value: 0.003785411784, symbol: 'gal' },
        { name: 'Quart (US)', value: 0.000946352946, symbol: 'qt' },
        { name: 'Pint (US)', value: 0.000473176473, symbol: 'pt' },
        { name: 'Cup (US)', value: 0.000236588236, symbol: 'cup' },
        { name: 'Cubic Foot', value: 0.028316846592, symbol: 'ft³' },
        { name: 'Cubic Inch', value: 0.000016387064, symbol: 'in³' },
      ]
    },
    {
      name: 'speed',
      icon: <Zap className="w-6 h-6" />,
      units: [
        { name: 'Meter per Second', value: 1, symbol: 'm/s' },
        { name: 'Kilometer per Hour', value: 0.277777778, symbol: 'km/h' },
        { name: 'Mile per Hour', value: 0.44704, symbol: 'mph' },
        { name: 'Knot', value: 0.514444444, symbol: 'kt' },
        { name: 'Foot per Second', value: 0.3048, symbol: 'ft/s' },
      ]
    }
  ];

  const currentCategory = conversionCategories.find(cat => cat.name === selectedCategory);

  const convertTemperature = (value: number, fromUnit: string, toUnit: string): number => {
    let celsius: number;
    
    // Convert to Celsius first
    switch (fromUnit) {
      case 'Celsius':
        celsius = value;
        break;
      case 'Fahrenheit':
        celsius = (value - 32) * 5/9;
        break;
      case 'Kelvin':
        celsius = value - 273.15;
        break;
      default:
        return value;
    }
    
    // Convert from Celsius to target unit
    switch (toUnit) {
      case 'Celsius':
        return celsius;
      case 'Fahrenheit':
        return celsius * 9/5 + 32;
      case 'Kelvin':
        return celsius + 273.15;
      default:
        return celsius;
    }
  };

  const convertUnit = (value: number, fromUnit: string, toUnit: string): number => {
    if (selectedCategory === 'temperature') {
      return convertTemperature(value, fromUnit, toUnit);
    }
    
    const fromUnitData = currentCategory?.units.find(unit => unit.name === fromUnit);
    const toUnitData = currentCategory?.units.find(unit => unit.name === toUnit);
    
    if (!fromUnitData || !toUnitData) return value;
    
    // Convert to base unit first, then to target unit
    const baseValue = value * fromUnitData.value;
    return baseValue / toUnitData.value;
  };

  const handleConversion = () => {
    if (!fromValue || !fromUnit || !toUnit) {
      setResult('');
      return;
    }
    
    const numericValue = parseFloat(fromValue);
    if (isNaN(numericValue)) {
      setResult('Please enter a valid number');
      return;
    }
    
    const convertedValue = convertUnit(numericValue, fromUnit, toUnit);
    setResult(convertedValue.toFixed(6));
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setFromUnit('');
    setToUnit('');
    setFromValue('');
    setResult('');
  };

  const handleFromUnitChange = (unit: string) => {
    setFromUnit(unit);
    if (toUnit === unit) {
      setToUnit('');
    }
  };

  const handleToUnitChange = (unit: string) => {
    setToUnit(unit);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-teal-600" />
          Unit Converter
        </h2>
        
        {/* Category Selection */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {conversionCategories.map((category) => (
            <button
              key={category.name}
              onClick={() => handleCategoryChange(category.name)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                selectedCategory === category.name
                  ? 'border-teal-500 bg-teal-50 text-teal-700'
                  : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
              }`}
            >
              {category.icon}
              <span className="text-sm font-medium capitalize">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conversion Interface */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* From Unit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From
            </label>
            <select
              value={fromUnit}
              onChange={(e) => handleFromUnitChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Select unit</option>
              {currentCategory?.units.map((unit) => (
                <option key={unit.name} value={unit.name}>
                  {unit.name} ({unit.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Value Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value
            </label>
            <input
              type="number"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              placeholder="Enter value"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* To Unit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <select
              value={toUnit}
              onChange={(e) => handleToUnitChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Select unit</option>
              {currentCategory?.units
                .filter(unit => unit.name !== fromUnit)
                .map((unit) => (
                  <option key={unit.name} value={unit.name}>
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Convert Button */}
        <button
          onClick={handleConversion}
          disabled={!fromValue || !fromUnit || !toUnit}
          className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Convert
        </button>

        {/* Result */}
        {result && (
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <div className="text-center">
              <p className="text-sm text-teal-700 mb-1">Result</p>
              <p className="text-2xl font-bold text-teal-900">
                {result} {toUnit && currentCategory?.units.find(u => u.name === toUnit)?.symbol}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Conversion Tips */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Conversion Tips</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Select a category to see available units</li>
          <li>• Choose your starting unit and value</li>
          <li>• Select the target unit for conversion</li>
          <li>• Temperature conversions use special formulas</li>
          <li>• All other conversions use standard ratios</li>
        </ul>
      </div>
    </div>
  );
};

export default UnitConverterCalculator;
