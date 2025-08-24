'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { History, Download, Share2, Trash2, Filter, Search, Calendar, Calculator, Eye, BarChart3, FileText } from 'lucide-react'

interface CalculationRecord {
  id: string
  calculatorName: string
  calculatorUrl: string
  category: string
  inputs: Record<string, any>
  results: Record<string, any>
  timestamp: Date
  sessionId: string
  calculationTime: number // in milliseconds
}

interface HistoryFilters {
  category: string
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year'
  searchQuery: string
  calculatorType: string
}

const mockHistoryData: CalculationRecord[] = [
  {
    id: '1',
    calculatorName: 'BMI Calculator',
    calculatorUrl: '/bmi-calculator',
    category: 'Health & Fitness',
    inputs: { weight: 70, height: 175, units: 'metric' },
    results: { bmi: 22.9, category: 'Normal weight', healthRisk: 'Low' },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    sessionId: 'session_1',
    calculationTime: 1200
  },
  {
    id: '2',
    calculatorName: 'Mortgage Calculator',
    calculatorUrl: '/mortgage-calculator',
    category: 'Financial',
    inputs: { loanAmount: 300000, interestRate: 3.5, loanTerm: 30, downPayment: 60000 },
    results: { monthlyPayment: 1077.71, totalInterest: 147975.60, totalPayment: 447975.60 },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    sessionId: 'session_1',
    calculationTime: 2500
  },
  {
    id: '3',
    calculatorName: 'Percentage Calculator',
    calculatorUrl: '/percentage-calculator',
    category: 'Math & Science',
    inputs: { value: 150, percentage: 15, operation: 'increase' },
    results: { result: 172.5, change: 22.5, originalValue: 150 },
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    sessionId: 'session_2',
    calculationTime: 800
  },
  {
    id: '4',
    calculatorName: 'Tire Size Calculator',
    calculatorUrl: '/tire-size-calculator',
    category: 'Conversions',
    inputs: { currentWidth: 205, currentAspectRatio: 55, currentDiameter: 16, newWidth: 225, newAspectRatio: 50, newDiameter: 17 },
    results: { speedDifference: 2.3, circumferenceChange: 15.2, clearanceChange: -2.5 },
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    sessionId: 'session_2',
    calculationTime: 3200
  },
  {
    id: '5',
    calculatorName: 'Age Calculator',
    calculatorUrl: '/age-calculator',
    category: 'Time & Date',
    inputs: { birthDate: '1990-05-15', targetDate: '2024-01-20' },
    results: { years: 33, months: 8, days: 5, totalDays: 12345 },
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    sessionId: 'session_3',
    calculationTime: 600
  },
  {
    id: '6',
    calculatorName: 'Investment Calculator',
    calculatorUrl: '/investment-calculator',
    category: 'Financial',
    inputs: { principal: 10000, annualRate: 7, years: 10, monthlyContribution: 500 },
    results: { finalAmount: 98765.43, totalContributed: 70000, interestEarned: 28765.43 },
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    sessionId: 'session_3',
    calculationTime: 1800
  }
]

const categories = ['All', 'Financial', 'Health & Fitness', 'Math & Science', 'Conversions', 'Time & Date', 'Construction', 'Education', 'Other']
const dateRanges = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' }
]

