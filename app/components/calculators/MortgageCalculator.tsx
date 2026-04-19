'use client'
import React, { useState, useCallback } from 'react'
import { Home, Calculator, TrendingUp } from 'lucide-react'
import BaseCalculator from '../BaseCalculator'
import { CalculatorInput, CalculatorSelect } from '../CalculatorUI'
import { CalculatorResultCard } from '../CalculatorResultCard'
import ResultSharing from '../ResultSharing'

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState('300000')
  const [downPayment, setDownPayment] = useState('60000')
  const [interestRate, setInterestRate] = useState('5.5')
  const [loanTerm, setLoanTerm] = useState('30')
  const [showResults, setShowResults] = useState(false)

  const calculateMortgage = useCallback(() => {
    const price = parseFloat(homePrice) || 0
    const down = parseFloat(downPayment) || 0
    const rate = parseFloat(interestRate) || 0
    const term = parseFloat(loanTerm) || 30
    
    const loanAmount = price - down
    const monthlyRate = rate / 100 / 12
    const termMonths = term * 12
    
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                          (Math.pow(1 + monthlyRate, termMonths) - 1)
    
    const totalPayment = monthlyPayment * termMonths
    const totalInterest = totalPayment - loanAmount

    return { 
      loanAmount, 
      monthlyPayment, 
      totalInterest, 
      totalPayment,
      details: { price, down, rate, term }
    }
  }, [homePrice, downPayment, interestRate, loanTerm])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setHomePrice('300000')
    setDownPayment('60000')
    setInterestRate('5.5')
    setLoanTerm('30')
    setShowResults(false)
  }

  const result = showResults ? calculateMortgage() : null

  return (
    <BaseCalculator
      title="Mortgage Calculator"
      description="Estimate your monthly home loan payments"
      icon={Home}
      onCalculate={handleCalculate}
      onReset={handleReset}
      showResults={showResults}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CalculatorInput
          label="Home Price"
          value={homePrice}
          onChange={setHomePrice}
        />
        <CalculatorInput
          label="Down Payment"
          value={downPayment}
          onChange={setDownPayment}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CalculatorInput
          label="Interest Rate"
          value={interestRate}
          onChange={setInterestRate}
          suffix="%"
        />
        <CalculatorSelect
          label="Loan Term"
          value={loanTerm}
          onChange={setLoanTerm}
          options={[
            { value: '15', label: '15 years' },
            { value: '20', label: '20 years' },
            { value: '30', label: '30 years' }
          ]}
        />
      </div>

      {showResults && result && (
        <div className="mt-8">
          <ResultSharing
            title="Mortgage Payment Estimate"
            inputs={[
              { label: "Price", value: result.details.price.toLocaleString() },
              { label: "Down", value: result.details.down.toLocaleString() },
              { label: "Rate", value: `${result.details.rate}%` }
            ]}
            result={{ 
              label: "Monthly", 
              value: result.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
              unit: ""
            }}
            calculatorName="Mortgage Calculator"
          />
        </div>
      )}

      {/* Result Cards */}
      {showResults && result && (
        <div className="space-y-4">
          <CalculatorResultCard
            label="Monthly Payment"
            value={result.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            primary={true}
            icon={Home}
          />
          <div className="grid grid-cols-2 gap-4">
            <CalculatorResultCard
              label="Total Interest"
              value={result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            />
            <CalculatorResultCard
              label="Total Payment"
              value={result.totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            />
          </div>
        </div>
      )}
    </BaseCalculator>
  )
}
