'use client'

import React, { useState, useRef, useCallback } from 'react'
import {
  Upload, Plus, Trash2, Download, Eye, FileText, Building2, User,
  Calculator, Calendar, DollarSign, Check, Star, Layout, Save
} from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface LineItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

interface CompanyInfo {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
  website: string
}

interface ClientInfo {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
}

interface InvoiceTemplate {
  id: string
  name: string
  category: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
}

interface InvoiceData {
  template: string
  invoiceNumber: string
  date: string
  dueDate: string
  currency: string
  company: CompanyInfo
  client: ClientInfo
  lineItems: LineItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  discountRate: number
  discountAmount: number
  total: number
  notes: string
  terms: string
  logo: string | null
  paymentTerms: string
}

// Enhanced Invoice Templates with proper designs
const invoiceTemplates: InvoiceTemplate[] = [
  { id: 'modern-1', name: 'Modern Blue', category: 'Modern', colors: { primary: '#3B82F6', secondary: '#1E40AF', accent: '#60A5FA', background: '#FFFFFF' }},
  { id: 'modern-2', name: 'Modern Green', category: 'Modern', colors: { primary: '#10B981', secondary: '#047857', accent: '#34D399', background: '#FFFFFF' }},
  { id: 'modern-3', name: 'Modern Purple', category: 'Modern', colors: { primary: '#8B5CF6', secondary: '#7C3AED', accent: '#A78BFA', background: '#FFFFFF' }},
  { id: 'classic-1', name: 'Classic Black', category: 'Classic', colors: { primary: '#000000', secondary: '#374151', accent: '#6B7280', background: '#FFFFFF' }},
  { id: 'classic-2', name: 'Classic Navy', category: 'Classic', colors: { primary: '#1E3A8A', secondary: '#1E40AF', accent: '#3B82F6', background: '#FFFFFF' }},
  { id: 'minimal-1', name: 'Minimal White', category: 'Minimal', colors: { primary: '#000000', secondary: '#6B7280', accent: '#9CA3AF', background: '#FFFFFF' }},
]