export default function CalculatorHistory() {
  const [historyData, setHistoryData] = useState<CalculationRecord[]>(mockHistoryData)
  const [filters, setFilters] = useState<HistoryFilters>({
    category: 'All',
    dateRange: 'all',
    searchQuery: '',
    calculatorType: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedRecords, setSelectedRecords] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'timeline'>('list')

  // Filter history data based on current filters
  const filteredHistory = useMemo(() => {
    let filtered = historyData

    // Category filter
    if (filters.category !== 'All') {
      filtered = filtered.filter(record => record.category === filters.category)
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date()
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      switch (filters.dateRange) {
        case 'today':
          filtered = filtered.filter(record => record.timestamp >= startOfDay)
          break
        case 'week':
          const startOfWeek = new Date(startOfDay.getTime() - startOfDay.getDay() * 24 * 60 * 60 * 1000)
          filtered = filtered.filter(record => record.timestamp >= startOfWeek)
          break
        case 'month':
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
          filtered = filtered.filter(record => record.timestamp >= startOfMonth)
          break
        case 'year':
          const startOfYear = new Date(now.getFullYear(), 0, 1)
          filtered = filtered.filter(record => record.timestamp >= startOfYear)
          break
      }
    }

    // Search query filter
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(record =>
        record.calculatorName.toLowerCase().includes(query) ||
        record.category.toLowerCase().includes(query) ||
        Object.values(record.inputs).some(value => 
          String(value).toLowerCase().includes(query)
        ) ||
        Object.values(record.results).some(value => 
          String(value).toLowerCase().includes(query)
        )
      )
    }

    // Calculator type filter
    if (filters.calculatorType.trim()) {
      filtered = filtered.filter(record =>
        record.calculatorName.toLowerCase().includes(filters.calculatorType.toLowerCase())
      )
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }, [historyData, filters])

  // Get unique calculator types for filter
  const calculatorTypes = useMemo(() => {
    const types = new Set(historyData.map(record => record.calculatorName))
    return Array.from(types).sort()
  }, [historyData])

  // Format timestamp
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`
    return timestamp.toLocaleDateString()
  }

  // Format calculation time
  const formatCalculationTime = (time: number) => {
    if (time < 1000) return `${time}ms`
    return `${(time / 1000).toFixed(1)}s`
  }

  // Toggle record selection
  const toggleRecordSelection = (recordId: string) => {
    setSelectedRecords(prev =>
      prev.includes(recordId)
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    )
  }

  // Select all visible records
  const selectAllVisible = () => {
    setSelectedRecords(filteredHistory.map(record => record.id))
  }

  // Clear selection
  const clearSelection = () => {
    setSelectedRecords([])
  }

  // Delete selected records
  const deleteSelectedRecords = () => {
    setHistoryData(prev => prev.filter(record => !selectedRecords.includes(record.id)))
    setSelectedRecords([])
  }

  // Export selected records
  const exportSelectedRecords = () => {
    const selectedData = historyData.filter(record => selectedRecords.includes(record.id))
    const exportData = {
      exportDate: new Date().toISOString(),
      totalRecords: selectedData.length,
      records: selectedData.map(record => ({
        calculator: record.calculatorName,
        category: record.category,
        inputs: record.inputs,
        results: record.results,
        timestamp: record.timestamp.toISOString(),
        calculationTime: record.calculationTime
      }))
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `calculator-history-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Share selected records
  const shareSelectedRecords = () => {
    const selectedData = historyData.filter(record => selectedRecords.includes(record.id))
    
    if (navigator.share) {
      const shareData = {
        title: 'My Calculator History',
        text: `I've used ${selectedData.length} calculators recently. Check out my calculation history!`,
        url: window.location.href
      }
      navigator.share(shareData)
    } else {
      // Fallback: copy to clipboard
      const summary = selectedData.map(record => 
        `${record.calculatorName}: ${Object.values(record.results).slice(0, 2).join(', ')}`
      ).join('\n')
      
      navigator.clipboard.writeText(summary)
      alert('Calculation summary copied to clipboard!')
    }
  }

  // Get statistics
  const statistics = useMemo(() => {
    const totalCalculations = historyData.length
    const uniqueCalculators = new Set(historyData.map(record => record.calculatorName)).size
    const totalTime = historyData.reduce((sum, record) => sum + record.calculationTime, 0)
    const averageTime = totalTime / totalCalculations

    const categoryBreakdown = historyData.reduce((acc, record) => {
      acc[record.category] = (acc[record.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalCalculations,
      uniqueCalculators,
      averageTime: Math.round(averageTime),
      categoryBreakdown
    }
  }, [historyData])

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Calculation History</h1>
            <p className="text-teal-100 text-lg">
              Track your calculator usage, review past calculations, and analyze your patterns.
            </p>
          </div>
          <div className="hidden md:block">
            <History className="w-16 h-16 text-teal-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Statistics Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Calculations</p>
                <p className="text-3xl font-bold">{statistics.totalCalculations}</p>
              </div>
              <Calculator className="w-12 h-12 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Unique Calculators</p>
                <p className="text-3xl font-bold">{statistics.uniqueCalculators}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Avg. Time</p>
                <p className="text-3xl font-bold">{formatCalculationTime(statistics.averageTime)}</p>
              </div>
              <Calendar className="w-12 h-12 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Sessions</p>
                <p className="text-3xl font-bold">{new Set(historyData.map(r => r.sessionId)).size}</p>
              </div>
              <Eye className="w-12 h-12 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showFilters || filters.category !== 'All' || filters.dateRange !== 'all' || filters.searchQuery
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4 inline mr-2" />
              Filters
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="List view"
              >
                <FileText className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Grid view"
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'timeline' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Timeline view"
              >
                <Calendar className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {selectedRecords.length > 0 && (
              <>
                <button
                  onClick={exportSelectedRecords}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export ({selectedRecords.length})
                </button>
                <button
                  onClick={shareSelectedRecords}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
                <button
                  onClick={deleteSelectedRecords}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
            <div className="grid md:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                 <select
                   value={filters.category}
                   onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                   title="Filter by calculator category"
                   aria-label="Filter by calculator category"
                 >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                                 <select
                   value={filters.dateRange}
                   onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                   title="Filter by date range"
                   aria-label="Filter by date range"
                 >
                  {dateRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>

              {/* Calculator Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calculator Type</label>
                                 <select
                   value={filters.calculatorType}
                   onChange={(e) => setFilters(prev => ({ ...prev, calculatorType: e.target.value }))}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                   title="Filter by calculator type"
                   aria-label="Filter by calculator type"
                 >
                  <option value="">All Types</option>
                  {calculatorTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Search Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search calculations..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selection Actions */}
        {selectedRecords.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-blue-800 font-medium">
                  {selectedRecords.length} record{selectedRecords.length !== 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={selectAllVisible}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Select All Visible
                </button>
                <button
                  onClick={clearSelection}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* History Records */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {filters.category !== 'All' || filters.dateRange !== 'all' || filters.searchQuery
                ? `Filtered Results (${filteredHistory.length})`
                : 'Recent Calculations'
              }
            </h2>
            <span className="text-gray-500 text-sm">
              {filteredHistory.length} of {historyData.length} total records
            </span>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No calculations found</h3>
              <p className="text-gray-500">Try adjusting your filters or start using some calculators.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map(record => (
                <div key={record.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                                                 <input
                           type="checkbox"
                           checked={selectedRecords.includes(record.id)}
                           onChange={() => toggleRecordSelection(record.id)}
                           className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                           title={`Select ${record.calculatorName} calculation record`}
                           aria-label={`Select ${record.calculatorName} calculation record`}
                         />
                        <h3 className="text-lg font-semibold text-gray-800">{record.calculatorName}</h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {record.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatTimestamp(record.timestamp)} • {formatCalculationTime(record.calculationTime)}
                      </p>
                    </div>
                    <a
                      href={record.calculatorUrl}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Use Again
                    </a>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Inputs */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3 text-green-700">Inputs</h4>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        {Object.entries(record.inputs).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm mb-1">
                            <span className="text-green-700 font-medium">{key}:</span>
                            <span className="text-green-800">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Results */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3 text-blue-700">Results</h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        {Object.entries(record.results).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm mb-1">
                            <span className="text-blue-700 font-medium">{key}:</span>
                            <span className="text-blue-800">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
