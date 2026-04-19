'use client'

import React, { useState, useCallback } from 'react'
import { RotateCcw, TrendingUp, Calculator } from 'lucide-react'
import BaseCalculator from '../BaseCalculator'
import { CalculatorInput, CalculatorSelect } from '../CalculatorUI'
import { CalculatorResultCard } from '../CalculatorResultCard'
import ResultSharing from '../ResultSharing'

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState('1000')
  const [rate, setRate] = useState('5')
  const [time, setTime] = useState('1')
  const [timeUnit, setTimeUnit] = useState('years')
  const [showResults, setShowResults] = useState(false)

  const calculateSimpleInterest = useCallback(() => {
    const p = parseFloat(principal) || 0
    const r = parseFloat(rate) || 0
    const t = parseFloat(time) || 0

    let tYears = t
    if (timeUnit === 'months') tYears = t / 12
    if (timeUnit === 'days') tYears = t / 365

    const interest = p * (r / 100) * tYears
    const total = p + interest

    return {
      principal: p,
      rate: r,
      time: t,
      interest: Math.round(interest * 100) / 100,
      totalAmount: Math.round(total * 100) / 100,
      timeUnit
    }
  }, [principal, rate, time, timeUnit])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setPrincipal('1000')
    setRate('5')
    setTime('1')
    setTimeUnit('years')
    setShowResults(false)
  }

  const result = showResults ? calculateSimpleInterest() : { principal: 0, rate: 0, time: 0, interest: 0, totalAmount: 0, timeUnit: 'years' }

  return (
    <BaseCalculator
      title="Simple Interest Calculator"
      description="Calculate simple interest on loans or investments"
      icon={TrendingUp}
      onCalculate={handleCalculate}
      onReset={handleReset}
      showResults={showResults}
    >
      <div className="space-y-4">
        <CalculatorInput
          label="Principal Amount"
          value={principal}
          onChange={setPrincipal}
          icon={Calculator}
        />
        <CalculatorInput
          label="Annual Interest Rate (%)"
          value={rate}
          onChange={setRate}
          suffix="%"
        />
        <div className="grid grid-cols-2 gap-4">
          <CalculatorInput
            label="Time Period"
            value={time}
            onChange={setTime}
          />
          <CalculatorSelect
            label="Time Unit"
            value={timeUnit}
            onChange={setTimeUnit}
            options={[
              { value: 'years', label: 'Years' },
              { value: 'months', label: 'Months' },
              { value: 'days', label: 'Days' }
            ]}
          />
        </div>
      </div>

      {showResults && (
        <div className="space-y-4 mt-6">
          <CalculatorResultCard
            label="Interest Earned"
            value={result.interest.toLocaleString()}
            primary={true}
            icon={TrendingUp}
          />
          <div className="grid grid-cols-2 gap-4">
            <CalculatorResultCard
              label="Principal"
              value={result.principal.toLocaleString()}
            />
            <CalculatorResultCard
              label="Total Amount"
              value={result.totalAmount.toLocaleString()}
            />
          </div>
          
          <ResultSharing
            title="Simple Interest Result"
            inputs={[
              { label: "Principal", value: result.principal.toLocaleString() },
              { label: "Rate", value: `${result.rate}%` },
              { label: "Time", value: `${result.time} ${result.timeUnit}` }
            ]}
            result={{ 
              label: "Interest", 
              value: result.interest.toLocaleString(),
              unit: ""
            }}
            calculatorName="Simple Interest Calculator"
          />
        </div>
      )}
    </BaseCalculator>
  )
}
