import { Metadata } from 'next'
import BandwidthCalculator from '../components/calculators/BandwidthCalculator';

export const metadata: Metadata = {
  title: 'Bandwidth Calculator - Calculate Data Transfer Speed | Online Calculator.live',
  description: 'Free online bandwidth calculator. Calculate data transfer speeds, download times, and bandwidth requirements. Perfect for network planning, streaming, and internet usage analysis.',
  keywords: ['bandwidth calculator', 'data transfer calculator', 'download speed calculator', 'internet speed calculator', 'network bandwidth', 'streaming calculator'],
  openGraph: {
    title: 'Bandwidth Calculator - Calculate Data Transfer Speed | Online Calculator.live',
    description: 'Free online bandwidth calculator. Calculate data transfer speeds, download times, and bandwidth requirements. Perfect for network planning, streaming, and internet usage analysis.',
    url: 'https://onlinecalculator.live/bandwidth-calculator',
    siteName: 'Online Calculator.live',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bandwidth Calculator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bandwidth Calculator - Calculate Data Transfer Speed | Online Calculator.live',
    description: 'Free online bandwidth calculator. Calculate data transfer speeds, download times, and bandwidth requirements. Perfect for network planning, streaming, and internet usage analysis.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://onlinecalculator.live/bandwidth-calculator',
  },
}

export default function BandwidthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bandwidth Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Calculate data transfer speeds, download times, and bandwidth requirements
          </p>
        </div>
        <BandwidthCalculator />
        
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            About Bandwidth
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="mb-4">
              Bandwidth refers to the maximum rate of data transfer across a network connection. 
              It's typically measured in bits per second (bps) and determines how quickly you can 
              download files, stream content, or transfer data.
            </p>
            <h3 className="text-xl font-semibold mb-2">Common Bandwidth Units:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>bps:</strong> Bits per second - basic unit of bandwidth</li>
              <li><strong>Kbps:</strong> Kilobits per second (1,000 bps)</li>
              <li><strong>Mbps:</strong> Megabits per second (1,000,000 bps)</li>
              <li><strong>Gbps:</strong> Gigabits per second (1,000,000,000 bps)</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">Bandwidth Requirements:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Web Browsing:</strong> 1-5 Mbps</li>
              <li><strong>HD Video Streaming:</strong> 5-25 Mbps</li>
              <li><strong>4K Video Streaming:</strong> 25+ Mbps</li>
              <li><strong>Online Gaming:</strong> 3-25 Mbps</li>
              <li><strong>Video Calls:</strong> 1-10 Mbps</li>
              <li><strong>Large File Downloads:</strong> 50+ Mbps recommended</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">Factors Affecting Speed:</h3>
            <ul className="list-disc pl-6">
              <li>Internet service provider (ISP) plan</li>
              <li>Network congestion and peak usage times</li>
              <li>Device capabilities and network adapter</li>
              <li>Wi-Fi vs. wired connection</li>
              <li>Distance from router or network equipment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
