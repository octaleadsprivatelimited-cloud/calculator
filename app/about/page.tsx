import type { Metadata } from 'next'
import { Calculator, Shield, Target, Users, CheckCircle2, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us - Online Calculator.live',
  description: 'Learn about Online Calculator.live, our mission to provide free, accurate, and easy-to-use calculation tools for everyone.',
  keywords: ['about online calculator', 'calculator mission', 'accurate tools', 'free calculators'],
}

export default function AboutPage() {
  const features = [
    {
      title: 'Accurate & Reliable',
      description: 'Our tools are built using industry-standard formulas and rigorously tested for precision.',
      icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
    },
    {
      title: '100% Free',
      description: 'Access over 200+ calculators without any subscription, registration, or hidden fees.',
      icon: <Target className="w-6 h-6 text-blue-500" />,
    },
    {
      title: 'Privacy Focused',
      description: 'We value your privacy. Most calculations are performed locally in your browser.',
      icon: <Shield className="w-6 h-6 text-purple-500" />,
    },
    {
      title: 'User Centric',
      description: 'Clean, intuitive interfaces designed for speed and ease of use on all devices.',
      icon: <Users className="w-6 h-6 text-orange-500" />,
    },
  ]

  return (
    <div className="min-h-screen bg-google-bg py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-google mb-6">
            <Calculator className="w-8 h-8 text-google-blue" />
          </div>
          <h1 className="text-4xl font-bold text-google-text mb-4">About Online Calculator.live</h1>
          <p className="text-xl text-google-gray max-w-2xl mx-auto">
            Empowering millions with fast, accurate, and free calculation tools for every aspect of life.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-3xl shadow-google p-8 lg:p-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-google-text mb-6">Our Mission</h2>
              <p className="text-google-gray leading-relaxed mb-6">
                At Online Calculator.live, we believe that everyone should have access to high-quality mathematical and financial tools without barriers. Whether you're a student solving complex equations, a homeowner calculating a mortgage, or a health enthusiast tracking metrics, our goal is to provide you with the most reliable tools available.
              </p>
              <p className="text-google-gray leading-relaxed">
                Founded by the Octaleads Team, our platform has grown from a simple scientific calculator to a comprehensive suite of over 200 specialized tools, serving users globally with accuracy and speed.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="p-6 bg-google-lightGray rounded-2xl border border-google-border">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="font-bold text-google-text mb-2">{feature.title}</h3>
                  <p className="text-xs text-google-gray">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-google-text mb-12">Why Choose Our Tools?</h2>
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-google-border flex items-start space-x-6">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-google-blue" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-google-text mb-2">Global Accessibility</h3>
                <p className="text-google-gray">
                  Our platform is optimized for every device and connection speed. From the latest desktop computers to budget smartphones in areas with limited connectivity, Online Calculator.live works seamlessly everywhere.
                </p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-google-border flex items-start space-x-6">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-google-text mb-2">Expertly Crafted Formulas</h3>
                <p className="text-google-gray">
                  We don't just provide calculators; we provide knowledge. Every tool is backed by standard mathematical principles and financial regulations, ensuring that you can trust the numbers you see.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-google-blue rounded-3xl p-12 text-center text-white shadow-google">
          <h2 className="text-3xl font-bold mb-6">Have Questions or Suggestions?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            We're constantly improving and adding new calculators. If you have a specific tool you'd like to see or need help with an existing one, we'd love to hear from you.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center px-8 py-4 bg-white text-google-blue font-bold rounded-full hover:bg-blue-50 transition-colors shadow-lg"
          >
            Contact Our Team
          </a>
        </div>
      </div>
    </div>
  )
}
