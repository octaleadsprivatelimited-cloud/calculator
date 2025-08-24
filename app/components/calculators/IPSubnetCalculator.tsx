'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Network, Cpu, Globe } from 'lucide-react'

interface SubnetResult {
  networkAddress: string
  broadcastAddress: string
  firstHost: string
  lastHost: string
  subnetMask: string
  wildcardMask: string
  totalHosts: number
  usableHosts: number
  networkBits: number
  hostBits: number
}

interface NetworkClass {
  name: string
  range: string
  defaultMask: string
  description: string
}

const NETWORK_CLASSES: NetworkClass[] = [
  { name: 'Class A', range: '1.0.0.0 - 126.255.255.255', defaultMask: '255.0.0.0', description: 'Large networks' },
  { name: 'Class B', range: '128.0.0.0 - 191.255.255.255', defaultMask: '255.255.0.0', description: 'Medium networks' },
  { name: 'Class C', range: '192.0.0.0 - 223.255.255.255', defaultMask: '255.255.255.0', description: 'Small networks' },
  { name: 'Class D', range: '224.0.0.0 - 239.255.255.255', defaultMask: 'N/A', description: 'Multicast' },
  { name: 'Class E', range: '240.0.0.0 - 255.255.255.255', defaultMask: 'N/A', description: 'Experimental' }
]

const COMMON_SUBNETS = [
  { name: '/24', mask: '255.255.255.0', hosts: 256, usable: 254, description: 'Small network' },
  { name: '/25', mask: '255.255.255.128', hosts: 128, usable: 126, description: 'Medium network' },
  { name: '/26', mask: '255.255.255.192', hosts: 64, usable: 62, description: 'Small network' },
  { name: '/27', mask: '255.255.255.224', hosts: 32, usable: 30, description: 'Small network' },
  { name: '/28', mask: '255.255.255.240', hosts: 16, usable: 14, description: 'Very small network' },
  { name: '/29', mask: '255.255.255.248', hosts: 8, usable: 6, description: 'Tiny network' },
  { name: '/30', mask: '255.255.255.252', hosts: 4, usable: 2, description: 'Point-to-point' }
]

