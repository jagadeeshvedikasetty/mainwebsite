'use client'

import { useState } from 'react'

export default function PrintButton({ orderId }: { orderId?: string }) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownloadPdf = async () => {
    setIsGenerating(true)
    try {
      const element = document.getElementById('invoice-content')
      if (!element) {
        setIsGenerating(false)
        return
      }

      // Hide elements not needed in PDF
      const hiddenElements = element.querySelectorAll('.print-hidden')
      hiddenElements.forEach(el => ((el as HTMLElement).style.display = 'none'))

      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')

      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true,
      })

      // Restore elements
      hiddenElements.forEach(el => ((el as HTMLElement).style.display = ''))

      const imgData = canvas.toDataURL('image/png')
      
      const pdf = new jsPDF('p', 'pt', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      
      const filename = orderId ? `Invoice_${orderId}.pdf` : 'Invoice.pdf'
      pdf.save(filename)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button 
      onClick={handleDownloadPdf}
      disabled={isGenerating}
      className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium print-hidden"
      style={{ padding: '8px 16px', background: isGenerating ? '#4b5563' : '#111827', color: 'white', border: 'none', borderRadius: '4px', cursor: isGenerating ? 'not-allowed' : 'pointer' }}
    >
      {isGenerating ? 'Generating PDF...' : 'Download PDF'}
    </button>
  )
}
