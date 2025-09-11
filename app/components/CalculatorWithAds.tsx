'use client'

import React from 'react'

interface CalculatorWithAdsProps {
  children: React.ReactNode
  className?: string
}

export default function CalculatorWithAds({ children, className = '' }: CalculatorWithAdsProps) {
  return (
    <div className={`max-w-4xl mx-auto px-4 py-8 ${className}`}>
      {children}
    </div>
  )
}
