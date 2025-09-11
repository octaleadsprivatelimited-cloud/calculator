import { Metadata } from 'next'
import QuotationGenerator from '../components/calculators/QuotationGenerator'
import CalculatorWithAds from '../components/CalculatorWithAds'

export const metadata: Metadata = {
  title: 'Free Quotation Generator - Create Professional Quotes Online | Online Calculator.live',
  description: 'Free online quotation generator to create professional business quotes. Generate custom quotations with templates, calculate totals, add taxes, and download PDF quotes. Perfect for freelancers, contractors, and businesses.',
  keywords: [
    'quotation generator',
    'quote generator',
    'business quotation',
    'professional quotes',
    'invoice generator',
    'free quotation maker',
    'quote template',
    'business quotes',
    'quotation software',
    'estimate generator',
    'proposal generator',
    'freelance quotes',
    'contractor quotes',
    'service quotes',
    'quotation templates'
  ],
  openGraph: {
    title: 'Free Quotation Generator - Create Professional Quotes Online | Online Calculator.live',
    description: 'Free online quotation generator to create professional business quotes. Generate custom quotations with templates, calculate totals, add taxes, and download PDF quotes.',
    url: 'https://onlinecalculator.live/quotation-generator',
    siteName: 'Online Calculator.live',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Quotation Generator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Quotation Generator - Create Professional Quotes Online | Online Calculator.live',
    description: 'Free online quotation generator to create professional business quotes. Generate custom quotations with templates, calculate totals, add taxes, and download PDF quotes.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://onlinecalculator.live/quotation-generator',
  },
}

export default function QuotationGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <CalculatorWithAds>
        <QuotationGenerator />
        
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            About Quotation Generator
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-4">
              Our professional quotation generator helps you create stunning business quotes in minutes. 
              Perfect for freelancers, contractors, consultants, and businesses of all sizes.
            </p>
            
            <h3 className="text-xl font-semibold mb-2">Key Features:</h3>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li><strong>Professional Templates:</strong> Choose from modern, classic, elegant, and creative designs</li>
              <li><strong>Custom Branding:</strong> Add your company logo, colors, and branding elements</li>
              <li><strong>Item Management:</strong> Add unlimited line items with descriptions, quantities, and pricing</li>
              <li><strong>Automatic Calculations:</strong> Real-time totals, tax calculations, and discount applications</li>
              <li><strong>Client Management:</strong> Store and manage client information for quick quote generation</li>
              <li><strong>PDF Export:</strong> Download professional PDF quotes ready for client delivery</li>
              <li><strong>Email Integration:</strong> Send quotes directly to clients via email</li>
              <li><strong>Mobile Responsive:</strong> Create and manage quotes on any device</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">Perfect For:</h3>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Freelancers and independent contractors</li>
              <li>Consulting firms and agencies</li>
              <li>Construction and renovation companies</li>
              <li>IT services and software development</li>
              <li>Marketing and design agencies</li>
              <li>Professional services providers</li>
              <li>Small to medium-sized businesses</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">Benefits:</h3>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li><strong>Time Saving:</strong> Generate professional quotes in minutes instead of hours</li>
              <li><strong>Professional Appearance:</strong> Impress clients with polished, branded quotations</li>
              <li><strong>Accuracy:</strong> Automatic calculations reduce errors and disputes</li>
              <li><strong>Consistency:</strong> Maintain consistent branding and formatting across all quotes</li>
              <li><strong>Organization:</strong> Keep track of all your quotations and client communications</li>
              <li><strong>Cost Effective:</strong> Free to use with no hidden fees or subscriptions</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">How to Use:</h3>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Fill in your company information and branding details</li>
              <li>Enter client information for the quotation</li>
              <li>Add items, descriptions, quantities, and pricing</li>
              <li>Set tax rates and any applicable discounts</li>
              <li>Customize the template and add notes or terms</li>
              <li>Preview your quotation and make final adjustments</li>
              <li>Download as PDF, print, or email to your client</li>
            </ol>

            <h3 className="text-xl font-semibold mb-2">Tips for Better Quotes:</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use clear, detailed descriptions for all services or products</li>
              <li>Include realistic timelines and delivery expectations</li>
              <li>Set competitive but profitable pricing</li>
              <li>Add terms and conditions to protect your business</li>
              <li>Follow up on quotes within 24-48 hours</li>
              <li>Keep quotes organized and easily accessible</li>
            </ul>
          </div>
        </div>
      </CalculatorWithAds>
    </div>
  );
}
