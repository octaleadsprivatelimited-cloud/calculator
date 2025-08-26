import { Metadata } from 'next'
import { Shield, Users, Lock, Eye, Download, Trash2, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'GDPR Compliance - Online Calculator.live',
  description: 'Learn how Online Calculator.live complies with GDPR regulations and protects your data privacy rights.',
  keywords: ['GDPR compliance', 'data protection', 'privacy rights', 'EU data regulations', 'online calculator privacy'],
}

export default function GDPRCompliancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">GDPR Compliance</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Online Calculator.live is fully compliant with the General Data Protection Regulation (GDPR) 
            to ensure your data privacy and protection.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* What is GDPR */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 text-blue-600 mr-3" />
              What is GDPR?
            </h2>
            <p className="text-gray-700 mb-4">
              The General Data Protection Regulation (GDPR) is a comprehensive data protection law that came into effect 
              on May 25, 2018, across the European Union. It gives EU citizens greater control over their personal data 
              and requires organizations to be more transparent about how they collect, use, and protect personal information.
            </p>
            <p className="text-gray-700">
              Even though Online Calculator.live is based outside the EU, we voluntarily comply with GDPR standards 
              to ensure the highest level of data protection for all our users worldwide.
            </p>
          </div>

          {/* Your Rights */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-green-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your GDPR Rights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Eye className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Right to Access</h3>
                  <p className="text-gray-600 text-sm">
                    You can request a copy of all personal data we hold about you and information about how we process it.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Download className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Right to Portability</h3>
                  <p className="text-gray-600 text-sm">
                    You can request your data in a structured, machine-readable format for transfer to another service.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Trash2 className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Right to Erasure</h3>
                  <p className="text-gray-600 text-sm">
                    You can request deletion of your personal data when it's no longer necessary for the purpose it was collected.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Lock className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Right to Restrict Processing</h3>
                  <p className="text-gray-600 text-sm">
                    You can request that we limit how we use your personal data in certain circumstances.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How We Comply */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">How We Comply with GDPR</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Lawful Basis for Processing</h3>
                  <p className="text-gray-600">
                    We only process personal data when we have a legitimate interest, such as providing calculator services, 
                    or when you give explicit consent. We never sell your personal data to third parties.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Data Minimization</h3>
                  <p className="text-gray-600">
                    We collect only the minimum amount of personal data necessary to provide our services. 
                    Most of our calculators work without requiring any personal information.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Transparency</h3>
                  <p className="text-gray-600">
                    We provide clear information about what data we collect, how we use it, and your rights. 
                    Our privacy policy is written in plain language and easily accessible.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Security Measures</h3>
                  <p className="text-gray-600">
                    We implement appropriate technical and organizational measures to protect your personal data 
                    against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Processing */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Data Processing Information</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Data Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Purpose</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Retention Period</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Legal Basis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-3 px-4 text-gray-700">Usage Analytics</td>
                    <td className="py-3 px-4 text-gray-700">Improve website performance and user experience</td>
                    <td className="py-3 px-4 text-gray-700">26 months</td>
                    <td className="py-3 px-4 text-gray-700">Legitimate interest</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-700">Calculator Inputs</td>
                    <td className="py-3 px-4 text-gray-700">Provide calculation results</td>
                    <td className="py-3 px-4 text-gray-700">Not stored</td>
                    <td className="py-3 px-4 text-gray-700">Contract performance</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-700">Contact Information</td>
                    <td className="py-3 px-4 text-gray-700">Respond to support requests</td>
                    <td className="py-3 px-4 text-gray-700">Until request resolved</td>
                    <td className="py-3 px-4 text-gray-700">Legitimate interest</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Exercise Your GDPR Rights</h2>
            <p className="text-gray-700 mb-6">
              To exercise any of your GDPR rights or if you have questions about our data processing practices, 
              please contact our Data Protection Officer:
            </p>
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-gray-800">Data Protection Officer</h3>
              </div>
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> privacy@onlinecalculator.live
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Response Time:</strong> We will respond to your request within 30 days
              </p>
              <p className="text-gray-700">
                <strong>Identification:</strong> We may need to verify your identity before processing certain requests
              </p>
            </div>
          </div>

          {/* Updates */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Updates to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We regularly review and update our GDPR compliance practices. Any significant changes will be 
              communicated to users through our website or email notifications.
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
