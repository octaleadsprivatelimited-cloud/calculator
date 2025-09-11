import { Metadata } from 'next'
import InvoiceMaker from '../components/calculators/InvoiceMaker';

export const metadata: Metadata = {
  title: 'Free Online Invoice Maker - Create Professional Invoices | Online Calculator.live',
  description: 'Create professional invoices online with our free invoice maker. Upload custom logo, add line items, calculate totals, and generate PDF invoices instantly.',
  keywords: ['invoice maker', 'online invoice generator', 'free invoice creator', 'professional invoices', 'PDF invoice', 'custom logo invoice'],
  openGraph: {
    title: 'Free Online Invoice Maker - Create Professional Invoices | Online Calculator.live',
    description: 'Create professional invoices online with our free invoice maker. Upload custom logo, add line items, calculate totals, and generate PDF invoices instantly.',
    url: 'https://onlinecalculator.live/invoice-maker',
    siteName: 'Online Calculator.live',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Invoice Maker',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Invoice Maker - Create Professional Invoices | Online Calculator.live',
    description: 'Create professional invoices online with our free invoice maker. Upload custom logo, add line items, calculate totals, and generate PDF invoices instantly.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://onlinecalculator.live/invoice-maker',
  },
}

export default function InvoiceMakerPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <InvoiceMaker />
      </div>
    </div>
  );
}