export default function IPSubnetCalculator() {
  const [ipAddress, setIpAddress] = useState('')
  const [subnetMask, setSubnetMask] = useState('')
  const [cidr, setCidr] = useState('')
  const [showResults, setShowResults] = useState(false)

  const ipToBinary = (ip: string): number[] => {
    return ip.split('.').map(octet => parseInt(octet))
  }

  const binaryToIp = (binary: number[]): string => {
    return binary.join('.')
  }

  const calculateSubnet = useCallback((): SubnetResult => {
    if (!ipAddress || (!subnetMask && !cidr)) return {
      networkAddress: '',
      broadcastAddress: '',
      firstHost: '',
      lastHost: '',
      subnetMask: '',
      wildcardMask: '',
      totalHosts: 0,
      usableHosts: 0,
      networkBits: 0,
      hostBits: 0
    }

    let mask: number[]
    let cidrValue: number

    if (cidr) {
      cidrValue = parseInt(cidr)
      mask = []
      for (let i = 0; i < 4; i++) {
        if (cidrValue >= 8) {
          mask.push(255)
          cidrValue -= 8
        } else if (cidrValue > 0) {
          mask.push(256 - Math.pow(2, 8 - cidrValue))
          cidrValue = 0
        } else {
          mask.push(0)
        }
      }
    } else {
      mask = ipToBinary(subnetMask)
      cidrValue = mask.reduce((count, octet) => {
        return count + octet.toString(2).split('1').length - 1
      }, 0)
    }

    const ip = ipToBinary(ipAddress)
    
    // Calculate network address
    const networkAddress = ip.map((octet, i) => octet & mask[i])
    
    // Calculate broadcast address
    const wildcardMask = mask.map(octet => 255 - octet)
    const broadcastAddress = networkAddress.map((octet, i) => octet | wildcardMask[i])
    
    // Calculate first and last host
    const firstHost = [...networkAddress]
    firstHost[3] += 1
    
    const lastHost = [...broadcastAddress]
    lastHost[3] -= 1
    
    // Calculate total hosts
    const hostBits = 32 - cidrValue
    const totalHosts = Math.pow(2, hostBits)
    const usableHosts = totalHosts - 2

    return {
      networkAddress: binaryToIp(networkAddress),
      broadcastAddress: binaryToIp(broadcastAddress),
      firstHost: binaryToIp(firstHost),
      lastHost: binaryToIp(lastHost),
      subnetMask: binaryToIp(mask),
      wildcardMask: binaryToIp(wildcardMask),
      totalHosts,
      usableHosts,
      networkBits: cidrValue,
      hostBits
    }
  }, [ipAddress, subnetMask, cidr])

  const handleCalculate = () => {
    if (ipAddress && (subnetMask || cidr)) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setIpAddress('')
    setSubnetMask('')
    setCidr('')
    setShowResults(false)
  }

  const handleQuickSubnet = (subnet: { name: string, mask: string }) => {
    setSubnetMask(subnet.mask)
    setCidr('')
  }

  const handleQuickClass = (networkClass: NetworkClass) => {
    if (networkClass.defaultMask !== 'N/A') {
      setSubnetMask(networkClass.defaultMask)
      setCidr('')
    }
  }

  const validateIP = (ip: string): boolean => {
    const parts = ip.split('.')
    if (parts.length !== 4) return false
    
    return parts.every(part => {
      const num = parseInt(part)
      return num >= 0 && num <= 255
    })
  }

  const formatNumber = (num: number) => {
    if (isNaN(num) || !isFinite(num)) return '0'
    return num.toLocaleString()
  }

  const downloadResults = () => {
    const result = calculateSubnet()
    
    const data = `IP Subnet Calculator Results

Input:
- IP Address: ${ipAddress}
- Subnet Mask: ${result.subnetMask}
- CIDR: /${result.networkBits}

Network Information:
- Network Address: ${result.networkAddress}
- Broadcast Address: ${result.broadcastAddress}
- First Host: ${result.firstHost}
- Last Host: ${result.lastHost}
- Wildcard Mask: ${result.wildcardMask}

Host Information:
- Total Hosts: ${formatNumber(result.totalHosts)}
- Usable Hosts: ${formatNumber(result.usableHosts)}
- Network Bits: ${result.networkBits}
- Host Bits: ${result.hostBits}

Network Class: ${NETWORK_CLASSES.find(c => {
  const firstOctet = parseInt(ipAddress.split('.')[0])
  return (firstOctet >= 1 && firstOctet <= 126) ? 'Class A' :
         (firstOctet >= 128 && firstOctet <= 191) ? 'Class B' :
         (firstOctet >= 192 && firstOctet <= 223) ? 'Class C' :
         (firstOctet >= 224 && firstOctet <= 239) ? 'Class D' : 'Class E'
})?.name}`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ip-subnet-calculator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = calculateSubnet()
      
      navigator.share({
        title: 'IP Subnet Calculator Results',
        text: `Network: ${result.networkAddress}/${result.networkBits}, Hosts: ${formatNumber(result.usableHosts)}`,
        url: window.location.href
      })
    } else {
      const result = calculateSubnet()
      const text = `Network: ${result.networkAddress}/${result.networkBits}`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? calculateSubnet() : { networkAddress: '', broadcastAddress: '', firstHost: '', lastHost: '', subnetMask: '', wildcardMask: '', totalHosts: 0, usableHosts: 0, networkBits: 0, hostBits: 0 }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">IP Subnet Calculator</h1>
            <p className="text-blue-100 text-lg">
              Calculate subnet information, network ranges, and host addresses. 
              Essential tool for network administrators and IT professionals.
            </p>
          </div>
          <div className="hidden md:block">
            <Network className="w-16 h-16 text-blue-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Quick Subnet Masks */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Common Subnet Masks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMMON_SUBNETS.map((subnet, index) => (
              <button
                key={index}
                onClick={() => handleQuickSubnet(subnet)}
                className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors text-left"
              >
                <div className="font-semibold text-blue-800">{subnet.name}</div>
                <div className="text-sm text-blue-600">{subnet.mask}</div>
                <div className="text-xs text-blue-500">{subnet.usable} usable hosts</div>
                <div className="text-xs text-blue-400 mt-1">{subnet.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Network Classes */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Network Classes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {NETWORK_CLASSES.map((networkClass, index) => (
              <button
                key={index}
                onClick={() => handleQuickClass(networkClass)}
                className="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors text-left"
              >
                <div className="font-semibold text-indigo-800">{networkClass.name}</div>
                <div className="text-sm text-indigo-600">{networkClass.range}</div>
                <div className="text-xs text-indigo-500">{networkClass.description}</div>
                {networkClass.defaultMask !== 'N/A' && (
                  <div className="text-xs text-indigo-400 mt-1">Default: {networkClass.defaultMask}</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* IP Address */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Network Configuration</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IP Address
              </label>
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                placeholder="192.168.1.1"
                aria-label="IP address"
              />
              <p className="text-xs text-gray-500 mt-1">Enter IP address (e.g., 192.168.1.1)</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subnet Mask
              </label>
              <input
                type="text"
                value={subnetMask}
                onChange={(e) => {
                  setSubnetMask(e.target.value)
                  setCidr('')
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                placeholder="255.255.255.0"
                aria-label="Subnet mask"
              />
              <p className="text-xs text-gray-500 mt-1">Enter subnet mask (e.g., 255.255.255.0)</p>
            </div>
          </div>

          {/* CIDR Notation */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">CIDR Notation</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CIDR Prefix
              </label>
              <input
                type="text"
                value={cidr}
                onChange={(e) => {
                  setCidr(e.target.value)
                  setSubnetMask('')
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                placeholder="/24"
                aria-label="CIDR prefix"
              />
              <p className="text-xs text-gray-500 mt-1">Enter CIDR prefix (e.g., /24)</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Input Summary</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <div>IP Address: {ipAddress || 'Not specified'}</div>
                <div>Subnet Mask: {subnetMask || 'Not specified'}</div>
                <div>CIDR: {cidr || 'Not specified'}</div>
                <div>Valid IP: {ipAddress ? (validateIP(ipAddress) ? 'Yes' : 'No') : 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        {ipAddress && (subnetMask || cidr) && validateIP(ipAddress) && (
          <div className="text-center mb-8">
            <button
              onClick={handleCalculate}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>Calculate Subnet Information</span>
            </button>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Network Information */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Network Information</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-700 font-mono">{result.networkAddress}</div>
                  <div className="text-sm text-gray-600">Network Address</div>
                  <div className="text-xs text-blue-600">First address</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-700 font-mono">{result.broadcastAddress}</div>
                  <div className="text-sm text-gray-600">Broadcast Address</div>
                  <div className="text-xs text-green-600">Last address</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-700 font-mono">{result.firstHost}</div>
                  <div className="text-sm text-gray-600">First Host</div>
                  <div className="text-xs text-purple-600">Usable range start</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-700 font-mono">{result.lastHost}</div>
                  <div className="text-sm text-gray-600">Last Host</div>
                  <div className="text-xs text-orange-600">Usable range end</div>
                </div>
              </div>
            </div>

            {/* Subnet Details */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Subnet Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Mask Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subnet Mask:</span>
                      <span className="font-semibold text-blue-700 font-mono">{result.subnetMask}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Wildcard Mask:</span>
                      <span className="font-semibold text-green-700 font-mono">{result.wildcardMask}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">CIDR Notation:</span>
                      <span className="font-semibold text-purple-700">/{result.networkBits}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Host Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Hosts:</span>
                      <span className="font-semibold text-blue-700">{formatNumber(result.totalHosts)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Usable Hosts:</span>
                      <span className="font-semibold text-green-700">{formatNumber(result.usableHosts)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Network Bits:</span>
                      <span className="font-semibold text-purple-700">{result.networkBits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Host Bits:</span>
                      <span className="font-semibold text-orange-700">{result.hostBits}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={downloadResults}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={shareResults}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button
                onClick={printResults}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">About IP Subnet Calculator</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                This IP subnet calculator provides comprehensive network information including network addresses, 
                broadcast addresses, host ranges, and subnet masks. It supports both traditional subnet mask 
                notation and modern CIDR prefix notation. Essential for network administrators, IT professionals, 
                and anyone working with IP addressing and subnetting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