export default function InvoiceMaker() {
  const [activeTab, setActiveTab] = useState<'templates' | 'details' | 'preview'>('templates')
  const [selectedTemplate, setSelectedTemplate] = useState('modern-1')
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    template: 'modern-1',
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: 'USD',
    company: {
      name: 'Your Company', address: '123 Business St', city: 'New York', state: 'NY', zipCode: '10001', phone: '+1 (555) 123-4567', email: 'info@company.com', website: 'www.company.com'
    },
    client: {
      name: 'Client Name', address: '456 Client Ave', city: 'Los Angeles', state: 'CA', zipCode: '90210', phone: '+1 (555) 987-6543', email: 'client@email.com'
    },
    lineItems: [
      { id: '1', description: 'Web Development', quantity: 1, rate: 2500, amount: 2500 },
      { id: '2', description: 'Design Services', quantity: 1, rate: 800, amount: 800 }
    ],
    subtotal: 3300, taxRate: 8, taxAmount: 264, discountRate: 0, discountAmount: 0, total: 3564,
    notes: 'Thank you for your business!', terms: 'Payment is due within 30 days of invoice date.', logo: null, paymentTerms: 'Net 30'
  })

  const invoiceRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
  ]

  const getCurrencySymbol = (code: string) => {
    return currencies.find(c => c.code === code)?.symbol || '$'
  }

  const calculateTotals = useCallback(() => {
    const subtotal = invoiceData.lineItems.reduce((sum, item) => sum + item.amount, 0)
    const discountAmount = (subtotal * invoiceData.discountRate) / 100
    const taxableAmount = subtotal - discountAmount
    const taxAmount = (taxableAmount * invoiceData.taxRate) / 100
    const total = taxableAmount + taxAmount

    setInvoiceData(prev => ({
      ...prev,
      subtotal,
      discountAmount,
      taxAmount,
      total
    }))
  }, [invoiceData.lineItems, invoiceData.taxRate, invoiceData.discountRate])

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    }
    setInvoiceData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem]
    }))
  }

  const removeLineItem = (id: string) => {
    setInvoiceData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id)
    }))
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setInvoiceData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          if (field === 'quantity' || field === 'rate') {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate
          }
          return updatedItem
        }
        return item
      })
    }))
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setInvoiceData(prev => ({
          ...prev,
          logo: e.target?.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const downloadPDF = async () => {
    if (invoiceRef.current) {
      try {
        const canvas = await html2canvas(invoiceRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true
        })

        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF()
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

        pdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`)
      } catch (error) {
        console.error('Error generating PDF:', error)
      }
    }
  }

  const currentTemplate = invoiceTemplates.find(t => t.id === selectedTemplate) || invoiceTemplates[0]

  const handleSave = useCallback(() => {
    console.log('Saving invoice data:', invoiceData)
  }, [invoiceData])

  const handleDownload = useCallback(() => {
    console.log('Downloading invoice...')
  }, [])

  // Template Preview Component
  const TemplatePreview = ({ template }: { template: InvoiceTemplate }) => (
    <div className="w-full h-48 p-3 bg-gray-50 rounded-lg overflow-hidden">
      <div 
        className="w-full h-full rounded-lg shadow-sm relative overflow-hidden"
        style={{ backgroundColor: template.colors.background }}
      >
        {/* Header */}
        <div 
          className="h-8 rounded-t-lg flex items-center px-3"
          style={{ backgroundColor: template.colors.primary }}
        >
          <div className="w-3 h-3 bg-white rounded-full opacity-80"></div>
          <div className="w-2 h-2 bg-white rounded-full opacity-60 ml-2"></div>
          <div className="w-2 h-2 bg-white rounded-full opacity-60 ml-1"></div>
        </div>
        
        {/* Invoice Header */}
        <div className="px-3 py-2">
          <div 
            className="h-4 rounded mb-1"
            style={{ backgroundColor: template.colors.secondary, width: '60%' }}
          ></div>
          <div 
            className="h-2 rounded mb-2"
            style={{ backgroundColor: template.colors.accent, width: '40%' }}
          ></div>
        </div>

        {/* Company Info */}
        <div className="px-3 pb-2">
          <div 
            className="h-2 rounded mb-1"
            style={{ backgroundColor: template.colors.accent, width: '80%' }}
          ></div>
          <div 
            className="h-2 rounded mb-1"
            style={{ backgroundColor: template.colors.accent, width: '70%' }}
          ></div>
          <div 
            className="h-2 rounded mb-2"
            style={{ backgroundColor: template.colors.accent, width: '60%' }}
          ></div>
        </div>

        {/* Table */}
        <div className="px-3 pb-2">
          <div 
            className="h-3 rounded mb-1"
            style={{ backgroundColor: template.colors.primary }}
          ></div>
          <div className="space-y-1">
            <div 
              className="h-1.5 rounded"
              style={{ backgroundColor: template.colors.accent, width: '90%' }}
            ></div>
            <div 
              className="h-1.5 rounded"
              style={{ backgroundColor: template.colors.accent, width: '85%' }}
            ></div>
            <div 
              className="h-1.5 rounded"
              style={{ backgroundColor: template.colors.accent, width: '80%' }}
            ></div>
          </div>
        </div>

        {/* Footer */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-6 rounded-b-lg flex items-center justify-between px-3"
          style={{ backgroundColor: template.colors.secondary }}
        >
          <div 
            className="h-2 rounded"
            style={{ backgroundColor: template.colors.accent, width: '30%' }}
          ></div>
          <div 
            className="h-2 rounded"
            style={{ backgroundColor: template.colors.accent, width: '25%' }}
          ></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full p-4 lg:p-6 max-w-7xl mx-auto">
        {/* Enhanced Navigation Tabs */}
        <div className="w-full bg-white/90 backdrop-blur-sm border-b border-gray-200/50 rounded-xl mb-6 shadow-lg">
          <div className="flex space-x-1 p-2">
            {[
              { id: 'templates', label: 'Templates', icon: Layout, color: 'from-blue-500 to-blue-600' },
              { id: 'details', label: 'Invoice Details', icon: FileText, color: 'from-green-500 to-green-600' },
              { id: 'preview', label: 'Preview', icon: Eye, color: 'from-purple-500 to-purple-600' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'templates' | 'details' | 'preview')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 relative ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Section */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Layout className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
                Choose Your Perfect Template
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Select from our collection of professionally designed invoice templates with realistic previews.
              </p>
            </div>

            {/* Template Categories */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {['All', 'Modern', 'Classic', 'Minimal'].map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full font-medium hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-200/50 hover:border-blue-300 flex items-center space-x-2 text-sm"
                >
                  <span>{category}</span>
                  <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {category === 'All' ? '6' : category === 'Modern' ? '3' : '1'}
                  </span>
                </button>
              ))}
            </div>

            {/* Enhanced Template Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {invoiceTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`group bg-white rounded-2xl border-2 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 cursor-pointer relative overflow-hidden shadow-lg hover:shadow-2xl ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 shadow-2xl shadow-blue-500/25 ring-4 ring-blue-500/20'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => {
                    setSelectedTemplate(template.id)
                    setInvoiceData(prev => ({ ...prev, template: template.id }))
                    setTimeout(() => {
                      setActiveTab('details')
                      const notification = document.createElement('div')
                      notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center z-50'
                      notification.innerHTML = '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>Template selected! Moving to details...'
                      document.body.appendChild(notification)
                      setTimeout(() => notification.remove(), 3000)
                    }, 300)
                  }}
                >
                  {/* Template Preview */}
                  <TemplatePreview template={template} />

                  {/* Template Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-blue-600 transition-colors duration-200">
                      {template.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span 
                        className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: template.colors.primary }}
                      >
                        {template.category}
                      </span>
                      {selectedTemplate === template.id && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Invoice Details Section */}
        {activeTab === 'details' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Company Information */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-2">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  Your Company
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={invoiceData.company.name}
                    onChange={(e) => setInvoiceData(prev => ({
                      ...prev,
                      company: { ...prev.company, name: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={invoiceData.company.address}
                    onChange={(e) => setInvoiceData(prev => ({
                      ...prev,
                      company: { ...prev.company, address: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      value={invoiceData.company.city}
                      onChange={(e) => setInvoiceData(prev => ({
                        ...prev,
                        company: { ...prev.company, city: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={invoiceData.company.state}
                      onChange={(e) => setInvoiceData(prev => ({
                        ...prev,
                        company: { ...prev.company, state: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={invoiceData.company.email}
                    onChange={(e) => setInvoiceData(prev => ({
                      ...prev,
                      company: { ...prev.company, email: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={invoiceData.company.phone}
                    onChange={(e) => setInvoiceData(prev => ({
                      ...prev,
                      company: { ...prev.company, phone: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                  />
                </div>
              </div>

              {/* Client Information */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-2">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  Bill To
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Client Name"
                    value={invoiceData.client.name}
                    onChange={(e) => setInvoiceData(prev => ({
                      ...prev,
                      client: { ...prev.client, name: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={invoiceData.client.address}
                    onChange={(e) => setInvoiceData(prev => ({
                      ...prev,
                      client: { ...prev.client, address: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      value={invoiceData.client.city}
                      onChange={(e) => setInvoiceData(prev => ({
                        ...prev,
                        client: { ...prev.client, city: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={invoiceData.client.state}
                      onChange={(e) => setInvoiceData(prev => ({
                        ...prev,
                        client: { ...prev.client, state: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={invoiceData.client.email}
                    onChange={(e) => setInvoiceData(prev => ({
                      ...prev,
                      client: { ...prev.client, email: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={invoiceData.client.phone}
                    onChange={(e) => setInvoiceData(prev => ({
                      ...prev,
                      client: { ...prev.client, phone: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Invoice Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-2">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                Invoice Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Invoice Number</label>
                  <input
                    type="text"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={invoiceData.date}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Currency</label>
                  <select
                    value={invoiceData.currency}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                  >
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-2">
                    <Calculator className="w-5 h-5 text-white" />
                  </div>
                  Line Items
                </h3>
                <button
                  onClick={addLineItem}
                  className="px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center space-x-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="space-y-3">
                {invoiceData.lineItems.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                        placeholder="Item description"
                        className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={item.amount}
                        readOnly
                        className="w-full px-2 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm"
                      />
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => removeLineItem(item.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={invoiceData.lineItems.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-4 border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={invoiceData.taxRate}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Discount Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={invoiceData.discountRate}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, discountRate: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={calculateTotals}
                      className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
                    >
                      <Calculator className="w-4 h-4" />
                      <span>Calculate</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{getCurrencySymbol(invoiceData.currency)}{invoiceData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>-{getCurrencySymbol(invoiceData.currency)}{invoiceData.discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>{getCurrencySymbol(invoiceData.currency)}{invoiceData.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t pt-1">
                    <span>Total:</span>
                    <span>{getCurrencySymbol(invoiceData.currency)}{invoiceData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Section */}
        {activeTab === 'preview' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Invoice Preview</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('details')}
                  className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                >
                  Edit Details
                </button>
                <button
                  onClick={downloadPDF}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>

            {/* Invoice Preview */}
            <div className="bg-white rounded-lg shadow-lg p-4" ref={invoiceRef}>
              <div 
                className="max-w-4xl mx-auto"
                style={{ 
                  backgroundColor: currentTemplate.colors.background,
                  color: currentTemplate.colors.primary 
                }}
              >
                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    {invoiceData.logo && (
                      <img src={invoiceData.logo} alt="Company Logo" className="h-12 mb-2" />
                    )}
                    <h1 
                      className="text-3xl font-bold mb-1"
                      style={{ color: currentTemplate.colors.primary }}
                    >
                      INVOICE
                    </h1>
                    <p className="text-sm">#{invoiceData.invoiceNumber}</p>
                  </div>
                  <div className="text-right text-sm">
                    <h2 className="text-lg font-bold mb-1">{invoiceData.company.name}</h2>
                    <p>{invoiceData.company.address}</p>
                    <p>{invoiceData.company.city}, {invoiceData.company.state} {invoiceData.company.zipCode}</p>
                    <p>{invoiceData.company.phone}</p>
                    <p>{invoiceData.company.email}</p>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 
                      className="text-sm font-bold mb-2"
                      style={{ color: currentTemplate.colors.secondary }}
                    >
                      Bill To:
                    </h3>
                    <p className="font-semibold text-sm">{invoiceData.client.name}</p>
                    <p className="text-sm">{invoiceData.client.address}</p>
                    <p className="text-sm">{invoiceData.client.city}, {invoiceData.client.state} {invoiceData.client.zipCode}</p>
                    <p className="text-sm">{invoiceData.client.phone}</p>
                    <p className="text-sm">{invoiceData.client.email}</p>
                  </div>
                  <div>
                    <div className="mb-2 text-sm">
                      <p><strong>Invoice Date:</strong> {invoiceData.date}</p>
                      <p><strong>Due Date:</strong> {invoiceData.dueDate}</p>
                      <p><strong>Payment Terms:</strong> {invoiceData.paymentTerms}</p>
                    </div>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="mb-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr 
                        className="border-b-2"
                        style={{ borderColor: currentTemplate.colors.accent }}
                      >
                        <th className="text-left py-2">Description</th>
                        <th className="text-right py-2">Qty</th>
                        <th className="text-right py-2">Rate</th>
                        <th className="text-right py-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.lineItems.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="py-2">{item.description}</td>
                          <td className="text-right py-2">{item.quantity}</td>
                          <td className="text-right py-2">{getCurrencySymbol(invoiceData.currency)}{item.rate.toFixed(2)}</td>
                          <td className="text-right py-2">{getCurrencySymbol(invoiceData.currency)}{item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-6">
                  <div className="w-48">
                    <div className="flex justify-between py-1 text-sm">
                      <span>Subtotal:</span>
                      <span>{getCurrencySymbol(invoiceData.currency)}{invoiceData.subtotal.toFixed(2)}</span>
                    </div>
                    {invoiceData.discountRate > 0 && (
                      <div className="flex justify-between py-1 text-sm">
                        <span>Discount ({invoiceData.discountRate}%):</span>
                        <span>-{getCurrencySymbol(invoiceData.currency)}{invoiceData.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {invoiceData.taxRate > 0 && (
                      <div className="flex justify-between py-1 text-sm">
                        <span>Tax ({invoiceData.taxRate}%):</span>
                        <span>{getCurrencySymbol(invoiceData.currency)}{invoiceData.taxAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div 
                      className="flex justify-between py-2 border-t-2 font-bold text-lg"
                      style={{ borderColor: currentTemplate.colors.accent }}
                    >
                      <span>Total:</span>
                      <span>{getCurrencySymbol(invoiceData.currency)}{invoiceData.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Notes and Terms */}
                {(invoiceData.notes || invoiceData.terms) && (
                  <div className="border-t pt-4 text-sm">
                    {invoiceData.notes && (
                      <div className="mb-2">
                        <h4 className="font-bold mb-1">Notes:</h4>
                        <p>{invoiceData.notes}</p>
                      </div>
                    )}
                    {invoiceData.terms && (
                      <div>
                        <h4 className="font-bold mb-1">Terms & Conditions:</h4>
                        <p>{invoiceData.terms}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
