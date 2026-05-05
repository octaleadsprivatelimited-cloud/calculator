'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Calculator, Heart, Shield, Lock, Mail, ExternalLink } from 'lucide-react'

export default function Footer() {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({})

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const calculatorCategories = [
    {
      title: 'Financial',
      icon: '💰',
      links: [
        { name: 'Mortgage', href: '/mortgage-calculator' },
        { name: 'Interest', href: '/compound-interest-calculator' },
        { name: 'Retirement', href: '/retirement-calculator' },
        { name: 'Discount', href: '/discount-calculator' }
      ]
    },
    {
      title: 'Health',
      icon: '🏥',
      links: [
        { name: 'BMI', href: '/bmi-calculator' },
        { name: 'BMR', href: '/bmr-calculator' },
        { name: 'Calorie', href: '/calorie-calculator' },
        { name: 'Heart Rate', href: '/target-heart-rate-calculator' }
      ]
    },
    {
      title: 'Math',
      icon: '🔢',
      links: [
        { name: 'Scientific', href: '/scientific-calculator' },
        { name: 'Percentage', href: '/percentage-calculator' },
        { name: 'Fraction', href: '/fraction-calculator' },
        { name: 'Unit Converter', href: '/unit-converter-calculator' }
      ]
    }
  ]

  return (
                <footer className="bg-white text-gray-900 py-12 rounded-t-3xl border-t-4 border-[#D4AF37] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Mobile-First Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Online Calculator.live
            </h3>
          </div>
          <p className="text-gray-600 text-sm max-w-md mx-auto mb-4">
            Free, accurate calculators for finance, health, math & more. No registration required.
          </p>
          
          {/* Trust Indicators - Mobile Optimized */}
          <div className="flex justify-center space-x-6 mb-6">
            <div className="flex items-center text-xs text-gray-600 hover:scale-105 transition-transform duration-300">
              <Shield className="w-4 h-4 mr-1 text-green-500" />
              <span>Secure</span>
            </div>
            <div className="flex items-center text-xs text-gray-600 hover:scale-105 transition-transform duration-300">
              <Lock className="w-4 h-4 mr-1 text-blue-500" />
              <span>Private</span>
            </div>
            <div className="flex items-center text-xs text-gray-600 hover:scale-105 transition-transform duration-300">
              <Heart className="w-4 h-4 mr-1 text-red-500" />
              <span>Free</span>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Hidden on Mobile */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Calculator className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Online Calculator.live
                </h3>
              </div>
              <p className="text-gray-600 mb-4 max-w-md">
                Your trusted source for free online calculators. We provide accurate, reliable tools for 
                finance, math, health, construction, and more. No registration required, completely free to use.
              </p>
              <div className="flex space-x-6">
                <div className="flex items-center text-gray-600">
                  <Shield className="w-5 h-5 mr-2 text-green-500" />
                  <span className="text-sm">Secure & Reliable</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Lock className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="text-sm">Privacy Protected</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-600 hover:text-amber-600 hover:underline transition-colors">Home</Link></li>
                <li><Link href="/search-calculator" className="text-gray-600 hover:text-amber-600 transition-colors">Search Calculators</Link></li>
                <li><Link href="/compare-calculators" className="text-gray-600 hover:text-amber-600 transition-colors">Compare Calculators</Link></li>
                <li><Link href="/calculation-history" className="text-gray-600 hover:text-amber-600 transition-colors">History</Link></li>
              </ul>
            </div>

            {/* Popular Calculators */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Popular</h4>
              <ul className="space-y-2">
                <li><Link href="/bmi-calculator" className="text-gray-600 hover:text-amber-600 transition-colors">BMI Calculator</Link></li>
                <li><Link href="/mortgage-calculator" className="text-gray-600 hover:text-amber-600 transition-colors">Mortgage Calculator</Link></li>
                <li><Link href="/percentage-calculator" className="text-gray-600 hover:text-amber-600 transition-colors">Percentage Calculator</Link></li>
                <li><Link href="/scientific-calculator" className="text-gray-600 hover:text-amber-600 transition-colors">Scientific Calculator</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile Collapsible Categories */}
        <div className="lg:hidden mb-8">
          <h4 className="text-lg font-semibold mb-4 text-center text-gray-900">Calculator Categories</h4>
          <div className="space-y-3">
            {calculatorCategories.map((category) => (
              <div key={category.title} className="bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(category.title)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium text-gray-900">{category.title}</span>
                  </div>
                  {expandedSections[category.title] ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedSections[category.title] && (
                  <div className="px-4 pb-3 bg-gray-50/50">
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {category.links.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          className="text-sm text-gray-600 hover:text-amber-600 transition-colors py-1"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Essential Links - Mobile Optimized */}
        <div className="border-t border-gray-200 pt-6 mb-6">
          <div className="text-center">
            {/* Mobile: Compact collapsible sections */}
            <div className="lg:hidden space-y-4">
              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h5 className="text-sm font-semibold text-gray-900 mb-2">Contact Information</h5>
                <div className="flex flex-wrap justify-center gap-3 text-xs">
                  <a href="mailto:support@onlinecalculator.live" className="text-gray-600 hover:text-amber-600 transition-colors flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    support@onlinecalculator.live
                  </a>
                  <span className="text-gray-500">Online Services</span>
                  <span className="text-gray-500">24/7 Support</span>
                </div>
              </div>

              {/* Legal & Compliance */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h5 className="text-sm font-semibold text-gray-900 mb-2">Legal & Compliance</h5>
                <div className="flex flex-wrap justify-center gap-3 text-xs">
                  <Link href="/terms" className="text-gray-600 hover:text-amber-600 transition-colors">Terms & Conditions</Link>
                  <Link href="/privacy" className="text-gray-600 hover:text-amber-600 transition-colors">Privacy Policy</Link>
                  <Link href="/gdpr-compliance" className="text-gray-600 hover:text-amber-600 transition-colors">GDPR Compliant</Link>
                  <Link href="/ccpa-compliance" className="text-gray-600 hover:text-amber-600 transition-colors">CCPA Compliant</Link>
                  <Link href="/data-protection" className="text-gray-600 hover:text-amber-600 transition-colors">Data Protected</Link>
                </div>
              </div>

              {/* Resources */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h5 className="text-sm font-semibold text-gray-900 mb-2">Resources</h5>
                <div className="flex flex-wrap justify-center gap-3 text-xs">
                  <Link href="/sitemap.xml" className="text-gray-600 hover:text-amber-600 transition-colors">Sitemap</Link>
                  <Link href="/robots.txt" className="text-gray-600 hover:text-amber-600 transition-colors">Robots.txt</Link>
                </div>
              </div>
            </div>

            {/* Desktop: Full horizontal layout */}
            <div className="hidden lg:block">
              <div className="space-y-4">
                {/* Contact Information */}
                <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">Contact Information:</span>
                  <a href="mailto:support@onlinecalculator.live" className="hover:text-amber-600 transition-colors flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    support@onlinecalculator.live
                  </a>
                  <span>Online Services</span>
                  <span>24/7 Support</span>
                </div>

                {/* Legal */}
                <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">Legal:</span>
                  <Link href="/terms" className="hover:text-amber-600 transition-colors">Terms & Conditions</Link>
                  <Link href="/privacy" className="hover:text-amber-600 transition-colors">Privacy Policy</Link>
                </div>

                {/* Compliance */}
                <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">Compliance:</span>
                  <Link href="/gdpr-compliance" className="hover:text-amber-600 transition-colors">GDPR Compliant</Link>
                  <Link href="/ccpa-compliance" className="hover:text-amber-600 transition-colors">CCPA Compliant</Link>
                  <Link href="/data-protection" className="hover:text-amber-600 transition-colors">Data Protected</Link>
                </div>

                {/* Resources */}
                <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">Resources:</span>
                  <Link href="/sitemap.xml" className="hover:text-amber-600 transition-colors">Sitemap</Link>
                  <Link href="/robots.txt" className="hover:text-amber-600 transition-colors">Robots.txt</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright - Creative Design */}
        <div className="border-t border-gray-200 pt-6 text-center">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-2 lg:space-y-0">
            <p className="text-gray-500 text-sm">
              © 2024 Online Calculator.live. All rights reserved.
            </p>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <span>Built with</span>
              <Heart className="w-3 h-3 text-red-500 fill-current" />
              <span>by the Octaleads Team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
