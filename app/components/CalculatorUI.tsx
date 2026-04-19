'use client'
import React from 'react'
import { LucideIcon } from 'lucide-react'

interface CalculatorInputProps {
  label: string
  value: string | number
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  icon?: LucideIcon
  suffix?: string
  min?: number
  max?: number
  step?: string | number
}

export function CalculatorInput({
  label,
  value,
  onChange,
  type = 'number',
  placeholder = '0',
  icon: Icon,
  suffix,
  min,
  max,
  step
}: CalculatorInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-google-text px-1">{label}</label>
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-google-gray group-focus-within:text-google-blue transition-colors" />
        )}
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-google-gray group-focus-within:text-google-blue transition-colors">{suffix}</span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${Icon ? 'pl-11' : 'pl-4'} ${suffix ? 'pr-10' : 'pr-4'} py-3 bg-google-lightGray border-none rounded-2xl focus:ring-2 focus:ring-google-blue transition-all outline-none text-google-text placeholder-google-gray/50`}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
        />
      </div>
    </div>
  )
}

interface CalculatorSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
}

export function CalculatorSelect({
  label,
  value,
  onChange,
  options
}: CalculatorSelectProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-google-text px-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-google-lightGray border-none rounded-2xl focus:ring-2 focus:ring-google-blue transition-all outline-none text-google-text appearance-none cursor-pointer"
        aria-label={label}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
