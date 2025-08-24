'use client'

import React, { useState, useEffect } from 'react'
import { Heart, Star, Clock, Calculator, X } from 'lucide-react'

interface FavoriteCalculator {
  id: string
  name: string
  url: string
  category: string
  addedAt: Date
}

interface RecentCalculation {
  id: string
  calculatorName: string
  url: string
  timestamp: Date
  summary: string
}

export default function CalculatorFavorites() {
  const [favorites, setFavorites] = useState<FavoriteCalculator[]>([])
  const [recentCalculations, setRecentCalculations] = useState<RecentCalculation[]>([])
  const [showFavorites, setShowFavorites] = useState(false)
  const [showRecent, setShowRecent] = useState(false)

  // Load favorites and recent calculations from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('calculator-favorites')
    const savedRecent = localStorage.getItem('calculator-recent')
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
    
    if (savedRecent) {
      setRecentCalculations(JSON.parse(savedRecent))
    }
  }, [])

  // Save favorites to localStorage
  const saveFavorites = (newFavorites: FavoriteCalculator[]) => {
    setFavorites(newFavorites)
    localStorage.setItem('calculator-favorites', JSON.stringify(newFavorites))
  }

  // Save recent calculations to localStorage
  const saveRecentCalculations = (newRecent: RecentCalculation[]) => {
    setRecentCalculations(newRecent)
    localStorage.setItem('calculator-recent', JSON.stringify(newRecent))
  }

  // Add calculator to favorites
  const addToFavorites = (calculator: Omit<FavoriteCalculator, 'addedAt'>) => {
    const newFavorite: FavoriteCalculator = {
      ...calculator,
      addedAt: new Date()
    }
    
    const updatedFavorites = [...favorites, newFavorite]
    saveFavorites(updatedFavorites)
  }

  // Remove calculator from favorites
  const removeFromFavorites = (id: string) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== id)
    saveFavorites(updatedFavorites)
  }

  // Add recent calculation
  const addRecentCalculation = (calculation: Omit<RecentCalculation, 'timestamp'>) => {
    const newCalculation: RecentCalculation = {
      ...calculation,
      timestamp: new Date()
    }
    
    const updatedRecent = [newCalculation, ...recentCalculations.slice(0, 9)] // Keep only 10 most recent
    saveRecentCalculations(updatedRecent)
  }

  // Clear recent calculations
  const clearRecentCalculations = () => {
    setRecentCalculations([])
    localStorage.removeItem('calculator-recent')
  }

  // Format date
  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return new Date(date).toLocaleDateString()
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Favorites Panel */}
      {showFavorites && (
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-80 max-h-96 overflow-hidden mb-2">
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-3 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <h3 className="font-semibold">Favorite Calculators</h3>
              </div>
              <button
                onClick={() => setShowFavorites(false)}
                className="text-white hover:text-pink-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto p-4">
            {favorites.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No favorite calculators yet</p>
                <p className="text-sm">Click the heart icon on any calculator to add it here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {favorites.map((favorite) => (
                  <div key={favorite.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <a
                        href={favorite.url}
                        className="font-medium text-gray-800 hover:text-blue-600 transition-colors"
                      >
                        {favorite.name}
                      </a>
                      <p className="text-sm text-gray-500">{favorite.category}</p>
                    </div>
                                         <button
                       onClick={() => removeFromFavorites(favorite.id)}
                       className="text-red-500 hover:text-red-700 transition-colors p-1"
                       title="Remove from favorites"
                       aria-label="Remove from favorites"
                     >
                       <X className="w-4 h-4" />
                     </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Calculations Panel */}
      {showRecent && (
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-80 max-h-96 overflow-hidden mb-2">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <h3 className="font-semibold">Recent Calculations</h3>
              </div>
              <div className="flex items-center space-x-2">
                                 <button
                   onClick={clearRecentCalculations}
                   className="text-white hover:text-blue-100 transition-colors text-sm"
                   title="Clear all recent calculations"
                   aria-label="Clear all recent calculations"
                 >
                   Clear
                 </button>
                <button
                  onClick={() => setShowRecent(false)}
                  className="text-white hover:text-blue-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto p-4">
            {recentCalculations.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No recent calculations</p>
                <p className="text-sm">Your calculation history will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentCalculations.map((calculation) => (
                  <div key={calculation.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <a
                        href={calculation.url}
                        className="font-medium text-gray-800 hover:text-blue-600 transition-colors"
                      >
                        {calculation.calculatorName}
                      </a>
                      <span className="text-xs text-gray-500">{formatDate(calculation.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-600">{calculation.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="flex flex-col space-y-2">
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
            showFavorites 
              ? 'bg-pink-500 text-white scale-110' 
              : 'bg-white text-pink-500 hover:bg-pink-50 hover:scale-105'
          }`}
          title="Favorite Calculators"
        >
          <Heart className="w-6 h-6" />
        </button>
        
        <button
          onClick={() => setShowRecent(!showRecent)}
          className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
            showRecent 
              ? 'bg-blue-500 text-white scale-110' 
              : 'bg-white text-blue-500 hover:bg-blue-50 hover:scale-105'
          }`}
          title="Recent Calculations"
        >
          <Clock className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

// Export functions for other components to use
export const useCalculatorFavorites = () => {
  const addToFavorites = (calculator: Omit<FavoriteCalculator, 'addedAt'>) => {
    const savedFavorites = localStorage.getItem('calculator-favorites')
    const favorites = savedFavorites ? JSON.parse(savedFavorites) : []
    
    const newFavorite: FavoriteCalculator = {
      ...calculator,
      addedAt: new Date()
    }
    
    const updatedFavorites = [...favorites, newFavorite]
    localStorage.setItem('calculator-favorites', JSON.stringify(updatedFavorites))
  }

  const addRecentCalculation = (calculation: Omit<RecentCalculation, 'timestamp'>) => {
    const savedRecent = localStorage.getItem('calculator-recent')
    const recent = savedRecent ? JSON.parse(savedRecent) : []
    
    const newCalculation: RecentCalculation = {
      ...calculation,
      timestamp: new Date()
    }
    
    const updatedRecent = [newCalculation, ...recent.slice(0, 9)]
    localStorage.setItem('calculator-recent', JSON.stringify(updatedRecent))
  }

  return { addToFavorites, addRecentCalculation }
}
