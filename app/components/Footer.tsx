'use client'

import React from 'react'
import Link from 'next/link'
import { ExternalLink, Mail, Phone, MapPin, Shield, Lock, Users, FileText } from 'lucide-react'

export default function Footer() {

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">Online Calculator.live</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Your trusted source for free online calculators. We provide accurate, reliable tools for 
              finance, math, health, construction, and more. No registration required, completely free to use.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-gray-300">
                <Shield className="w-5 h-5 mr-2" />
                <span className="text-sm">Secure & Reliable</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Lock className="w-5 h-5 mr-2" />
                <span className="text-sm">Privacy Protected</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/search-calculator" className="text-gray-300 hover:text-white transition-colors">Search Calculators</Link></li>
              <li><Link href="/compare-calculators" className="text-gray-300 hover:text-white transition-colors">Compare Calculators</Link></li>
              <li><Link href="/calculation-history" className="text-gray-300 hover:text-white transition-colors">Calculation History</Link></li>
            </ul>
          </div>

          {/* Popular Calculators */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Popular Calculators</h4>
            <ul className="space-y-2">
              <li><Link href="/bmi-calculator" className="text-gray-300 hover:text-white transition-colors">BMI Calculator</Link></li>
              <li><Link href="/mortgage-calculator" className="text-gray-300 hover:text-white transition-colors">Mortgage Calculator</Link></li>
              <li><Link href="/percentage-calculator" className="text-gray-300 hover:text-white transition-colors">Percentage Calculator</Link></li>
              <li><Link href="/tip-calculator" className="text-gray-300 hover:text-white transition-colors">Tip Calculator</Link></li>
              <li><Link href="/scientific-calculator" className="text-gray-300 hover:text-white transition-colors">Scientific Calculator</Link></li>
            </ul>
          </div>
        </div>

        {/* Calculator Categories */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Financial Calculators */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Financial</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/mortgage-calculator" className="text-gray-300 hover:text-white transition-colors">Mortgage</Link></li>
                <li><Link href="/compound-interest-calculator" className="text-gray-300 hover:text-white transition-colors">Compound Interest</Link></li>
                <li><Link href="/simple-interest-calculator" className="text-gray-300 hover:text-white transition-colors">Simple Interest</Link></li>
                <li><Link href="/discount-calculator" className="text-gray-300 hover:text-white transition-colors">Discount</Link></li>
                <li><Link href="/retirement-calculator" className="text-gray-300 hover:text-white transition-colors">Retirement</Link></li>
              </ul>
            </div>

            {/* Health & Fitness */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Health & Fitness</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/bmi-calculator" className="text-gray-300 hover:text-white transition-colors">BMI</Link></li>
                <li><Link href="/bmr-calculator" className="text-gray-300 hover:text-white transition-colors">BMR</Link></li>
                <li><Link href="/calorie-calculator" className="text-gray-300 hover:text-white transition-colors">Calorie</Link></li>
                <li><Link href="/macro-calculator" className="text-gray-300 hover:text-white transition-colors">Macro</Link></li>
                <li><Link href="/target-heart-rate-calculator" className="text-gray-300 hover:text-white transition-colors">Heart Rate</Link></li>
              </ul>
            </div>

            {/* Math & Science */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Math & Science</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/scientific-calculator" className="text-gray-300 hover:text-white transition-colors">Scientific</Link></li>
                <li><Link href="/percentage-calculator" className="text-gray-300 hover:text-white transition-colors">Percentage</Link></li>
                <li><Link href="/fraction-calculator" className="text-gray-300 hover:text-white transition-colors">Fraction</Link></li>
                <li><Link href="/standard-deviation-calculator" className="text-gray-300 hover:text-white transition-colors">Standard Deviation</Link></li>
                <li><Link href="/unit-converter-calculator" className="text-gray-300 hover:text-white transition-colors">Unit Converter</Link></li>
              </ul>
            </div>

            {/* Construction & Engineering */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Construction</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/calculators/roofing" className="text-gray-300 hover:text-white transition-colors">Roofing</Link></li>
                <li><Link href="/concrete-calculator" className="text-gray-300 hover:text-white transition-colors">Concrete</Link></li>
                <li><Link href="/tile-calculator" className="text-gray-300 hover:text-white transition-colors">Tile</Link></li>
                <li><Link href="/calculators/paint" className="text-gray-300 hover:text-white transition-colors">Paint</Link></li>
                <li><Link href="/calculators/electrical" className="text-gray-300 hover:text-white transition-colors">Electrical</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact & Legal */}
        <div className="border-t border-gray-700 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <a href="mailto:support@onlinecalculator.live" className="hover:text-white transition-colors">
                    support@onlinecalculator.live
                  </a>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Online Services</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Terms & Conditions
                </Link>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy Policy
                </Link>
              </div>
            </div>

            {/* Compliance */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Compliance</h4>
              <div className="space-y-2">
                <Link href="/gdpr-compliance" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  GDPR Compliant
                </Link>
                <Link href="/ccpa-compliance" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  CCPA Compliant
                </Link>
                <Link href="/data-protection" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Data Protected
                </Link>
              </div>
            </div>

            {/* Additional Resources */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <div className="space-y-2">
                <Link href="/sitemap.xml" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Sitemap
                </Link>
                <Link href="/robots.txt" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Robots.txt
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="text-center mb-6">
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <p className="text-gray-300 mb-4">Get in touch for support and feedback</p>
            <div className="flex justify-center space-x-6">
              <a href="mailto:support@onlinecalculator.live" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Online Calculator.live. All rights reserved. | 
            <span className="ml-2">Last updated: August 2025</span>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Built with ❤️ by the Octaleads Team
          </p>
        </div>
      </div>


    </footer>
  )
}
