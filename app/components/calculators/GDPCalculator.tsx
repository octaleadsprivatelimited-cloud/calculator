'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, TrendingUp, DollarSign, Globe } from 'lucide-react'

interface GDPResult {
  gdp: number
  gdpPerCapita: number
  gdpGrowth: number
  realGDP: number
  nominalGDP: number
  purchasingPower: number
}

interface CountryData {
  name: string
  population: number
  inflationRate: number
  exchangeRate: number
  pppMultiplier: number
}

const COUNTRIES: CountryData[] = [
  { name: 'United States', population: 331002651, inflationRate: 2.1, exchangeRate: 1.0, pppMultiplier: 1.0 },
  { name: 'China', population: 1439323776, inflationRate: 2.5, exchangeRate: 0.14, pppMultiplier: 1.7 },
  { name: 'Japan', population: 125836021, inflationRate: 0.5, exchangeRate: 0.007, pppMultiplier: 1.2 },
  { name: 'Germany', population: 83190556, inflationRate: 1.5, exchangeRate: 1.08, pppMultiplier: 1.1 },
  { name: 'United Kingdom', population: 67886011, inflationRate: 2.0, exchangeRate: 1.27, pppMultiplier: 1.1 },
  { name: 'India', population: 1380004385, inflationRate: 4.5, exchangeRate: 0.013, pppMultiplier: 2.1 },
  { name: 'France', population: 65273511, inflationRate: 1.4, exchangeRate: 1.08, pppMultiplier: 1.1 },
  { name: 'Italy', population: 60461826, inflationRate: 1.2, exchangeRate: 1.08, pppMultiplier: 1.1 },
  { name: 'Brazil', population: 212559417, inflationRate: 3.5, exchangeRate: 0.19, pppMultiplier: 1.8 },
  { name: 'Canada', population: 37742154, inflationRate: 1.9, exchangeRate: 0.79, pppMultiplier: 1.1 }
]

const GDP_COMPONENTS = [
  { name: 'Consumption (C)', description: 'Personal consumption expenditures', default: 70 },
  { name: 'Investment (I)', description: 'Gross private domestic investment', default: 20 },
  { name: 'Government (G)', description: 'Government consumption and investment', default: 15 },
  { name: 'Net Exports (X-M)', description: 'Exports minus imports', default: -5 }
]

const ECONOMIC_INDICATORS = [
  { name: 'GDP Growth Rate', description: 'Annual percentage change in GDP' },
  { name: 'Inflation Rate', description: 'Annual percentage change in price level' },
  { name: 'Unemployment Rate', description: 'Percentage of labor force unemployed' },
  { name: 'Interest Rate', description: 'Central bank policy rate' },
  { name: 'Exchange Rate', description: 'Currency value relative to USD' }
]

