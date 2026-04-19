'use client'
import React from 'react'
import { LucideIcon } from 'lucide-react'

interface CalculatorResultCardProps {
  label: string
  value: string | number
  icon?: LucideIcon
  primary?: boolean
  unit?: string
}

export function CalculatorResultCard({
  label,
  value,
  icon: Icon,
  primary = false,
  unit = ''
}: CalculatorResultCardProps) {
  if (primary) {
    return (
      <div className="p-6 bg-google-blueLight rounded-3xl border border-google-blue/10 relative overflow-hidden group">
        {Icon && (
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon className="w-16 h-16 text-google-blue" />
          </div>
        )}
        <h3 className="text-google-blue font-medium mb-1 text-sm uppercase tracking-wider">{label}</h3>
        <div className="text-4xl font-light text-google-blue tracking-tight">
          {value}{unit}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-white border border-google-border rounded-2xl">
      <h4 className="text-google-gray text-xs mb-1">{label}</h4>
      <div className="text-lg font-medium text-google-text">
        {value}{unit}
      </div>
    </div>
  )
}
