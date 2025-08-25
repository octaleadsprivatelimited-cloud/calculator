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

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About GDP Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive GDP calculator helps economists, students, and financial analysts understand 
              and calculate Gross Domestic Product using multiple approaches. This essential economic tool 
              provides detailed analysis of national income, economic growth, and purchasing power parity 
              for informed economic decision-making and analysis.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Total GDP:</strong> Gross Domestic Product in current dollars</li>
              <li><strong>GDP per Capita:</strong> Economic output per person</li>
              <li><strong>Real GDP:</strong> Inflation-adjusted economic output</li>
              <li><strong>Nominal GDP:</strong> Current dollar value of output</li>
              <li><strong>Purchasing Power Parity:</strong> International price comparisons</li>
              <li><strong>GDP Growth:</strong> Economic expansion rates</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">GDP Calculation Approaches</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Expenditure Approach</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Consumption (C):</strong> Consumer spending on goods/services</li>
                  <li><strong>Investment (I):</strong> Business capital expenditures</li>
                  <li><strong>Government (G):</strong> Public sector spending</li>
                  <li><strong>Net Exports (X-M):</strong> Exports minus imports</li>
                  <li><strong>Formula:</strong> GDP = C + I + G + (X-M)</li>
                  <li><strong>Most Common:</strong> Standard measurement method</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Income Approach</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Wages:</strong> Labor income and compensation</li>
                  <li><strong>Profits:</strong> Corporate and business earnings</li>
                  <li><strong>Interest:</strong> Returns on investments</li>
                  <li><strong>Rent:</strong> Property and resource income</li>
                  <li><strong>Formula:</strong> GDP = Wages + Profits + Interest + Rent</li>
                  <li><strong>Alternative:</strong> Income distribution analysis</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">GDP Fundamentals</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Definition:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Total market value of goods/services</li>
                    <li>Produced within a country's borders</li>
                    <li>In a specific time period</li>
                    <li>Primary measure of economic size</li>
                    <li>Indicator of economic health</li>
                    <li>Basis for international comparisons</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Importance:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Economic performance measurement</li>
                    <li>Policy decision making</li>
                    <li>Investment analysis</li>
                    <li>International comparisons</li>
                    <li>Business planning</li>
                    <li>Academic research</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Real vs. Nominal GDP</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Nominal GDP:</strong> Current dollar values, includes inflation</li>
              <li><strong>Real GDP:</strong> Constant dollar values, inflation-adjusted</li>
              <li><strong>GDP Deflator:</strong> Price level measurement</li>
              <li><strong>Inflation Impact:</strong> Price changes vs. real growth</li>
              <li><strong>Economic Growth:</strong> Real GDP changes over time</li>
              <li><strong>Policy Analysis:</strong> True economic performance</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-emerald-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                When analyzing GDP, always consider both nominal and real values to distinguish between 
                actual economic growth and inflation effects. Remember that GDP is just one measure of 
                economic well-being - it doesn't capture income distribution, environmental quality, or 
                quality of life factors. For international comparisons, use purchasing power parity 
                adjustments rather than simple exchange rate conversions.
              </p>
            </div>
          </div>
        </div>
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About GDP Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive GDP calculator helps economists, students, and financial analysts understand 
              and calculate Gross Domestic Product using multiple approaches. This essential economic tool 
              provides detailed analysis of national income, economic growth, and purchasing power parity 
              for informed economic decision-making and analysis.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Total GDP:</strong> Gross Domestic Product in current dollars</li>
              <li><strong>GDP per Capita:</strong> Economic output per person</li>
              <li><strong>Real GDP:</strong> Inflation-adjusted economic output</li>
              <li><strong>Nominal GDP:</strong> Current dollar value of output</li>
              <li><strong>Purchasing Power Parity:</strong> International price comparisons</li>
              <li><strong>GDP Growth:</strong> Economic expansion rates</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">GDP Calculation Approaches</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Expenditure Approach</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Consumption (C):</strong> Consumer spending on goods/services</li>
                  <li><strong>Investment (I):</strong> Business capital expenditures</li>
                  <li><strong>Government (G):</strong> Public sector spending</li>
                  <li><strong>Net Exports (X-M):</strong> Exports minus imports</li>
                  <li><strong>Formula:</strong> GDP = C + I + G + (X-M)</li>
                  <li><strong>Most Common:</strong> Standard measurement method</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Income Approach</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Wages:</strong> Labor income and compensation</li>
                  <li><strong>Profits:</strong> Corporate and business earnings</li>
                  <li><strong>Interest:</strong> Returns on investments</li>
                  <li><strong>Rent:</strong> Property and resource income</li>
                  <li><strong>Formula:</strong> GDP = Wages + Profits + Interest + Rent</li>
                  <li><strong>Alternative:</strong> Income distribution analysis</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <h5 className="font-semibold text-emerald-800 mb-1">Total GDP</h5>
                <p className="text-emerald-700 text-sm">Economic output</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">GDP per Capita</h5>
                <p className="text-blue-700 text-sm">Per-person output</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Real GDP</h5>
                <p className="text-green-700 text-sm">Inflation-adjusted</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Select your calculation approach (expenditure, income, or production), enter the economic 
              components, and specify the country and base year. The calculator automatically computes 
              total GDP, per capita values, real GDP, and purchasing power parity for comprehensive 
              economic analysis.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">GDP Fundamentals</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Definition:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Total market value of goods/services</li>
                    <li>Produced within a country's borders</li>
                    <li>In a specific time period</li>
                    <li>Primary measure of economic size</li>
                    <li>Indicator of economic health</li>
                    <li>Basis for international comparisons</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Importance:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Economic performance measurement</li>
                    <li>Policy decision making</li>
                    <li>Investment analysis</li>
                    <li>International comparisons</li>
                    <li>Business planning</li>
                    <li>Academic research</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">GDP Components Analysis</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Consumption (C)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Durable Goods:</strong> Cars, appliances, furniture</li>
                  <li><strong>Non-durable Goods:</strong> Food, clothing, fuel</li>
                  <li><strong>Services:</strong> Healthcare, education, entertainment</li>
                  <li><strong>Housing:</strong> Rent, utilities, maintenance</li>
                  <li><strong>Largest Component:</strong> Typically 60-70% of GDP</li>
                  <li><strong>Consumer Confidence:</strong> Economic sentiment indicator</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Investment (I)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Business Investment:</strong> Equipment, machinery, buildings</li>
                  <li><strong>Residential Construction:</strong> New homes, renovations</li>
                  <li><strong>Inventory Changes:</strong> Stock accumulation/reduction</li>
                  <li><strong>Research & Development:</strong> Innovation spending</li>
                  <li><strong>Economic Growth Driver:</strong> Future productivity</li>
                  <li><strong>Volatile Component:</strong> Business cycle sensitive</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Government and Trade</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Government Spending (G)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Federal Spending:</strong> Defense, social programs</li>
                  <li><strong>State & Local:</strong> Education, infrastructure</li>
                  <li><strong>Public Services:</strong> Healthcare, law enforcement</li>
                  <li><strong>Infrastructure:</strong> Roads, bridges, utilities</li>
                  <li><strong>Policy Tool:</strong> Fiscal stimulus/contraction</li>
                  <li><strong>Stable Component:</strong> Less volatile than others</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Net Exports (X-M)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Exports (X):</strong> Goods/services sold abroad</li>
                  <li><strong>Imports (M):</strong> Goods/services purchased abroad</li>
                  <li><strong>Trade Balance:</strong> Surplus vs. deficit</li>
                  <li><strong>Currency Impact:</strong> Exchange rate effects</li>
                  <li><strong>Global Economy:</strong> International trade</li>
                  <li><strong>Can Be Negative:</strong> Trade deficits common</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Real vs. Nominal GDP</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Nominal GDP:</strong> Current dollar values, includes inflation</li>
              <li><strong>Real GDP:</strong> Constant dollar values, inflation-adjusted</li>
              <li><strong>GDP Deflator:</strong> Price level measurement</li>
              <li><strong>Inflation Impact:</strong> Price changes vs. real growth</li>
              <li><strong>Economic Growth:</strong> Real GDP changes over time</li>
              <li><strong>Policy Analysis:</strong> True economic performance</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">GDP per Capita Analysis</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Calculation Method</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Formula:</strong> GDP ÷ Population</li>
                  <li><strong>Standard of Living:</strong> Economic welfare indicator</li>
                  <li><strong>International Comparison:</strong> Country wealth ranking</li>
                  <li><strong>Population Impact:</strong> Large populations reduce per capita</li>
                  <li><strong>Economic Development:</strong> Development stage indicator</li>
                  <li><strong>Policy Focus:</strong> Per capita growth targets</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Interpretation</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>High Values:</strong> Developed economies</li>
                  <li><strong>Low Values:</strong> Developing economies</li>
                  <li><strong>Growth Trends:</strong> Economic progress</li>
                  <li><strong>Inequality Consideration:</strong> Distribution matters</li>
                  <li><strong>Quality of Life:</strong> Living standards proxy</li>
                  <li><strong>Investment Decisions:</strong> Market attractiveness</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Purchasing Power Parity</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Definition:</strong> Price level equalization across countries</li>
              <li><strong>Currency Adjustment:</strong> Real exchange rate calculation</li>
              <li><strong>Cost of Living:</strong> International price comparisons</li>
              <li><strong>Standard of Living:</strong> True economic welfare</li>
              <li><strong>Big Mac Index:</strong> Informal PPP measurement</li>
              <li><strong>Development Analysis:</strong> Economic progress assessment</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">GDP Growth Analysis</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Economic Expansion:</strong> Real GDP increase over time</li>
              <li><strong>Business Cycles:</strong> Growth and contraction patterns</li>
              <li><strong>Recession Indicators:</strong> Negative growth periods</li>
              <li><strong>Recovery Patterns:</strong> Post-recession growth</li>
              <li><strong>Long-term Trends:</strong> Economic development path</li>
              <li><strong>Policy Effectiveness:</strong> Economic intervention results</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">GDP Calculation Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Use Consistent Data:</strong> Same time period and currency</li>
              <li><strong>Account for Inflation:</strong> Real vs. nominal considerations</li>
              <li><strong>Consider Population:</strong> Per capita analysis</li>
              <li><strong>International Comparison:</strong> PPP adjustments</li>
              <li><strong>Data Sources:</strong> Reliable economic statistics</li>
              <li><strong>Update Regularly:</strong> Economic data changes</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common GDP Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Double Counting:</strong> Including intermediate goods</li>
              <li><strong>Transfer Payments:</strong> Social security, unemployment</li>
              <li><strong>Illegal Activities:</strong> Underground economy</li>
              <li><strong>Non-market Production:</strong> Household work, volunteerism</li>
              <li><strong>Environmental Costs:</strong> Pollution, resource depletion</li>
              <li><strong>Quality Changes:</strong> Technology improvements</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Advanced GDP Concepts</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>GDP Deflator:</strong> Price level measurement</li>
              <li><strong>Chain-weighted GDP:</strong> Improved measurement method</li>
              <li><strong>Green GDP:</strong> Environmental cost inclusion</li>
              <li><strong>Happiness Index:</strong> Beyond economic measures</li>
              <li><strong>Human Development Index:</strong> Multi-dimensional development</li>
              <li><strong>Genuine Progress Indicator:</strong> Alternative to GDP</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-emerald-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                When analyzing GDP, always consider both nominal and real values to distinguish between 
                actual economic growth and inflation effects. Remember that GDP is just one measure of 
                economic well-being - it doesn't capture income distribution, environmental quality, or 
                quality of life factors. For international comparisons, use purchasing power parity 
                adjustments rather than simple exchange rate conversions. Focus on trends and growth rates 
                rather than absolute values, and consider per capita measures for more meaningful 
                comparisons between countries of different sizes. GDP analysis should be part of a 
                broader economic assessment that includes employment, inflation, and other key indicators.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
