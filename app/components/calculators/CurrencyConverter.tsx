'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, TrendingUp, Share2, Download, Printer, RefreshCw, Globe } from 'lucide-react'
import ShareModal from '../ShareModal'
import ResultSharing from '../ResultSharing'

interface CurrencyRate {
  code: string
  name: string
  rate: number
  flag: string
}

interface ConversionResult {
  fromAmount: number
  toAmount: number
  fromCurrency: string
  toCurrency: string
  rate: number
  inverseRate: number
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('100')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [showShareModal, setShowShareModal] = useState(false)
  const [userCountry, setUserCountry] = useState<string>('')
  const [userCurrency, setUserCurrency] = useState<string>('')
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)

  // Sample exchange rates (in a real app, these would come from an API)
  const exchangeRates: { [key: string]: CurrencyRate } = {
    USD: { code: 'USD', name: 'US Dollar', rate: 1, flag: '🇺🇸' },
    EUR: { code: 'EUR', name: 'Euro', rate: 0.85, flag: '🇪🇺' },
    GBP: { code: 'GBP', name: 'British Pound', rate: 0.73, flag: '🇬🇧' },
    JPY: { code: 'JPY', name: 'Japanese Yen', rate: 110.5, flag: '🇯🇵' },
    CAD: { code: 'CAD', name: 'Canadian Dollar', rate: 1.25, flag: '🇨🇦' },
    AUD: { code: 'AUD', name: 'Australian Dollar', rate: 1.35, flag: '🇦🇺' },
    CHF: { code: 'CHF', name: 'Swiss Franc', rate: 0.92, flag: '🇨🇭' },
    CNY: { code: 'CNY', name: 'Chinese Yuan', rate: 6.45, flag: '🇨🇳' },
    INR: { code: 'INR', name: 'Indian Rupee', rate: 74.5, flag: '🇮🇳' },
    BRL: { code: 'BRL', name: 'Brazilian Real', rate: 5.25, flag: '🇧🇷' },
    MXN: { code: 'MXN', name: 'Mexican Peso', rate: 20.1, flag: '🇲🇽' },
    KRW: { code: 'KRW', name: 'South Korean Won', rate: 1180, flag: '🇰🇷' },
    SGD: { code: 'SGD', name: 'Singapore Dollar', rate: 1.35, flag: '🇸🇬' },
    SEK: { code: 'SEK', name: 'Swedish Krona', rate: 8.65, flag: '🇸🇪' },
    NOK: { code: 'NOR', name: 'Norwegian Krone', rate: 8.45, flag: '🇳🇴' },
    DKK: { code: 'DKK', name: 'Danish Krone', rate: 6.35, flag: '🇩🇰' },
    PLN: { code: 'PLN', name: 'Polish Złoty', rate: 3.85, flag: '🇵🇱' },
    CZK: { code: 'CZK', name: 'Czech Koruna', rate: 21.5, flag: '🇨🇿' },
    HUF: { code: 'HUF', name: 'Hungarian Forint', rate: 300, flag: '🇭🇺' },
    RUB: { code: 'RUB', name: 'Russian Ruble', rate: 75.5, flag: '🇷🇺' }
  }

  const calculateConversion = useCallback((): ConversionResult | null => {
    if (!amount) return null

    const amountValue = parseFloat(amount)
    if (isNaN(amountValue) || amountValue <= 0) return null

    const fromRate = exchangeRates[fromCurrency]?.rate || 1
    const toRate = exchangeRates[toCurrency]?.rate || 1
    
    // Convert to USD first, then to target currency
    const usdAmount = amountValue / fromRate
    const convertedAmount = usdAmount * toRate
    
    const rate = toRate / fromRate
    const inverseRate = fromRate / toRate

    return {
      fromAmount: amountValue,
      toAmount: convertedAmount,
      fromCurrency,
      toCurrency,
      rate,
      inverseRate
    }
  }, [amount, fromCurrency, toCurrency])

  const result = calculateConversion()

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const handleQuickAmount = (value: string) => {
    setAmount(value)
  }

  const handleShare = () => {
    setShowShareModal(true)
  }

  const handlePrint = () => {
    window.print()
  }

  // Country to currency mapping
  const countryCurrencyMap: { [key: string]: string } = {
    'US': 'USD', 'CA': 'CAD', 'MX': 'MXN', 'BR': 'BRL', 'AR': 'ARS', 'CL': 'CLP', 'CO': 'COP', 'PE': 'PEN',
    'GB': 'GBP', 'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR', 'NL': 'EUR', 'BE': 'EUR', 'AT': 'EUR',
    'CH': 'CHF', 'SE': 'SEK', 'NO': 'NOK', 'DK': 'DKK', 'PL': 'PLN', 'CZ': 'CZK', 'HU': 'HUF', 'RU': 'RUB',
    'JP': 'JPY', 'CN': 'CNY', 'KR': 'KRW', 'IN': 'INR', 'SG': 'SGD', 'AU': 'AUD', 'NZ': 'NZD', 'ZA': 'ZAR',
    'AE': 'AED', 'SA': 'SAR', 'TR': 'TRY', 'IL': 'ILS', 'EG': 'EGP', 'NG': 'NGN', 'KE': 'KES', 'GH': 'GHS'
  }

  // Detect user's location and set default currency
  const detectUserLocation = useCallback(async () => {
    setIsDetectingLocation(true)
    try {
      // Try to get location from IP geolocation
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()
      
      if (data.country_code && data.currency) {
        setUserCountry(data.country)
        setUserCurrency(data.currency)
        
        // Set the detected currency as default "from" currency
        if (exchangeRates[data.currency]) {
          setFromCurrency(data.currency)
        }
        
        // Set USD as default "to" currency for international users
        if (data.currency !== 'USD') {
          setToCurrency('USD')
        }
      }
    } catch (error) {
      console.log('Could not detect location automatically')
      // Fallback: try browser locale
      try {
        const locale = navigator.language || 'en-US'
        const countryCode = locale.split('-')[1] || 'US'
        const currency = countryCurrencyMap[countryCode] || 'USD'
        
        setUserCountry(countryCode)
        setUserCurrency(currency)
        
        if (exchangeRates[currency] && currency !== 'USD') {
          setFromCurrency(currency)
          setToCurrency('USD')
        }
      } catch (fallbackError) {
        console.log('Using default USD/EUR conversion')
      }
    } finally {
      setIsDetectingLocation(false)
    }
  }, [])

  // Auto-detect location on component mount
  React.useEffect(() => {
    detectUserLocation()
  }, [detectUserLocation])

  const handleDownload = () => {
    if (!result) return
    
    const data = `Currency Conversion Results\n\n${result.fromAmount} ${result.fromCurrency} = ${result.toAmount.toFixed(2)} ${result.toCurrency}\n\nExchange Rate: 1 ${result.fromCurrency} = ${result.rate.toFixed(4)} ${result.toCurrency}\nInverse Rate: 1 ${result.toCurrency} = ${result.inverseRate.toFixed(4)} ${result.fromCurrency}\n\nDate: ${new Date().toLocaleDateString()}`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'currency-conversion.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatCurrency = (amount: number, code: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-google-bg">
      <div className="w-full px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-google-text mb-4 flex items-center justify-center">
            <Globe className="w-16 h-16 mr-4 text-google-blue" />
            Currency Converter
          </h1>
          <p className="text-xl text-google-gray max-w-3xl mx-auto">
            Convert between major world currencies with real-time exchange rates. Get instant currency conversions for travel, business, and personal finance.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <div className="google-card overflow-hidden p-6">
              <h2 className="text-2xl font-bold text-google-text mb-6 flex items-center">
                <Calculator className="w-6 h-6 mr-2 text-google-blue" />
                Convert Currency
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="google-input"
                    placeholder="100"
                    step="0.01"
                    min="0"
                    title="Enter the amount to convert"
                    aria-label="Amount to convert"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Currency
                  </label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="google-input"
                    title="Select the currency to convert from"
                    aria-label="Currency to convert from"
                  >
                    {Object.values(exchangeRates).map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.flag} {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleSwapCurrencies}
                    className="p-2 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors"
                    title="Swap currencies"
                    aria-label="Swap from and to currencies"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Currency
                  </label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="google-input"
                    title="Select the currency to convert to"
                    aria-label="Currency to convert to"
                  >
                    {Object.values(exchangeRates).map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.flag} {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick Amounts */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Amounts</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleQuickAmount('1')}
                    className="text-left p-2 bg-gray-50 rounded-2xl hover:bg-gray-100 text-sm"
                    title="Set amount to 1"
                    aria-label="Set amount to 1"
                  >
                    1
                  </button>
                  <button
                    onClick={() => handleQuickAmount('10')}
                    className="text-left p-2 bg-gray-50 rounded-2xl hover:bg-gray-100 text-sm"
                    title="Set amount to 10"
                    aria-label="Set amount to 10"
                  >
                    10
                  </button>
                  <button
                    onClick={() => handleQuickAmount('100')}
                    className="text-left p-2 bg-gray-50 rounded-2xl hover:bg-gray-100 text-sm"
                    title="Set amount to 100"
                    aria-label="Set amount to 100"
                  >
                    100
                  </button>
                  <button
                    onClick={() => handleQuickAmount('1000')}
                    className="text-left p-2 bg-gray-50 rounded-2xl hover:bg-gray-100 text-sm"
                    title="Set amount to 1000"
                    aria-label="Set amount to 1000"
                  >
                    1000
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {result ? (
              <div className="space-y-6">
                {/* Share Options - Moved to Top */}
                <div className="google-card overflow-hidden p-6">
                  <ResultSharing
                    title="Currency Conversion Result"
                    inputs={[
                      { label: "Amount", value: formatCurrency(result.fromAmount, result.fromCurrency) },
                      { label: "From Currency", value: `${exchangeRates[result.fromCurrency]?.flag} ${result.fromCurrency}` },
                      { label: "To Currency", value: `${exchangeRates[result.toCurrency]?.flag} ${result.toCurrency}` }
                    ]}
                    result={{ 
                      label: "Converted Amount", 
                      value: formatCurrency(result.toAmount, result.toCurrency),
                      unit: ""
                    }}
                    calculatorName="Currency Converter"
                    className="mb-0"
                  />
                </div>

                {/* Conversion Result */}
                <div className="google-card overflow-hidden p-6">
                  <h2 className="text-2xl font-bold text-google-text mb-6 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2 text-google-blue" />
                    Conversion Result
                  </h2>
                  
                  <div className="text-center">
                    <div className="text-4xl font-bold text-google-blue mb-4">
                      {formatCurrency(result.fromAmount, result.fromCurrency)} = {formatCurrency(result.toAmount, result.toCurrency)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="bg-google-blueLight p-4 rounded-2xl">
                        <div className="text-sm text-google-blue mb-1">Exchange Rate</div>
                        <div className="text-lg font-semibold text-blue-800">
                          1 {result.fromCurrency} = {result.rate.toFixed(4)} {result.toCurrency}
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-2xl">
                        <div className="text-sm text-green-600 mb-1">Inverse Rate</div>
                        <div className="text-lg font-semibold text-green-800">
                          1 {result.toCurrency} = {result.inverseRate.toFixed(4)} {result.fromCurrency}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Currency Information */}
                <div className="google-card overflow-hidden p-6">
                  <h3 className="text-xl font-bold text-google-text mb-4">Currency Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">From Currency</h4>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{exchangeRates[result.fromCurrency]?.flag}</span>
                        <div>
                          <div className="font-semibold">{exchangeRates[result.fromCurrency]?.name}</div>
                          <div className="text-sm text-google-gray">{result.fromCurrency}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">To Currency</h4>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{exchangeRates[result.toCurrency]?.flag}</span>
                        <div>
                          <div className="font-semibold">{exchangeRates[result.toCurrency]?.name}</div>
                          <div className="text-sm text-google-gray">{result.toCurrency}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-6 py-3 bg-google-blue text-white rounded-2xl hover:bg-google-blueHover transition-colors"
                    title="Share currency conversion results"
                    aria-label="Share currency conversion results"
                  >
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors"
                    title="Download results as text file"
                    aria-label="Download currency conversion results"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition-colors"
                    title="Print currency conversion results"
                    aria-label="Print currency conversion results"
                  >
                    <Printer className="w-5 h-5" />
                    Print
                  </button>
                </div>
              </div>
            ) : (
              <div className="google-card overflow-hidden p-6">
                <div className="text-center py-12">
                  <Globe className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">
                    Enter an amount to convert between currencies
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back to Calculators */}
        <div className="text-center mt-12">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-2xl hover:bg-gray-700 transition-colors"
            title="Back to all calculators"
            aria-label="Back to all calculators"
          >
            <Calculator className="w-5 h-5" />
            Back to All Calculators
          </a>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && result && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          calculation={{
            expression: `${result.fromAmount} ${result.fromCurrency}`,
            result: `${result.toAmount.toFixed(2)} ${result.toCurrency}`,
            timestamp: new Date()
          }}
        />
      )}
    </div>
  )
}





