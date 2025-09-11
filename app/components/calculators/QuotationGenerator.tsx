'use client'

import React, { useState, useRef } from 'react'
import { 
  FileText, 
  Download, 
  Plus, 
  Trash2, 
  Save, 
  Copy, 
  Printer, 
  Settings,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Hash,
  DollarSign,
  Percent,
  Edit,
  Check,
  X
} from 'lucide-react'
import ResultSharing from '../ResultSharing'

interface QuoteItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  discount: number
  total: number
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
  logo?: string
}

interface ClientInfo {
  name: string
  company: string
  email: string
  phone: string
  address: string
}

export default function QuotationGenerator() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: 'Your Company Name',
    address: '123 Business Street',
    city: 'Business City',
    state: 'BC',
    zipCode: '12345',
    phone: '+1 (555) 123-4567',
    email: 'info@yourcompany.com',
    website: 'www.yourcompany.com'
  })

  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: ''
  })

  const [quoteDetails, setQuoteDetails] = useState({
    quoteNumber: `QT-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: '',
    terms: 'Payment due within 30 days. All prices are exclusive of taxes unless otherwise specified.'
  })

  const [items, setItems] = useState<QuoteItem[]>([
    {
      id: '1',
      description: 'Professional Service',
      quantity: 1,
      unitPrice: 100,
      discount: 0,
      total: 100
    }
  ])

  const [taxRate, setTaxRate] = useState(10)
  const [isEditing, setIsEditing] = useState(false)
  const [editingField, setEditingField] = useState('')
  const [showTemplates, setShowTemplates] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('modern')

  const quoteRef = useRef<HTMLDivElement>(null)

  const addItem = () => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      total: 0
    }
    setItems([...items, newItem])
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const updateItem = (id: string, field: keyof QuoteItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        if (field === 'quantity' || field === 'unitPrice' || field === 'discount') {
          const quantity = field === 'quantity' ? Number(value) : item.quantity
          const unitPrice = field === 'unitPrice' ? Number(value) : item.unitPrice
          const discount = field === 'discount' ? Number(value) : item.discount
          updatedItem.total = (quantity * unitPrice) - discount
        }
        return updatedItem
      }
      return item
    }))
  }

  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const taxAmount = (subtotal * taxRate) / 100
  const total = subtotal + taxAmount

  const startEdit = (field: string) => {
    setIsEditing(true)
    setEditingField(field)
  }

  const saveEdit = () => {
    setIsEditing(false)
    setEditingField('')
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditingField('')
  }

  const templates = [
    { id: 'modern', name: 'Modern', preview: 'bg-gradient-to-r from-blue-500 to-purple-600' },
    { id: 'classic', name: 'Classic', preview: 'bg-gradient-to-r from-gray-600 to-gray-800' },
    { id: 'elegant', name: 'Elegant', preview: 'bg-gradient-to-r from-emerald-500 to-teal-600' },
    { id: 'professional', name: 'Professional', preview: 'bg-gradient-to-r from-indigo-500 to-blue-600' },
    { id: 'creative', name: 'Creative', preview: 'bg-gradient-to-r from-pink-500 to-rose-600' },
    { id: 'minimal', name: 'Minimal', preview: 'bg-gradient-to-r from-slate-500 to-gray-600' }
  ]

  const getTemplateStyles = () => {
    switch (selectedTemplate) {
      case 'classic':
        return 'from-gray-700 to-gray-900'
      case 'elegant':
        return 'from-emerald-600 to-teal-700'
      case 'professional':
        return 'from-indigo-600 to-blue-700'
      case 'creative':
        return 'from-pink-600 to-rose-700'
      case 'minimal':
        return 'from-slate-600 to-gray-700'
      default:
        return 'from-blue-600 to-purple-700'
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getTemplateStyles()} rounded-lg shadow-lg mb-2 p-2`}>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
            <FileText className="w-3 h-3 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Quotation Generator</h1>
            <p className="text-white/80 text-xs">Create professional quotations in minutes</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Settings Panel */}
        <div className="lg:col-span-1 space-y-3">
          {/* Template Selection */}
          <div className="bg-white rounded-lg shadow-lg p-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center">
                <Settings className="w-4 h-4 mr-1" />
                Template
              </h3>
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-blue-600 hover:text-blue-800 text-xs font-medium"
              >
                {showTemplates ? 'Hide' : 'Change'}
              </button>
            </div>
            
            {showTemplates && (
              <div className="grid grid-cols-2 gap-2 mb-2">
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-2 rounded-lg border-2 transition-all ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-full h-6 rounded ${template.preview} mb-1`}></div>
                    <span className="text-xs font-medium text-gray-700">{template.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Company Information */}
          <div className="bg-white rounded-lg shadow-lg p-2">
            <h3 className="text-base font-medium text-gray-800 mb-3 flex items-center">
              <Building className="w-4 h-4 mr-1" />
              Company Details
            </h3>
            <div className="space-y-1">
              {Object.entries(companyInfo).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  {isEditing && editingField === key ? (
                    <div className="flex space-x-2">
                      <input
                        type={key === 'email' || key === 'website' ? 'text' : 'text'}
                        value={value}
                        onChange={(e) => setCompanyInfo(prev => ({ ...prev, [key]: e.target.value }))}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                        autoFocus
                        title={`Enter ${key.replace(/([A-Z])/g, ' $1').trim()}`}
                        aria-label={`Enter ${key.replace(/([A-Z])/g, ' $1').trim()}`}
                      />
                      <button
                        onClick={saveEdit}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Save changes"
                        aria-label="Save changes"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Cancel editing"
                        aria-label="Cancel editing"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => startEdit(key)}
                      className="px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 flex items-center justify-between"
                    >
                      <span className="text-gray-700">{value}</span>
                      <Edit className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Client Information */}
          <div className="bg-white rounded-lg shadow-lg p-2">
            <h3 className="text-base font-medium text-gray-800 mb-3 flex items-center">
              <User className="w-4 h-4 mr-1" />
              Client Details
            </h3>
            <div className="space-y-1">
              {Object.entries(clientInfo).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <input
                    type={key === 'email' ? 'email' : 'text'}
                    value={value}
                    onChange={(e) => setClientInfo(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').trim()}`}
                    className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    title={`Enter ${key.replace(/([A-Z])/g, ' $1').trim()}`}
                    aria-label={`Enter ${key.replace(/([A-Z])/g, ' $1').trim()}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Quote Details */}
          <div className="bg-white rounded-lg shadow-lg p-2">
            <h3 className="text-base font-medium text-gray-800 mb-3 flex items-center">
              <Hash className="w-4 h-4 mr-1" />
              Quote Details
            </h3>
            <div className="space-y-1">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Quote Number</label>
                <input
                  type="text"
                  value={quoteDetails.quoteNumber}
                  onChange={(e) => setQuoteDetails(prev => ({ ...prev, quoteNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Quote number"
                  aria-label="Quote number"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={quoteDetails.date}
                  onChange={(e) => setQuoteDetails(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Quote date"
                  aria-label="Quote date"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Valid Until</label>
                <input
                  type="date"
                  value={quoteDetails.validUntil}
                  onChange={(e) => setQuoteDetails(prev => ({ ...prev, validUntil: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Valid until date"
                  aria-label="Valid until date"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Tax rate percentage"
                  aria-label="Tax rate percentage"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quote Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-800">Quote Preview</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-xs">
                  <Save className="w-3 h-3 mr-1" />
                  Save
                </button>
                <button className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center text-xs">
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </button>
              </div>
            </div>

            <div ref={quoteRef} className="bg-gray-50 rounded-lg p-4">
              {/* Quote Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className={`text-lg font-bold bg-gradient-to-r ${getTemplateStyles()} bg-clip-text text-transparent mb-1`}>
                    {companyInfo.name}
                  </h2>
                  <div className="text-gray-600 text-xs space-y-0.5">
                    <p>{companyInfo.address}</p>
                    <p>{companyInfo.city}, {companyInfo.state} {companyInfo.zipCode}</p>
                    <p>{companyInfo.phone}</p>
                    <p>{companyInfo.email}</p>
                    <p>{companyInfo.website}</p>
                  </div>
                </div>
                <div className="text-right">
                  <h1 className="text-xl font-bold text-gray-800 mb-1">QUOTATION</h1>
                  <div className="text-gray-600 text-xs space-y-0.5">
                    <p><span className="font-semibold">Quote #:</span> {quoteDetails.quoteNumber}</p>
                    <p><span className="font-semibold">Date:</span> {quoteDetails.date}</p>
                    <p><span className="font-semibold">Valid Until:</span> {quoteDetails.validUntil}</p>
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Bill To:</h3>
                <div className="text-gray-600 text-xs">
                  <p className="font-semibold">{clientInfo.name || 'Client Name'}</p>
                  <p>{clientInfo.company || 'Company Name'}</p>
                  <p>{clientInfo.email || 'client@email.com'}</p>
                  <p>{clientInfo.phone || 'Phone Number'}</p>
                  <p>{clientInfo.address || 'Client Address'}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-2 px-1 font-semibold text-gray-800 text-xs">Description</th>
                      <th className="text-right py-2 px-1 font-semibold text-gray-800 text-xs">Qty</th>
                      <th className="text-right py-2 px-1 font-semibold text-gray-800 text-xs">Unit Price</th>
                      <th className="text-right py-2 px-1 font-semibold text-gray-800 text-xs">Discount</th>
                      <th className="text-right py-2 px-1 font-semibold text-gray-800 text-xs">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id} className="border-b border-gray-200">
                        <td className="py-2 px-1">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            className="w-full border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-1 text-xs"
                            placeholder="Item description"
                            title="Item description"
                            aria-label="Item description"
                          />
                        </td>
                        <td className="py-2 px-1">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                            className="w-16 text-right border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-1 text-xs"
                            title="Quantity"
                            aria-label="Quantity"
                          />
                        </td>
                        <td className="py-2 px-1">
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                            className="w-20 text-right border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-1 text-xs"
                            title="Unit price"
                            aria-label="Unit price"
                          />
                        </td>
                        <td className="py-2 px-1">
                          <input
                            type="number"
                            value={item.discount}
                            onChange={(e) => updateItem(item.id, 'discount', Number(e.target.value))}
                            className="w-16 text-right border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-1 text-xs"
                            title="Discount amount"
                            aria-label="Discount amount"
                          />
                        </td>
                        <td className="py-2 px-1 text-right font-semibold text-xs">
                          ${item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="mt-4">
                  <button
                    onClick={addItem}
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Item
                  </button>
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-end mb-4">
                <div className="w-48">
                  <div className="flex justify-between py-1 border-b border-gray-300 text-xs">
                    <span className="font-semibold">Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-300 text-xs">
                    <span className="font-semibold">Tax ({taxRate}%):</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 text-sm font-bold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes and Terms */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={quoteDetails.notes}
                    onChange={(e) => setQuoteDetails(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes or comments..."
                    className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    rows={2}
                    title="Additional notes"
                    aria-label="Additional notes"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Terms & Conditions</label>
                  <textarea
                    value={quoteDetails.terms}
                    onChange={(e) => setQuoteDetails(prev => ({ ...prev, terms: e.target.value }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    rows={2}
                    title="Terms and conditions"
                    aria-label="Terms and conditions"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="flex-1 min-w-[150px] bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center font-medium text-xs">
              <Download className="w-4 h-4 mr-1" />
              Download PDF
            </button>
            <button className="flex-1 min-w-[150px] bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center font-medium text-xs">
              <Printer className="w-4 h-4 mr-1" />
              Print Quote
            </button>
            <button className="flex-1 min-w-[150px] bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 flex items-center justify-center font-medium text-xs">
              <Mail className="w-4 h-4 mr-1" />
              Email Quote
            </button>
          </div>

          {/* Result Sharing */}
          <div className="mt-4">
            <ResultSharing 
              title="Quotation Generator"
              inputs={[
                { label: "Quote Number", value: quoteDetails.quoteNumber },
                { label: "Client", value: clientInfo.name || 'Client' },
                { label: "Items", value: items.length }
              ]}
              result={{ label: "Total Amount", value: total.toFixed(2), unit: "$" }}
              calculatorName="Quotation Generator"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
