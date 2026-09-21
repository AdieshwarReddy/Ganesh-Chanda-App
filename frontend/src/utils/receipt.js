import jsPDF from 'jspdf'
import { formatCurrency, formatDate } from './formatters'

export const generateReceiptPDF = (donation, campaignTitle = 'Ganesh Chanda 2026') => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()

  // Background
  doc.setFillColor(17, 17, 27)
  doc.rect(0, 0, pageW, 297, 'F')

  // Header gradient bar
  doc.setFillColor(249, 115, 22) // saffron
  doc.rect(0, 0, pageW, 40, 'F')
  doc.setFillColor(245, 158, 11) // gold
  doc.rect(pageW / 2, 0, pageW / 2, 40, 'F')

  // Title
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('DONATION RECEIPT', pageW / 2, 18, { align: 'center' })
  doc.setFontSize(13)
  doc.setFont('helvetica', 'normal')
  doc.text(campaignTitle, pageW / 2, 30, { align: 'center' })

  // Receipt number
  doc.setFillColor(30, 30, 50)
  doc.roundedRect(15, 50, pageW - 30, 20, 3, 3, 'F')
  doc.setTextColor(249, 115, 22)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(`Receipt No: ${donation.receipt_number || donation.id}`, pageW / 2, 61, { align: 'center' })
  doc.setTextColor(180, 180, 200)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(`Date: ${formatDate(donation.created_at)}`, pageW / 2, 67, { align: 'center' })

  // Divider
  doc.setDrawColor(249, 115, 22)
  doc.setLineWidth(0.5)
  doc.line(15, 78, pageW - 15, 78)

  // Donor details
  const drawField = (label, value, y) => {
    doc.setTextColor(150, 150, 170)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(label, 20, y)
    doc.setTextColor(240, 240, 255)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(String(value || '—'), 20, y + 6)
  }

  drawField('DONOR NAME', donation.is_anonymous ? 'Anonymous Donor' : donation.donor_name, 88)
  drawField('PHONE', donation.is_anonymous ? '—' : (donation.phone || '—'), 88)
  // Right column
  const rightX = pageW / 2 + 5
  doc.setTextColor(150, 150, 170)
  doc.setFontSize(9)
  doc.text('PAYMENT METHOD', rightX, 88)
  doc.setTextColor(240, 240, 255)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(donation.payment_method || '—', rightX, 94)

  doc.setTextColor(150, 150, 170)
  doc.setFontSize(9)
  doc.text('TRANSACTION ID', rightX, 103)
  doc.setTextColor(240, 240, 255)
  doc.setFontSize(11)
  doc.text(donation.transaction_id || '—', rightX, 109)

  drawField('EMAIL', donation.is_anonymous ? '—' : (donation.email || '—'), 103)

  // Amount box
  doc.setFillColor(249, 115, 22)
  doc.roundedRect(15, 120, pageW - 30, 30, 4, 4, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('DONATION AMOUNT', pageW / 2, 131, { align: 'center' })
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text(formatCurrency(donation.amount), pageW / 2, 143, { align: 'center' })

  // Status
  const statusColor = donation.payment_status === 'VERIFIED' ? [16, 185, 129] : [234, 179, 8]
  doc.setFillColor(...statusColor)
  doc.roundedRect(pageW / 2 - 20, 158, 40, 12, 6, 6, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(donation.payment_status, pageW / 2, 166, { align: 'center' })

  // Message
  if (donation.message) {
    doc.setFillColor(25, 25, 40)
    doc.roundedRect(15, 178, pageW - 30, 20, 3, 3, 'F')
    doc.setTextColor(200, 180, 120)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    const lines = doc.splitTextToSize(`"${donation.message}"`, pageW - 40)
    doc.text(lines[0], pageW / 2, 188, { align: 'center' })
  }

  // Thank you
  doc.setDrawColor(249, 115, 22)
  doc.setLineWidth(0.3)
  doc.line(15, 205, pageW - 15, 205)
  doc.setTextColor(249, 115, 22)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('🙏 Thank You for Your Generosity! 🙏', pageW / 2, 215, { align: 'center' })
  doc.setTextColor(150, 150, 180)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(
    'Your contribution makes our Ganesh Utsav celebration possible.',
    pageW / 2, 223, { align: 'center' }
  )
  doc.text('Ganpati Bappa Morya! 🎉', pageW / 2, 230, { align: 'center' })

  // Footer
  doc.setFillColor(249, 115, 22)
  doc.rect(0, 282, pageW, 15, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.text('This is a digital receipt. Keep it for your records.', pageW / 2, 291, { align: 'center' })

  return doc
}

export const downloadReceipt = (donation, campaignTitle) => {
  const doc = generateReceiptPDF(donation, campaignTitle)
  doc.save(`Receipt_${donation.receipt_number || donation.id}.pdf`)
}

export const printReceipt = (donation, campaignTitle) => {
  const doc = generateReceiptPDF(donation, campaignTitle)
  doc.autoPrint()
  window.open(doc.output('bloburl'), '_blank')
}
