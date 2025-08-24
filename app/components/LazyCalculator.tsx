'use client'

import React, { Suspense, lazy, ComponentType } from 'react'
import { Calculator, Loader2 } from 'lucide-react'

interface LazyCalculatorProps {
  calculator: ComponentType<any>
  fallback?: React.ReactNode
}

const defaultFallback = (
  <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-lg">
    <div className="text-center">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
      <p className="text-gray-600">Loading calculator...</p>
    </div>
  </div>
)

export default function LazyCalculator({ calculator: CalculatorComponent, fallback = defaultFallback }: LazyCalculatorProps) {
  return (
    <Suspense fallback={fallback}>
      <CalculatorComponent />
    </Suspense>
  )
}

// Lazy load specific calculators for better performance
export const LazyTireSizeCalculator = lazy(() => import('./calculators/TireSizeCalculator'))
export const LazyTileCalculator = lazy(() => import('./calculators/TileCalculator'))
export const LazyWindChillCalculator = lazy(() => import('./calculators/WindChillCalculator'))
export const LazyHeatIndexCalculator = lazy(() => import('./calculators/HeatIndexCalculator'))
export const LazyDewPointCalculator = lazy(() => import('./calculators/DewPointCalculator'))
export const LazyBandwidthCalculator = lazy(() => import('./calculators/BandwidthCalculator'))
export const LazyTimeDurationCalculator = lazy(() => import('./calculators/TimeDurationCalculator'))
export const LazyDayCounterCalculator = lazy(() => import('./calculators/DayCounterCalculator'))
export const LazyDayOfWeekCalculator = lazy(() => import('./calculators/DayOfWeekCalculator'))
export const LazyMulchCalculator = lazy(() => import('./calculators/MulchCalculator'))
export const LazyGravelCalculator = lazy(() => import('./calculators/GravelCalculator'))
