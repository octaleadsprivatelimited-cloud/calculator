import { Metadata } from 'next'
import { Shield, Lock, Eye, Server, Key, Database, Network, AlertTriangle, Download, Trash2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Data Protection - Online Calculator.live',
  description: 'Learn how Online Calculator.live protects your data with advanced security measures and privacy safeguards.',
  keywords: ['data protection', 'data security', 'privacy safeguards', 'online calculator security', 'data encryption'],
}

export default function DataProtectionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-6">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Data Protection</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Online Calculator.live implements comprehensive data protection measures to ensure your information 
            is secure, private, and protected at all times.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Overview */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-green-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Shield className="w-6 h-6 text-green-600 mr-3" />
              Our Commitment to Data Protection
            </h2>
            <p className="text-gray-700 mb-4">
              We understand that data protection is not just a legal requirement but a fundamental responsibility 
              to our users. We have implemented a multi-layered approach to data security that encompasses 
              technical, organizational, and procedural safeguards.
            </p>
            <p className="text-gray-700">
              Our data protection framework is designed to protect against unauthorized access, data breaches, 
              and ensure the confidentiality, integrity, and availability of your information.
            </p>
          </div>

          {/* Security Measures */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Technical Security Measures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Key className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Encryption</h3>
                  <p className="text-gray-600 text-sm">
                    All data in transit is encrypted using TLS 1.3, and sensitive data at rest is encrypted 
                    using industry-standard AES-256 encryption.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Server className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Secure Infrastructure</h3>
                  <p className="text-gray-600 text-sm">
                    Our servers are hosted in secure, SOC 2 Type II compliant data centers with 24/7 
                    physical security and environmental controls.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Network className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Network Security</h3>
                  <p className="text-gray-600 text-sm">
                    We use firewalls, intrusion detection systems, and DDoS protection to safeguard 
                    our network infrastructure from external threats.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Database className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Database Security</h3>
                  <p className="text-gray-600 text-sm">
                    Our databases are protected with role-based access controls, regular security updates, 
                    and automated backup systems.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Collection */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">What Data We Collect and Why</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Essential Service Data</h3>
                  <p className="text-gray-600">
                    <strong>What:</strong> Calculator inputs, calculation results<br/>
                    <strong>Why:</strong> To provide accurate calculation services<br/>
                    <strong>Storage:</strong> Not stored - processed in real-time only
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Analytics Data</h3>
                  <p className="text-gray-600">
                    <strong>What:</strong> Website usage, performance metrics<br/>
                    <strong>Why:</strong> To improve user experience and service quality<br/>
                    <strong>Storage:</strong> Aggregated and anonymized data only
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Contact Information</h3>
                  <p className="text-gray-600">
                    <strong>What:</strong> Email addresses, support requests<br/>
                    <strong>Why:</strong> To respond to user inquiries and provide support<br/>
                    <strong>Storage:</strong> Until request resolution, then deleted
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Minimization */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Data Minimization Principles</h2>
            <div className="space-y-4">
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <h3 className="font-semibold text-gray-800 mb-2">Purpose Limitation</h3>
                <p className="text-gray-600 text-sm">
                  We only collect data that is necessary for specific, legitimate purposes. We do not collect 
                  data for future, unspecified uses.
                </p>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <h3 className="font-semibold text-gray-800 mb-2">Storage Limitation</h3>
                <p className="text-gray-600 text-sm">
                  Personal data is retained only for as long as necessary to fulfill the purposes for which 
                  it was collected, or as required by law.
                </p>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <h3 className="font-semibold text-gray-800 mb-2">Access Limitation</h3>
                <p className="text-gray-600 text-sm">
                  Access to personal data is restricted to authorized personnel only, and is limited to 
                  what is necessary for their job functions.
                </p>
              </div>
            </div>
          </div>

          {/* Third-Party Services */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-red-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Third-Party Service Providers</h2>
            <p className="text-gray-700 mb-6">
              We use a limited number of trusted third-party services to help operate our website. 
              All providers are carefully selected and bound by strict data protection agreements:
            </p>
            <div className="space-y-4">
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h3 className="font-semibold text-gray-800 mb-2">Hosting Services</h3>
                <p className="text-gray-600 text-sm">
                  <strong>Provider:</strong> Vercel (Next.js hosting)<br/>
                  <strong>Purpose:</strong> Website hosting and performance optimization<br/>
                  <strong>Data Shared:</strong> Website usage data (anonymized)<br/>
                  <strong>Compliance:</strong> SOC 2 Type II, GDPR, CCPA compliant
                </p>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h3 className="font-semibold text-gray-800 mb-2">Analytics Services</h3>
                <p className="text-gray-600 text-sm">
                  <strong>Provider:</strong> Google Analytics<br/>
                  <strong>Purpose:</strong> Website performance and user experience analysis<br/>
                  <strong>Data Shared:</strong> Aggregated, anonymized usage statistics<br/>
                  <strong>Compliance:</strong> GDPR compliant with data processing agreements
                </p>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h3 className="font-semibold text-gray-800 mb-2">Email Services</h3>
                <p className="text-gray-600 text-sm">
                  <strong>Provider:</strong> Email service provider<br/>
                  <strong>Purpose:</strong> Support communication and notifications<br/>
                  <strong>Data Shared:</strong> Email addresses and message content<br/>
                  <strong>Compliance:</strong> Encrypted transmission, secure storage
                </p>
              </div>
            </div>
          </div>

          {/* Incident Response */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-yellow-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Data Breach Response</h2>
            <div className="space-y-4">
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <h3 className="font-semibold text-gray-800 mb-2">Detection and Assessment</h3>
                <p className="text-gray-600 text-sm">
                  We have automated monitoring systems to detect potential security incidents. 
                  All incidents are immediately assessed for severity and potential impact.
                </p>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <h3 className="font-semibold text-gray-800 mb-2">Notification Procedures</h3>
                <p className="text-gray-600 text-sm">
                  In the event of a data breach that poses a risk to user privacy, we will notify 
                  affected users within 72 hours, as required by GDPR and other applicable regulations.
                </p>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <h3 className="font-semibold text-gray-800 mb-2">Recovery and Prevention</h3>
                <p className="text-gray-600 text-sm">
                  We have incident response procedures to contain, eradicate, and recover from security 
                  incidents, followed by post-incident analysis to prevent future occurrences.
                </p>
              </div>
            </div>
          </div>

          {/* User Rights */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-green-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Data Protection Rights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Eye className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Right to Information</h3>
                  <p className="text-gray-600 text-sm">
                    You have the right to know what personal data we process about you and how we use it.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Download className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Right to Access</h3>
                  <p className="text-gray-600 text-sm">
                    You can request a copy of your personal data in a structured, machine-readable format.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Trash2 className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Right to Erasure</h3>
                  <p className="text-gray-600 text-sm">
                    You can request deletion of your personal data when it's no longer necessary.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Lock className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Right to Restrict</h3>
                  <p className="text-gray-600 text-sm">
                    You can request that we limit how we process your personal data in certain circumstances.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Our Data Protection Team</h2>
            <p className="text-gray-700 mb-6">
              If you have questions about our data protection practices or want to exercise your data rights, 
              please contact our dedicated data protection team:
            </p>
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-gray-800">Data Protection Officer</h3>
              </div>
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> privacy@onlinecalculator.live
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Subject Line:</strong> "Data Protection Inquiry - [Your Name]"
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Response Time:</strong> Within 48 hours for general inquiries
              </p>
              <p className="text-gray-700">
                <strong>Emergency:</strong> For urgent security concerns, include "URGENT" in the subject line
              </p>
            </div>
          </div>

          {/* Updates */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Continuous Improvement</h2>
            <p className="text-gray-700 mb-4">
              We continuously review and enhance our data protection measures to address emerging threats 
              and maintain compliance with evolving regulations. Our security team regularly conducts 
              assessments and updates our protection strategies.
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
