import { Metadata } from 'next'
import { Shield, Users, Lock, Eye, Download, Trash2, AlertTriangle, Building2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'CCPA Compliance - Online Calculator.live',
  description: 'Learn how Online Calculator.live complies with CCPA regulations and protects your California privacy rights.',
  keywords: ['CCPA compliance', 'California privacy', 'data protection', 'privacy rights', 'online calculator privacy'],
}

export default function CCPACompliancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-600 rounded-full mb-6">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">CCPA Compliance</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Online Calculator.live is fully compliant with the California Consumer Privacy Act (CCPA) 
            to ensure your privacy rights are protected.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* What is CCPA */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 text-orange-600 mr-3" />
              What is CCPA?
            </h2>
            <p className="text-gray-700 mb-4">
              The California Consumer Privacy Act (CCPA) is a comprehensive privacy law that gives California residents 
              control over their personal information. It went into effect on January 1, 2020, and provides California 
              consumers with specific rights regarding their personal data.
            </p>
            <p className="text-gray-700">
              Even though Online Calculator.live serves users worldwide, we voluntarily comply with CCPA standards 
              to ensure the highest level of data protection for all our users, including California residents.
            </p>
          </div>

          {/* Your Rights */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-green-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your CCPA Rights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Eye className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Right to Know</h3>
                  <p className="text-gray-600 text-sm">
                    You have the right to know what personal information we collect, use, disclose, and sell about you.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Download className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Right to Access</h3>
                  <p className="text-gray-600 text-sm">
                    You can request a copy of the specific pieces of personal information we have collected about you.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Trash2 className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Right to Delete</h3>
                  <p className="text-gray-600 text-sm">
                    You can request that we delete your personal information, with certain exceptions.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Lock className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Right to Opt-Out</h3>
                  <p className="text-gray-600 text-sm">
                    You have the right to opt-out of the sale of your personal information to third parties.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How We Comply */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">How We Comply with CCPA</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">No Sale of Personal Information</h3>
                  <p className="text-gray-600">
                    We do not sell, rent, or trade your personal information to third parties. Your data is used 
                    solely to provide our calculator services and improve user experience.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Transparent Data Practices</h3>
                  <p className="text-gray-600">
                    We clearly disclose what personal information we collect, how we use it, and who we share it with 
                    in our privacy policy and this compliance page.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Easy Exercise of Rights</h3>
                  <p className="text-gray-600">
                    We provide simple and accessible methods for California residents to exercise their CCPA rights, 
                    including dedicated contact information and clear request processes.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Non-Discrimination</h3>
                  <p className="text-gray-600">
                    We will not discriminate against you for exercising your CCPA rights. You will receive the same 
                    level of service regardless of whether you choose to exercise your privacy rights.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Categories */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Categories of Personal Information We Collect</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-gray-800 mb-2">Identifiers</h3>
                <p className="text-gray-600 text-sm">
                  IP addresses, device identifiers, and browser information (collected automatically for security and analytics)
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-gray-800 mb-2">Internet Activity</h3>
                <p className="text-gray-600 text-sm">
                  Website usage data, pages visited, time spent on site, and interaction with calculators
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-gray-800 mb-2">Geolocation Data</h3>
                <p className="text-gray-600 text-sm">
                  General location information (city/country level) for analytics and service optimization
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-gray-800 mb-2">Professional Information</h3>
                <p className="text-gray-600 text-sm">
                  Information provided voluntarily through contact forms or support requests
                </p>
              </div>
            </div>
          </div>

          {/* Data Sharing */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-red-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">How We Share Your Information</h2>
            <div className="space-y-4">
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h3 className="font-semibold text-gray-800 mb-2">Service Providers</h3>
                <p className="text-gray-600 text-sm">
                  We may share information with trusted service providers who help us operate our website, 
                  such as hosting providers and analytics services. These providers are bound by strict 
                  confidentiality agreements.
                </p>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h3 className="font-semibold text-gray-800 mb-2">Legal Requirements</h3>
                <p className="text-gray-600 text-sm">
                  We may disclose information when required by law, such as in response to a subpoena, 
                  court order, or other legal process.
                </p>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h3 className="font-semibold text-gray-800 mb-2">Business Transfers</h3>
                <p className="text-gray-600 text-sm">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred 
                  as part of the business transaction, subject to the same privacy protections.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-green-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Exercise Your CCPA Rights</h2>
            <p className="text-gray-700 mb-6">
              California residents can exercise their CCPA rights by contacting us through any of the following methods:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                  <h3 className="font-semibold text-gray-800">Privacy Team</h3>
                </div>
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> privacy@onlinecalculator.live
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Subject Line:</strong> "CCPA Request - [Your Name]"
                </p>
                <p className="text-gray-700 text-sm">
                  Include your full name, email address, and specific request (access, deletion, etc.)
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                  <h3 className="font-semibold text-gray-800">Response Timeline</h3>
                </div>
                <p className="text-gray-700 mb-2">
                  <strong>Initial Response:</strong> Within 10 business days
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Complete Response:</strong> Within 45 calendar days
                </p>
                <p className="text-gray-700 text-sm">
                  We may extend this timeline by an additional 45 days if necessary, with written notice.
                </p>
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-yellow-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Identity Verification</h2>
            <p className="text-gray-700 mb-4">
              To protect your privacy and security, we may need to verify your identity before processing certain CCPA requests. 
              This may include:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Confirming your email address</li>
              <li>Requesting additional identifying information</li>
              <li>Using third-party identity verification services</li>
              <li>Requiring notarized documentation for sensitive requests</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We will only request the minimum information necessary to verify your identity and will not use 
              this information for any other purpose.
            </p>
          </div>

          {/* Updates */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Updates to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We regularly review and update our CCPA compliance practices. Any significant changes will be 
              communicated to users through our website or email notifications at least 30 days before the changes take effect.
            </p>
            <p className="text-gray-600 text-sm">
              <strong>Last updated:</strong> August 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
