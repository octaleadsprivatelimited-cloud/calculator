'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { BarChart3, TrendingUp, Users, Clock, Star, Calculator, Eye, Download, Share2 } from 'lucide-react'

interface AnalyticsData {
  totalCalculations: number
  uniqueUsers: number
  popularCalculators: Array<{
    name: string
    calculations: number
    url: string
    category: string
  }>
  recentActivity: Array<{
    calculator: string
    timestamp: Date
    action: 'calculation' | 'download' | 'share'
  }>
  categoryUsage: Array<{
    category: string
    calculations: number
    percentage: number
  }>
}

// Mock data - in a real app, this would come from your analytics service
const mockAnalyticsData: AnalyticsData = {
  totalCalculations: 15420,
  uniqueUsers: 3247,
  popularCalculators: [
    { name: 'BMI Calculator', calculations: 2847, url: '/bmi-calculator', category: 'Health & Fitness' },
    { name: 'Mortgage Calculator', calculations: 2156, url: '/mortgage-calculator', category: 'Financial' },
    { name: 'Percentage Calculator', calculations: 1892, url: '/percentage-calculator', category: 'Math & Science' },
    { name: 'Age Calculator', calculations: 1654, url: '/age-calculator', category: 'Time & Date' },
    { name: 'Loan Calculator', calculations: 1432, url: '/loan-calculator', category: 'Financial' },
    { name: 'Scientific Calculator', calculations: 1287, url: '/scientific-calculator', category: 'Math & Science' },
    { name: 'Investment Calculator', calculations: 1156, url: '/investment-calculator', category: 'Financial' },
    { name: 'Calorie Calculator', calculations: 987, url: '/calorie-calculator', category: 'Health & Fitness' }
  ],
  recentActivity: [
    { calculator: 'BMI Calculator', timestamp: new Date(Date.now() - 5 * 60 * 1000), action: 'calculation' },
    { calculator: 'Mortgage Calculator', timestamp: new Date(Date.now() - 12 * 60 * 1000), action: 'download' },
    { calculator: 'Percentage Calculator', timestamp: new Date(Date.now() - 18 * 60 * 1000), action: 'calculation' },
    { calculator: 'Tire Size Calculator', timestamp: new Date(Date.now() - 25 * 60 * 1000), action: 'share' },
    { calculator: 'Age Calculator', timestamp: new Date(Date.now() - 32 * 60 * 1000), action: 'calculation' },
    { calculator: 'Investment Calculator', timestamp: new Date(Date.now() - 45 * 60 * 1000), action: 'download' }
  ],
  categoryUsage: [
    { category: 'Financial', calculations: 5234, percentage: 34 },
    { category: 'Health & Fitness', calculations: 4123, percentage: 27 },
    { category: 'Math & Science', calculations: 3456, percentage: 22 },
    { category: 'Time & Date', calculations: 1890, percentage: 12 },
    { category: 'Construction', calculations: 717, percentage: 5 }
  ]
}

export default function CalculatorAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(mockAnalyticsData)
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('7d')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Filter calculators by selected category
  const filteredCalculators = useMemo(() => {
    if (selectedCategory === 'all') return analyticsData.popularCalculators
    return analyticsData.popularCalculators.filter(calc => calc.category === selectedCategory)
  }, [analyticsData.popularCalculators, selectedCategory])

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = new Set(analyticsData.popularCalculators.map(calc => calc.category))
    return Array.from(cats).sort()
  }, [analyticsData.popularCalculators])

  // Format timestamp
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  // Get action icon
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'calculation':
        return <Calculator className="w-4 h-4 text-blue-600" />
      case 'download':
        return <Download className="w-4 h-4 text-green-600" />
      case 'share':
        return <Share2 className="w-4 h-4 text-purple-600" />
      default:
        return <Eye className="w-4 h-4 text-gray-600" />
    }
  }

  // Get action color
  const getActionColor = (action: string) => {
    switch (action) {
      case 'calculation':
        return 'text-blue-600 bg-blue-50'
      case 'download':
        return 'text-green-600 bg-green-50'
      case 'share':
        return 'text-purple-600 bg-purple-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Calculator Analytics Dashboard</h1>
            <p className="text-emerald-100 text-lg">
              Track usage patterns, popular calculators, and user engagement across your calculator platform.
            </p>
          </div>
          <div className="hidden md:block">
            <BarChart3 className="w-16 h-16 text-emerald-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Time Range:</span>
            {(['24h', '7d', '30d', 'all'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {range === '24h' ? '24 Hours' : range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Calculations</p>
                <p className="text-3xl font-bold">{analyticsData.totalCalculations.toLocaleString()}</p>
              </div>
              <Calculator className="w-12 h-12 text-blue-200" />
            </div>
            <div className="mt-4 flex items-center text-blue-100">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+12.5% from last period</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Unique Users</p>
                <p className="text-3xl font-bold">{analyticsData.uniqueUsers.toLocaleString()}</p>
              </div>
              <Users className="w-12 h-12 text-green-200" />
            </div>
            <div className="mt-4 flex items-center text-green-100">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+8.3% from last period</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Avg. Session Time</p>
                <p className="text-3xl font-bold">4m 32s</p>
              </div>
              <Clock className="w-12 h-12 text-purple-200" />
            </div>
            <div className="mt-4 flex items-center text-purple-100">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+5.7% from last period</span>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Filter by Category:</span>
                         <select
               value={selectedCategory}
               onChange={(e) => setSelectedCategory(e.target.value)}
               className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
               title="Filter calculators by category"
               aria-label="Filter calculators by category"
             >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Popular Calculators */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              Most Popular Calculators
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {filteredCalculators.map((calculator, index) => (
                <div key={calculator.name} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{calculator.name}</h3>
                      <p className="text-sm text-gray-500">{calculator.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold text-emerald-600">
                      {calculator.calculations.toLocaleString()}
                    </span>
                    <a
                      href={calculator.url}
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                      View
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Usage */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 text-blue-500 mr-2" />
              Usage by Category
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {analyticsData.categoryUsage.map((category) => (
                <div key={category.category} className="bg-white rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">{category.category}</span>
                    <span className="text-sm text-gray-500">{category.calculations.toLocaleString()} calculations</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right mt-1">
                    <span className="text-sm font-medium text-emerald-600">{category.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 text-purple-500 mr-2" />
            Recent Activity
          </h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-3">
              {analyticsData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${getActionColor(activity.action)}`}>
                      {getActionIcon(activity.action)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{activity.calculator}</p>
                      <p className="text-sm text-gray-500 capitalize">{activity.action}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{formatTimestamp(activity.timestamp)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-amber-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-amber-600 mr-2" />
            Key Insights
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-amber-700">
            <div>
              <p className="mb-2"><strong>Top Performing Category:</strong> Financial calculators lead with 34% of total usage</p>
              <p className="mb-2"><strong>User Engagement:</strong> Average session duration increased by 5.7%</p>
            </div>
            <div>
              <p className="mb-2"><strong>Most Popular Calculator:</strong> BMI Calculator with 2,847 calculations</p>
              <p className="mb-2"><strong>Growth Trend:</strong> Overall usage increased by 12.5% this period</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
