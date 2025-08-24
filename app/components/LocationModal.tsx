'use client'

import React, { useState, useEffect } from 'react'
import { X, MapPin, Globe, CheckCircle } from 'lucide-react'

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
  onLocationSet: (location: { name: string; country: string; currency: string; symbol: string; flag: string }) => void
}

interface CountryData {
  name: string
  country: string
  currency: string
  symbol: string
  flag: string
}

const countries: CountryData[] = [
  { name: 'India', country: 'India', currency: 'INR', symbol: '₹', flag: '🇮🇳' },
  { name: 'United States', country: 'United States', currency: 'USD', symbol: '$', flag: '🇺🇸' },
  { name: 'United Kingdom', country: 'United Kingdom', currency: 'GBP', symbol: '£', flag: '🇬🇧' },
  { name: 'European Union', country: 'European Union', currency: 'EUR', symbol: '€', flag: '🇪🇺' },
  { name: 'Japan', country: 'Japan', currency: 'JPY', symbol: '¥', flag: '🇯🇵' },
  { name: 'Canada', country: 'Canada', currency: 'CAD', symbol: 'C$', flag: '🇨🇦' },
  { name: 'Australia', country: 'Australia', currency: 'AUD', symbol: 'A$', flag: '🇦🇺' },
  { name: 'China', country: 'China', currency: 'CNY', symbol: '¥', flag: '🇨🇳' },
  { name: 'Brazil', country: 'Brazil', currency: 'BRL', symbol: 'R$', flag: '🇧🇷' },
  { name: 'South Korea', country: 'South Korea', currency: 'KRW', symbol: '₩', flag: '🇰🇷' },
]

export default function LocationModal({ isOpen, onClose, onLocationSet }: LocationModalProps) {
  const [detecting, setDetecting] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null)
  const [showManual, setShowManual] = useState(false)

  useEffect(() => {
    if (isOpen) {
      detectLocation()
    }
  }, [isOpen])

  const detectLocation = async () => {
    setDetecting(true)
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: false
        })
      })

      const { latitude, longitude } = position.coords
      
      try {
        // Use free reverse geocoding API to get country
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        )
        
        if (response.ok) {
          const data = await response.json()
          const countryName = data.countryName
          
          // Find matching country in our list
          const detectedCountry = countries.find(country => 
            country.name.toLowerCase().includes(countryName.toLowerCase()) ||
            countryName.toLowerCase().includes(country.name.toLowerCase())
          ) || countries[0] // Default to India if no match
          
          setSelectedCountry(detectedCountry)
          
          setTimeout(() => {
            onLocationSet(detectedCountry)
            onClose()
          }, 1000)
        } else {
          throw new Error('Geocoding API failed')
        }
      } catch (apiError) {
        // Fallback to coordinate-based detection
        let detectedCountry = countries[0] // Default to India
        
        // India coordinates: roughly between 8°N to 37°N and 68°E to 97°E
        if (latitude >= 8 && latitude <= 37 && longitude >= 68 && longitude <= 97) {
          detectedCountry = countries[0] // India
        } else if (latitude >= 25 && latitude <= 50 && longitude >= -125 && longitude <= -65) {
          detectedCountry = countries[1] // United States
        } else if (latitude >= 49 && latitude <= 61 && longitude >= -8 && longitude <= 2) {
          detectedCountry = countries[2] // United Kingdom
        } else if (latitude >= 35 && latitude <= 71 && longitude >= -10 && longitude <= 40) {
          detectedCountry = countries[3] // European Union
        } else if (latitude >= 30 && latitude <= 46 && longitude >= 129 && longitude <= 146) {
          detectedCountry = countries[4] // Japan
        }
        
        setSelectedCountry(detectedCountry)
        
        setTimeout(() => {
          onLocationSet(detectedCountry)
          onClose()
        }, 1000)
      }
    } catch (error) {
      console.log('Location detection failed, showing manual selection')
      setShowManual(true)
    } finally {
      setDetecting(false)
    }
  }

  const handleCountrySelect = (country: CountryData) => {
    setSelectedCountry(country)
    onLocationSet(country)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-blue-600" />
            Set Your Location
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {detecting && !showManual ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Detecting your location...
              </h4>
              <p className="text-gray-600">
                We're finding your country to set the right currency
              </p>
              <button
                onClick={() => {
                  const indiaCountry = countries[0]
                  onLocationSet(indiaCountry)
                  onClose()
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Set to India (INR) Now
              </button>
            </div>
          ) : showManual ? (
            <div>
              <div className="text-center mb-6">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Select Your Country
                </h4>
                <p className="text-gray-600">
                  Choose your country to set the appropriate currency
                </p>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {countries.map((country) => (
                  <button
                    key={country.currency}
                    onClick={() => handleCountrySelect(country)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{country.flag}</span>
                      <span className="font-medium text-gray-800">{country.name}</span>
                    </div>
                    <span className="text-gray-600 font-mono">
                      {country.symbol} {country.currency}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            This helps us show prices in your local currency
          </p>
        </div>
      </div>
    </div>
  )
}

