import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Online Calculator.live',
  description: 'Read our comprehensive privacy policy to understand how Online Calculator.live collects, uses, and protects your personal information.',
  keywords: ['privacy policy', 'data protection', 'GDPR', 'CCPA', 'online calculator.live'],
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: August 2025</p>
          
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              We collect information you provide directly to us, such as when you use our calculators, contact us, or 
              subscribe to our services. This may include:
            </p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>Usage data and analytics information</li>
              <li>Device information and browser details</li>
              <li>IP address and location data</li>
              <li>Any information you choose to provide through contact forms</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Develop new features and functionality</li>
              <li>Analyze usage patterns and optimize performance</li>
              <li>Protect against fraud and abuse</li>
              <li>Communicate with you about our services</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Information Sharing</h2>
            <p className="mb-6">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
              except as described in this policy or as required by law. We may share information with:
            </p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>Service providers who assist in operating our website</li>
              <li>Analytics and advertising partners (with appropriate safeguards)</li>
              <li>Law enforcement when required by law</li>
              <li>Other parties with your explicit consent</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Data Security</h2>
            <p className="mb-6">
              We implement appropriate security measures to protect your personal information against unauthorized access, 
              alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication measures</li>
              <li>Employee training on data protection</li>
              <li>Incident response procedures</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Cookies and Tracking</h2>
            <p className="mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>Enhance your user experience</li>
              <li>Analyze usage patterns and trends</li>
              <li>Provide personalized content and advertisements</li>
              <li>Remember your preferences and settings</li>
              <li>Ensure proper functionality of our services</li>
            </ul>
            <p className="mb-6">
              You can control cookie settings through your browser preferences. However, disabling cookies may affect 
              the functionality of our website.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Third-Party Services</h2>
            <p className="mb-6">
              We may use third-party services for analytics, advertising, and other purposes. These services have their 
              own privacy policies and data handling practices. We encourage you to review their policies to understand 
              how they collect and use your information.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Your Rights</h2>
            <p className="mb-4">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Restriction:</strong> Request restriction of processing</li>
              <li><strong>Portability:</strong> Request transfer of your data</li>
              <li><strong>Objection:</strong> Object to certain processing activities</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Children's Privacy</h2>
            <p className="mb-6">
              Our services are not intended for children under 13. We do not knowingly collect personal information 
              from children under 13. If you are a parent or guardian and believe your child has provided us with 
              personal information, please contact us immediately.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. International Transfers</h2>
            <p className="mb-6">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate 
              safeguards are in place for such transfers, including:
            </p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>Standard contractual clauses</li>
              <li>Adequacy decisions by relevant authorities</li>
              <li>Other appropriate safeguards as required by law</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Data Retention</h2>
            <p className="mb-6">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this 
              policy, unless a longer retention period is required or permitted by law. We regularly review and delete 
              data that is no longer needed.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Changes to This Policy</h2>
            <p className="mb-6">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the 
              new policy on this page and updating the "Last updated" date. We encourage you to review this policy 
              periodically to stay informed about how we protect your information.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Legal Basis for Processing</h2>
            <p className="mb-6">
              We process your personal information based on the following legal grounds:
            </p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li><strong>Consent:</strong> When you explicitly agree to processing</li>
              <li><strong>Contract:</strong> To provide our services to you</li>
              <li><strong>Legitimate Interest:</strong> To improve our services and prevent fraud</li>
              <li><strong>Legal Obligation:</strong> To comply with applicable laws</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">13. Contact Us</h2>
            <p className="mb-6">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
              <p className="font-semibold">Email:</p>
              <p>support@onlinecalculator.live</p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mt-8">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Compliance Notice</h3>
              <p className="text-blue-700 text-sm">
                This privacy policy is designed to comply with current data protection laws including GDPR, CCPA, and other 
                applicable regulations as of August 2025. We are committed to protecting your privacy and maintaining 
                transparency about our data practices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
