'use client'

import React, { useRef, useState } from 'react'
import { X, Share2, MessageCircle, Image, FileText, Printer, Copy, Check } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  calculation: {
    expression: string
    result: string
    timestamp: Date
  }
}

export default function ShareModal({ isOpen, onClose, calculation }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [generatingImage, setGeneratingImage] = useState(false)
  const [generatingPDF, setGeneratingPDF] = useState(false)
  const shareRef = useRef<HTMLDivElement>(null)

  if (!isOpen) return null

  const websiteUrl = 'https://scientific-calculator.com'
  const shareText = `🔢 Scientific Calculator Result:\n\n${calculation.expression} = ${calculation.result}\n\nTry it yourself at: ${websiteUrl}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const shareWhatsApp = () => {
    const encodedText = encodeURIComponent(shareText)
    const whatsappUrl = `https://wa.me/?text=${encodedText}`
    window.open(whatsappUrl, '_blank')
  }

  const generateImage = async () => {
    if (!shareRef.current) return
    
    setGeneratingImage(true)
    try {
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        width: 600,
        height: 400
      })
      
      const link = document.createElement('a')
      link.download = `calculator-result-${Date.now()}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setGeneratingImage(false)
    }
  }

  const generatePDF = async () => {
    if (!shareRef.current) return
    
    setGeneratingPDF(true)
    try {
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        width: 600,
        height: 400
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`calculator-result-${Date.now()}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setGeneratingPDF(false)
    }
  }

  const printResult = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Calculator Result</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 20px; 
                text-align: center;
              }
              .result { 
                font-size: 24px; 
                margin: 20px 0; 
                font-weight: bold;
              }
              .website-link { 
                color: #000000 !important; 
                font-weight: bold; 
                text-decoration: none;
                font-size: 16px;
              }
              @media print {
                .website-link { color: #000000 !important; }
              }
            </style>
          </head>
          <body>
            <h1>Scientific Calculator Result</h1>
            <div class="result">${calculation.expression} = ${calculation.result}</div>
            <p>Calculated on: ${calculation.timestamp.toLocaleString()}</p>
            <p><a href="${websiteUrl}" class="website-link">${websiteUrl}</a></p>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <Share2 className="w-5 h-5 mr-2 text-blue-600" />
            Share Result
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Share Content Preview */}
        <div className="p-6">
          <div 
            ref={shareRef}
            className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 text-center border-2 border-blue-200"
          >
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              🔢 Scientific Calculator Result
            </h4>
            <div className="text-2xl font-bold text-gray-800 mb-4">
              {calculation.expression} = {calculation.result}
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Calculated on: {calculation.timestamp.toLocaleString()}
            </div>
            <div className="text-base font-bold text-black">
              Try it yourself at: {websiteUrl}
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="p-6 space-y-3">
          <button
            onClick={shareWhatsApp}
            className="w-full flex items-center justify-center gap-3 p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Share on WhatsApp
          </button>

          <button
            onClick={generateImage}
            disabled={generatingImage}
            className="w-full flex items-center justify-center gap-3 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <Image className="w-5 h-5" />
            {generatingImage ? 'Generating...' : 'Download as Image'}
          </button>

          <button
            onClick={generatePDF}
            disabled={generatingPDF}
            className="w-full flex items-center justify-center gap-3 p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <FileText className="w-5 h-5" />
            {generatingPDF ? 'Generating...' : 'Download as PDF'}
          </button>

          <button
            onClick={printResult}
            className="w-full flex items-center justify-center gap-3 p-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <Printer className="w-5 h-5" />
            Print Result
          </button>

          <button
            onClick={copyToClipboard}
            className="w-full flex items-center justify-center gap-3 p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy to Clipboard
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Share your calculations with friends and colleagues!
          </p>
        </div>
      </div>
    </div>
  )
}
