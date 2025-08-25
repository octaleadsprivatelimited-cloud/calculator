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
              <li><Link href="/calculators" className="text-gray-300 hover:text-white transition-colors">All Calculators</Link></li>
              <li><Link href="/calculation-history" className="text-gray-300 hover:text-white transition-colors">History</Link></li>
              <li><Link href="/compare-calculators" className="text-gray-300 hover:text-white transition-colors">Compare</Link></li>
            </ul>
          </div>

          {/* Calculator Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><Link href="/calculators/finance" className="text-gray-300 hover:text-white transition-colors">Finance</Link></li>
              <li><Link href="/calculators/math" className="text-gray-300 hover:text-white transition-colors">Math</Link></li>
              <li><Link href="/calculators/health" className="text-gray-300 hover:text-white transition-colors">Health</Link></li>
              <li><Link href="/calculators/construction" className="text-gray-300 hover:text-white transition-colors">Construction</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact & Legal */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>support@onlinecalculator.live</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Online Services</span>
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
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Online Calculator.live. All rights reserved. | 
            <span className="ml-2">Last updated: August 2025</span>
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
