'use client'

import React, { useRef, useState } from 'react'
import { 
  Share2, 
  MessageCircle, 
  Download, 
  FileText, 
  Copy, 
  Check,
  Printer
} from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface ResultSharingProps {
  title: string
  inputs: { label: string; value: string | number }[]
  result: { label: string; value: string | number; unit?: string }
  calculatorName: string
  className?: string
}

export default function ResultSharing({ 
  title, 
  inputs, 
  result, 
  calculatorName,
  className = '' 
}: ResultSharingProps) {
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)
  
  const websiteUrl = 'https://www.onlinecalculator.live'
  
  const handleCopyToClipboard = async () => {
    const resultText = generateResultText()
    try {
      await navigator.clipboard.writeText(resultText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  const generateResultText = () => {
    const inputText = inputs.map(input => `${input.label}: ${input.value}`).join('\n')
    const resultText = `${result.label}: ${result.value}${result.unit ? ` ${result.unit}` : ''}`
    return `${title}\n\nInputs:\n${inputText}\n\nResult:\n${resultText}\n\nCalculated using ${calculatorName} at ${websiteUrl}`
  }

  const handleWhatsAppShare = () => {
    const text = generateResultText()
    const encodedText = encodeURIComponent(text)
    const whatsappUrl = `https://wa.me/?text=${encodedText}`
    window.open(whatsappUrl, '_blank')
  }

  const generateImage = async () => {
    if (!resultRef.current) {
      console.error('Result ref not found')
      return
    }
    
    setIsGenerating(true)
    try {
      console.log('Generating image with data:', { title, inputs, result, calculatorName })
      
      // Wait a bit for DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        width: 600,
        height: 800,
        scrollX: 0,
        scrollY: 0
      })
      
      const link = document.createElement('a')
      link.download = `${calculatorName}-result.png`
      link.href = canvas.toDataURL('image/png', 1.0)
      link.click()
      
      console.log('Image generated successfully')
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generatePDF = async () => {
    if (!resultRef.current) {
      console.error('Result ref not found')
      return
    }
    
    setIsGenerating(true)
    try {
      console.log('Generating PDF with data:', { title, inputs, result, calculatorName })
      
      // Create PDF with text content
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      // Set font styles
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(24)
      
      // Add title
      pdf.text(title, 105, 30, { align: 'center' })
      
      // Add subtitle
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'normal')
      pdf.text('Calculator Result', 105, 45, { align: 'center' })
      
      // Add inputs section
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Input Values:', 20, 70)
      
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(12)
      let yPosition = 85
      
      inputs.forEach((input, index) => {
        if (yPosition > 250) {
          // Add new page if running out of space
          pdf.addPage()
          yPosition = 30
        }
        
        const label = `${input.label}:`
        const value = `${input.value}`
        
        pdf.text(label, 20, yPosition)
        pdf.text(value, 120, yPosition)
        yPosition += 8
      })
      
      // Add result section
      yPosition += 10
      if (yPosition > 250) {
        pdf.addPage()
        yPosition = 30
      }
      
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(14)
      pdf.text('Calculation Result:', 20, yPosition)
      
      yPosition += 15
      if (yPosition > 250) {
        pdf.addPage()
        yPosition = 30
      }
      
      pdf.setFontSize(18)
      pdf.text(result.label, 105, yPosition, { align: 'center' })
      
      yPosition += 15
      if (yPosition > 250) {
        pdf.addPage()
        yPosition = 30
      }
      
      pdf.setFontSize(24)
      const resultText = `${result.value}${result.unit ? ` ${result.unit}` : ''}`
      pdf.text(resultText, 105, yPosition, { align: 'center' })
      
      // Add footer with website info
      yPosition += 25
      if (yPosition > 250) {
        pdf.addPage()
        yPosition = 30
      }
      
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Calculated using ${calculatorName}`, 105, yPosition, { align: 'center' })
      
      yPosition += 10
      if (yPosition > 250) {
        pdf.addPage()
        yPosition = 30
      }
      
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(14)
      pdf.text('Visit Our Website:', 105, yPosition, { align: 'center' })
      
      yPosition += 10
      if (yPosition > 250) {
        pdf.addPage()
        yPosition = 30
      }
      
      pdf.setFontSize(16)
      pdf.setTextColor(220, 38, 38) // Red color for URL
      pdf.text(websiteUrl, 105, yPosition, { align: 'center' })
      
      // Reset text color
      pdf.setTextColor(0, 0, 0)
      
      yPosition += 15
      if (yPosition > 250) {
        pdf.addPage()
        yPosition = 30
      }
      
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.text('Online Calculator.live - Free Online Calculators', 105, yPosition, { align: 'center' })
      
      // Save the PDF
      pdf.save(`${calculatorName}-result.pdf`)
      console.log('PDF generated successfully with text content')
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePrint = () => {
    if (!resultRef.current) {
      console.error('Result ref not found')
      return
    }
    
    try {
      console.log('Printing with data:', { title, inputs, result, calculatorName })
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        console.error('Could not open print window')
        return
      }
      
      // Get the HTML content
      const content = resultRef.current.innerHTML
      
      // Create the print document
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title} - Print</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              color: #000; 
              background: #fff;
            }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .header p { font-size: 16px; color: #666; }
            .section { margin-bottom: 25px; }
            .section h2 { font-size: 20px; font-weight: 600; border-bottom: 2px solid #ccc; padding-bottom: 8px; margin-bottom: 15px; }
            .input-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .input-label { font-weight: 500; }
            .input-value { font-weight: 600; }
            .result-box { background: #f0f8ff; padding: 20px; border: 2px solid #b3d9ff; border-radius: 8px; text-align: center; margin: 20px 0; }
            .result-label { font-size: 22px; font-weight: bold; color: #1e40af; margin-bottom: 10px; }
            .result-value { font-size: 32px; font-weight: bold; color: #1e3a8a; }
            .result-unit { font-size: 22px; color: #2563eb; margin-left: 8px; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #ccc; }
            .website-box { background: #fef3c7; padding: 15px; border: 2px solid #f59e0b; border-radius: 8px; margin: 20px 0; }
            .website-title { font-size: 18px; font-weight: bold; color: #92400e; margin-bottom: 8px; }
            .website-url { font-size: 22px; font-weight: bold; color: #dc2626; }
            .brand { font-size: 14px; font-weight: 600; color: #059669; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            <p>Calculator Result</p>
          </div>
          
          <div class="section">
            <h2>Input Values</h2>
            ${inputs.map(input => `
              <div class="input-row">
                <span class="input-label">${input.label}:</span>
                <span class="input-value">${input.value}</span>
              </div>
            `).join('')}
          </div>
          
          <div class="section">
            <h2>Calculation Result</h2>
            <div class="result-box">
              <div class="result-label">${result.label}</div>
              <div class="result-value">
                ${result.value}
                ${result.unit ? `<span class="result-unit">${result.unit}</span>` : ''}
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p>Calculated using ${calculatorName}</p>
            <div class="website-box">
              <div class="website-title">Visit Our Website</div>
              <div class="website-url">${websiteUrl}</div>
            </div>
            <p class="brand">Online Calculator.live - Free Online Calculators</p>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
        </html>
      `)
      
      printWindow.document.close()
      
      console.log('Print window opened successfully')
    } catch (error) {
      console.error('Error opening print window:', error)
    }
  }

  return (
    <div className={`${className}`}>
      {/* Share Options Header */}
      <div className="mb-3">
        <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center">
          <Share2 className="w-4 h-4 mr-2 text-blue-600" />
          Share Result
        </h3>
      </div>

      {/* Share Options - Always Visible */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {/* WhatsApp Share */}
            <button
              onClick={handleWhatsAppShare}
              className="flex flex-col items-center p-2 bg-green-50 hover:bg-green-100 rounded-md border border-green-200 transition-colors duration-200 text-center"
            >
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-1">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div className="font-medium text-green-800 text-xs">WhatsApp</div>
            </button>

            {/* Download as Image */}
            <button
              onClick={generateImage}
              disabled={isGenerating}
              className="flex flex-col items-center p-2 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors duration-200 text-center disabled:opacity-50"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mb-1">
                <Download className="w-4 h-4 text-white" />
              </div>
              <div className="font-medium text-blue-800 text-xs">Image</div>
            </button>

            {/* Download as PDF */}
            <button
              onClick={generatePDF}
              disabled={isGenerating}
              className="flex flex-col items-center p-2 bg-red-50 hover:bg-red-100 rounded-md border border-red-200 transition-colors duration-200 text-center disabled:opacity-50"
              title="Download PDF with calculation results as text (searchable and copyable)"
            >
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mb-1">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div className="font-medium text-red-800 text-xs">PDF</div>
            </button>

            {/* Copy to Clipboard */}
            <button
              onClick={handleCopyToClipboard}
              className="flex flex-col items-center p-2 bg-purple-50 hover:bg-purple-100 rounded-md border border-purple-200 transition-colors duration-200 text-center"
            >
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mb-1">
                {copied ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <Copy className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="font-medium text-purple-800 text-xs">
                {copied ? 'Copied!' : 'Copy'}
              </div>
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="flex flex-col items-center p-2 bg-orange-50 hover:bg-orange-100 rounded-md border border-orange-200 transition-colors duration-200 text-center"
            >
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mb-1">
                <Printer className="w-4 h-4 text-white" />
              </div>
              <div className="font-medium text-orange-800 text-xs">Print</div>
            </button>
            </div>

            {/* Debug Button - Temporary for testing */}
            <button
              onClick={() => {
                if (resultRef.current) {
                  resultRef.current.style.position = 'relative'
                  resultRef.current.style.left = '0'
                  resultRef.current.style.top = '0'
                  resultRef.current.style.zIndex = '1000'
                  resultRef.current.style.backgroundColor = '#fff'
                  resultRef.current.style.border = '2px solid red'
                  resultRef.current.style.boxShadow = '0 0 20px rgba(0,0,0,0.3)'
                  resultRef.current.style.visibility = 'visible'
                  resultRef.current.style.pointerEvents = 'auto'
                }
                console.log('Debug - Current data:', { title, inputs, result, calculatorName })
              }}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Show Hidden Result (Debug)
            </button>

      {/* Hidden Result Display for Image/PDF Generation */}
      <div 
        ref={resultRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '600px',
          minHeight: '800px',
          padding: '40px',
          backgroundColor: '#ffffff',
          fontFamily: 'Arial, sans-serif',
          color: '#000000',
          fontSize: '14px',
          lineHeight: '1.5',
          visibility: 'hidden',
          pointerEvents: 'none',
          zIndex: '-1'
        }}
      >
        {/* Debug Info - This will help verify data is being passed correctly */}
        <div style={{ fontSize: '10px', color: '#666', marginBottom: '10px' }}>
          Debug: Title={title || 'NO TITLE'}, Calculator={calculatorName || 'NO CALCULATOR'}
        </div>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>{title}</h1>
          <p style={{ fontSize: '18px', color: '#4B5563' }}>Calculator Result</p>
        </div>

        {/* Inputs */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1F2937', marginBottom: '16px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
            Input Values
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {inputs && inputs.length > 0 ? (
              inputs.map((input, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ fontWeight: '500', color: '#374151' }}>{input.label || 'No Label'}:</span>
                  <span style={{ color: '#111827', fontWeight: '600' }}>{input.value || 'No Value'}</span>
                </div>
              ))
            ) : (
              <div style={{ padding: '16px', textAlign: 'center', color: '#EF4444', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px' }}>
                No input values provided
              </div>
            )}
          </div>
        </div>

        {/* Result */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1F2937', marginBottom: '16px', borderBottom: '2px solid #E5E7EB', paddingBottom: '8px' }}>
            Calculation Result
          </h2>
          {result && result.label && result.value ? (
            <div style={{ backgroundColor: '#EFF6FF', padding: '24px', borderRadius: '8px', border: '2px solid #BFDBFE' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1E40AF', marginBottom: '8px' }}>
                  {result.label}
                </div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1E3A8A' }}>
                  {result.value}
                  {result.unit && (
                    <span style={{ fontSize: '24px', color: '#2563EB', marginLeft: '8px' }}>{result.unit}</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '24px', textAlign: 'center', color: '#EF4444', backgroundColor: '#FEF2F2', border: '2px solid #FECACA', borderRadius: '8px' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>No Result Data</div>
              <div style={{ fontSize: '16px' }}>
                Result label: {result?.label || 'Missing'}<br/>
                Result value: {result?.value || 'Missing'}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Website URL - More Prominent */}
        <div style={{ textAlign: 'center', paddingTop: '24px', borderTop: '2px solid #E5E7EB', marginTop: '32px' }}>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px' }}>
            Calculated using {calculatorName}
          </p>
          <div style={{ backgroundColor: '#FEF3C7', padding: '16px', borderRadius: '8px', border: '2px solid #F59E0B', marginBottom: '16px' }}>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#92400E', marginBottom: '8px' }}>
              Visit Our Website
            </p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#DC2626' }}>
              {websiteUrl}
            </p>
          </div>
          <p style={{ fontSize: '16px', fontWeight: '600', color: '#059669' }}>
            Online Calculator.live - Free Online Calculators
          </p>
        </div>
      </div>
    </div>
  )
}
