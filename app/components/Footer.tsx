'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Mail, Phone, MapPin, Shield, Lock, Users, FileText } from 'lucide-react'

export default function Footer() {
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

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
                <li><Link href="/loan-calculator" className="text-gray-300 hover:text-white transition-colors">Loan</Link></li>
                <li><Link href="/investment-calculator" className="text-gray-300 hover:text-white transition-colors">Investment</Link></li>
                <li><Link href="/compound-interest-calculator" className="text-gray-300 hover:text-white transition-colors">Compound Interest</Link></li>
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
                <li><Link href="/roofing-calculator" className="text-gray-300 hover:text-white transition-colors">Roofing</Link></li>
                <li><Link href="/concrete-calculator" className="text-gray-300 hover:text-white transition-colors">Concrete</Link></li>
                <li><Link href="/tile-calculator" className="text-gray-300 hover:text-white transition-colors">Tile</Link></li>
                <li><Link href="/paint-calculator" className="text-gray-300 hover:text-white transition-colors">Paint</Link></li>
                <li><Link href="/electrical-calculator" className="text-gray-300 hover:text-white transition-colors">Electrical</Link></li>
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
                <button
                  onClick={() => setShowTerms(true)}
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Terms & Conditions
                </button>
                <button
                  onClick={() => setShowPrivacy(true)}
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy Policy
                </button>
              </div>
            </div>

            {/* Compliance */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Compliance</h4>
              <div className="space-y-2 text-gray-300 text-sm">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>CCPA Compliant</span>
                </div>
                <div className="flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  <span>Data Protected</span>
                </div>
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
                <a href="https://github.com/octaleadsprivatelimited-cloud/calculator" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="text-center mb-6">
            <h4 className="text-lg font-semibold mb-4">Stay Connected</h4>
            <p className="text-gray-300 mb-4">Follow us for updates and new calculator features</p>
            <div className="flex justify-center space-x-6">
              <a href="https://github.com/octaleadsprivatelimited-cloud/calculator" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
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
            Built with ❤️ by the Octaleads Team | 
            <a href="https://github.com/octaleadsprivatelimited-cloud/calculator" target="_blank" rel="noopener noreferrer" className="ml-2 text-gray-400 hover:text-white transition-colors">
              View on GitHub
            </a>
          </p>
        </div>
      </div>

      {/* Terms & Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white text-gray-800 rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Terms and Conditions</h2>
                <button
                  onClick={() => setShowTerms(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="prose prose-gray max-w-none">
                <p className="text-sm text-gray-600 mb-4">Last updated: August 2025</p>
                
                <h3 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h3>
                <p className="mb-4">
                  By accessing and using Online Calculator.live, you accept and agree to be bound by the terms and provision of this agreement.
                </p>

                <h3 className="text-xl font-semibold mb-3">2. Use License</h3>
                <p className="mb-4">
                  Permission is granted to temporarily download one copy of the materials (information or software) on Online Calculator.live 
                  for personal, non-commercial transitory viewing only.
                </p>

                <h3 className="text-xl font-semibold mb-3">3. Disclaimer</h3>
                <p className="mb-4">
                  The materials on Online Calculator.live are provided on an 'as is' basis. Online Calculator.live makes no warranties, 
                  expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied 
                  warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual 
                  property or other violation of rights.
                </p>

                <h3 className="text-xl font-semibold mb-3">4. Limitations</h3>
                <p className="mb-4">
                  In no event shall Online Calculator.live or its suppliers be liable for any damages (including, without limitation, 
                  damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use 
                  the materials on Online Calculator.live.
                </p>

                <h3 className="text-xl font-semibold mb-3">5. Accuracy of Materials</h3>
                <p className="mb-4">
                  The materials appearing on Online Calculator.live could include technical, typographical, or photographic errors. 
                  Online Calculator.live does not warrant that any of the materials on its website are accurate, complete or current.
                </p>

                <h3 className="text-xl font-semibold mb-3">6. Links</h3>
                <p className="mb-4">
                  Online Calculator.live has not reviewed all of the sites linked to its website and is not responsible for the 
                  contents of any such linked site. The inclusion of any link does not imply endorsement by Online Calculator.live 
                  of the site.
                </p>

                <h3 className="text-xl font-semibold mb-3">7. Modifications</h3>
                <p className="mb-4">
                  Online Calculator.live may revise these terms of service for its website at any time without notice. By using 
                  this website you are agreeing to be bound by the then current version of these Terms of Service.
                </p>

                <h3 className="text-xl font-semibold mb-3">8. Governing Law</h3>
                <p className="mb-4">
                  These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit 
                  to the exclusive jurisdiction of the courts in that location.
                </p>

                <h3 className="text-xl font-semibold mb-3">9. User Responsibilities</h3>
                <p className="mb-4">
                  Users are responsible for verifying the accuracy of calculations and results. Online Calculator.live provides 
                  tools for educational and informational purposes only and should not be used as the sole basis for financial, 
                  medical, or legal decisions.
                </p>

                <h3 className="text-xl font-semibold mb-3">10. Contact Information</h3>
                <p className="mb-4">
                  If you have any questions about these Terms and Conditions, please contact us at support@onlinecalculator.live
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white text-gray-800 rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Privacy Policy</h2>
                <button
                  onClick={() => setShowPrivacy(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="prose prose-gray max-w-none">
                <p className="text-sm text-gray-600 mb-4">Last updated: August 2025</p>
                
                <h3 className="text-xl font-semibold mb-3">1. Information We Collect</h3>
                <p className="mb-4">
                  We collect information you provide directly to us, such as when you use our calculators, contact us, or 
                  subscribe to our services. This may include usage data, device information, and any information you choose to provide.
                </p>

                <h3 className="text-xl font-semibold mb-3">2. How We Use Your Information</h3>
                <p className="mb-4">
                  We use the information we collect to provide, maintain, and improve our services, develop new features, 
                  and protect against fraud and abuse.
                </p>

                <h3 className="text-xl font-semibold mb-3">3. Information Sharing</h3>
                <p className="mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
                  except as described in this policy or as required by law.
                </p>

                <h3 className="text-xl font-semibold mb-3">4. Data Security</h3>
                <p className="mb-4">
                  We implement appropriate security measures to protect your personal information against unauthorized access, 
                  alteration, disclosure, or destruction.
                </p>

                <h3 className="text-xl font-semibold mb-3">5. Cookies and Tracking</h3>
                <p className="mb-4">
                  We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide 
                  personalized content. You can control cookie settings through your browser preferences.
                </p>

                <h3 className="text-xl font-semibold mb-3">6. Third-Party Services</h3>
                <p className="mb-4">
                  We may use third-party services for analytics, advertising, and other purposes. These services have their 
                  own privacy policies and data handling practices.
                </p>

                <h3 className="text-xl font-semibold mb-3">7. Your Rights</h3>
                <p className="mb-4">
                  You have the right to access, correct, or delete your personal information. You may also have the right 
                  to restrict or object to certain processing of your information.
                </p>

                <h3 className="text-xl font-semibold mb-3">8. Children's Privacy</h3>
                <p className="mb-4">
                  Our services are not intended for children under 13. We do not knowingly collect personal information 
                  from children under 13.
                </p>

                <h3 className="text-xl font-semibold mb-3">9. International Transfers</h3>
                <p className="mb-4">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate 
                  safeguards are in place for such transfers.
                </p>

                <h3 className="text-xl font-semibold mb-3">10. Changes to This Policy</h3>
                <p className="mb-4">
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the 
                  new policy on this page and updating the "Last updated" date.
                </p>

                <h3 className="text-xl font-semibold mb-3">11. Contact Us</h3>
                <p className="mb-4">
                  If you have any questions about this Privacy Policy, please contact us at support@onlinecalculator.live
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}