export default function GDPCalculator() {
  const [calculationType, setCalculationType] = useState<'expenditure' | 'income' | 'production'>('expenditure')
  const [country, setCountry] = useState('United States')
  const [consumption, setConsumption] = useState('')
  const [investment, setInvestment] = useState('')
  const [government, setGovernment] = useState('')
  const [netExports, setNetExports] = useState('')
  const [gdpGrowth, setGdpGrowth] = useState('')
  const [inflationRate, setInflationRate] = useState('')
  const [baseYear, setBaseYear] = useState('2020')
  const [showResults, setShowResults] = useState(false)

  const calculateGDP = useCallback((): GDPResult => {
    const c = parseFloat(consumption) || 0
    const i = parseFloat(investment) || 0
    const g = parseFloat(government) || 0
    const nx = parseFloat(netExports) || 0
    
    // Calculate GDP using expenditure approach
    const gdp = c + i + g + nx
    
    // Get country data
    const countryData = COUNTRIES.find(c => c.name === country) || COUNTRIES[0]
    
    // Calculate GDP per capita
    const gdpPerCapita = countryData.population > 0 ? gdp / countryData.population : 0
    
    // Calculate real GDP (adjusting for inflation)
    const inflation = parseFloat(inflationRate) || countryData.inflationRate
    const realGDP = inflation > 0 ? gdp / (1 + inflation / 100) : gdp
    
    // Calculate nominal GDP (current prices)
    const nominalGDP = gdp
    
    // Calculate GDP growth
    const growth = parseFloat(gdpGrowth) || 0
    const gdpGrowthValue = gdp * (growth / 100)
    
    // Calculate purchasing power parity
    const purchasingPower = gdp * countryData.pppMultiplier

    return {
      gdp,
      gdpPerCapita,
      gdpGrowth: gdpGrowthValue,
      realGDP,
      nominalGDP,
      purchasingPower
    }
  }, [consumption, investment, government, netExports, country, gdpGrowth, inflationRate])

  const handleCalculate = () => {
    if (consumption || investment || government || netExports) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setConsumption('')
    setInvestment('')
    setGovernment('')
    setNetExports('')
    setGdpGrowth('')
    setInflationRate('')
    setBaseYear('2020')
    setShowResults(false)
  }

  const handleQuickGDP = (component: { name: string, default: number }) => {
    switch (component.name) {
      case 'Consumption (C)':
        setConsumption(component.default.toString())
        break
      case 'Investment (I)':
        setInvestment(component.default.toString())
        break
      case 'Government (G)':
        setGovernment(component.default.toString())
        break
      case 'Net Exports (X-M)':
        setNetExports(component.default.toString())
        break
    }
  }

  const handleCountryChange = (selectedCountry: string) => {
    setCountry(selectedCountry)
    const countryData = COUNTRIES.find(c => c.name === selectedCountry)
    if (countryData) {
      setInflationRate(countryData.inflationRate.toString())
    }
  }

  const formatNumber = (num: number, decimals: number = 2) => {
    if (isNaN(num) || !isFinite(num)) return '0.00'
    return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  }

  const formatCurrency = (num: number) => {
    if (isNaN(num) || !isFinite(num)) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num)
  }

  const downloadResults = () => {
    const result = calculateGDP()
    const countryData = COUNTRIES.find(c => c.name === country) || COUNTRIES[0]
    
    const data = `GDP Calculator Results

Country: ${country}
Calculation Type: ${calculationType === 'expenditure' ? 'Expenditure Approach' : calculationType === 'income' ? 'Income Approach' : 'Production Approach'}
Base Year: ${baseYear}

GDP Components:
- Consumption (C): ${formatCurrency(parseFloat(consumption) || 0)}
- Investment (I): ${formatCurrency(parseFloat(investment) || 0)}
- Government (G): ${formatCurrency(parseFloat(government) || 0)}
- Net Exports (X-M): ${formatCurrency(parseFloat(netExports) || 0)}

Results:
- Total GDP: ${formatCurrency(result.gdp)}
- GDP per Capita: ${formatCurrency(result.gdpPerCapita)}
- Real GDP: ${formatCurrency(result.realGDP)}
- Nominal GDP: ${formatCurrency(result.nominalGDP)}
- Purchasing Power Parity: ${formatCurrency(result.purchasingPower)}
- GDP Growth: ${formatCurrency(result.gdpGrowth)}

Economic Indicators:
- Inflation Rate: ${inflationRate || countryData.inflationRate}%
- Exchange Rate: ${countryData.exchangeRate} USD
- Population: ${countryData.population.toLocaleString()}`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'gdp-calculator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = calculateGDP()
      
      navigator.share({
        title: 'GDP Calculator Results',
        text: `${country} GDP: ${formatCurrency(result.gdp)}`,
        url: window.location.href
      })
    } else {
      const result = calculateGDP()
      const text = `${country} GDP: ${formatCurrency(result.gdp)}`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? calculateGDP() : { gdp: 0, gdpPerCapita: 0, gdpGrowth: 0, realGDP: 0, nominalGDP: 0, purchasingPower: 0 }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">GDP Calculator</h1>
            <p className="text-emerald-100 text-lg">
              Calculate Gross Domestic Product using multiple approaches. 
              Perfect for economists, students, and financial analysts.
            </p>
          </div>
          <div className="hidden md:block">
            <TrendingUp className="w-16 h-16 text-emerald-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Calculation Type Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">GDP Calculation Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: 'expenditure', label: 'Expenditure Approach', description: 'C + I + G + (X-M)' },
              { key: 'income', label: 'Income Approach', description: 'Wages + Profits + Interest + Rent' },
              { key: 'production', label: 'Production Approach', description: 'Value Added Method' }
            ].map(({ key, label, description }) => (
              <button
                key={key}
                onClick={() => setCalculationType(key as any)}
                className={`p-4 rounded-lg font-medium transition-colors text-center ${
                  calculationType === key
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <div className="font-semibold">{label}</div>
                <div className="text-sm opacity-80">{description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Country Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Country Selection</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Country
              </label>
              <select
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Select country"
              >
                {COUNTRIES.map(country => (
                  <option key={country.name} value={country.name}>
                    {country.name} - Pop: {country.population.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Year
              </label>
              <input
                type="number"
                value={baseYear}
                onChange={(e) => setBaseYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="2020"
                min="1900"
                max="2030"
                aria-label="Base year"
              />
            </div>
          </div>
        </div>

        {/* GDP Components */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">GDP Components (Expenditure Approach)</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consumption (C) - Personal Spending
                </label>
                <input
                  type="number"
                  value={consumption}
                  onChange={(e) => setConsumption(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  aria-label="Consumption value"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment (I) - Business Investment
                </label>
                <input
                  type="number"
                  value={investment}
                  onChange={(e) => setInvestment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="0"
                  step="0.01"
                  aria-label="Investment value"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Government (G) - Government Spending
                </label>
                <input
                  type="number"
                  value={government}
                  onChange={(e) => setGovernment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  aria-label="Government spending value"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Net Exports (X-M) - Exports minus Imports
                </label>
                <input
                  type="number"
                  value={netExports}
                  onChange={(e) => setNetExports(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="0"
                  step="0.01"
                  aria-label="Net exports value"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick GDP Components */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick GDP Component Presets</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GDP_COMPONENTS.map((component, index) => (
              <button
                key={index}
                onClick={() => handleQuickGDP(component)}
                className="p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors text-sm text-center"
              >
                <div className="font-medium text-emerald-800">{component.name}</div>
                <div className="text-emerald-600">${component.default}T</div>
                <div className="text-xs text-emerald-500">{component.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Economic Indicators */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GDP Growth Rate (%)
            </label>
            <input
              type="number"
              value={gdpGrowth}
              onChange={(e) => setGdpGrowth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="0"
              step="0.1"
              aria-label="GDP growth rate"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inflation Rate (%)
            </label>
            <input
              type="number"
              value={inflationRate}
              onChange={(e) => setInflationRate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="0"
              step="0.1"
              aria-label="Inflation rate"
            />
          </div>
        </div>

        {/* Calculate Button */}
        {(consumption || investment || government || netExports) && (
          <div className="text-center mb-8">
            <button
              onClick={handleCalculate}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>Calculate GDP</span>
            </button>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* GDP Results */}
            <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-800 mb-4">GDP Calculation Results</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-emerald-700">{formatCurrency(result.gdp)}</div>
                  <div className="text-sm text-gray-600">Total GDP</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-700">{formatCurrency(result.gdpPerCapita)}</div>
                  <div className="text-sm text-gray-600">GDP per Capita</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-700">{formatCurrency(result.realGDP)}</div>
                  <div className="text-sm text-gray-600">Real GDP</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-700">{formatCurrency(result.nominalGDP)}</div>
                  <div className="text-sm text-gray-600">Nominal GDP</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-700">{formatCurrency(result.purchasingPower)}</div>
                  <div className="text-sm text-gray-600">Purchasing Power</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-700">{formatCurrency(result.gdpGrowth)}</div>
                  <div className="text-sm text-gray-600">GDP Growth</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={downloadResults}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={shareResults}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button
                onClick={printResults}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">About GDP Calculator</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                This calculator computes Gross Domestic Product using the expenditure approach (C + I + G + X-M). 
                It includes consumption, investment, government spending, and net exports. The calculator also 
                provides GDP per capita, real GDP (inflation-adjusted), and purchasing power parity calculations. 
                Perfect for economics students, financial analysts, and anyone interested in understanding economic 
                indicators and national income accounting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
