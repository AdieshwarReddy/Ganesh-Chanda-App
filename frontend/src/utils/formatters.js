// Currency formatter
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0)
}

// Date formatter
export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// Payment method display
export const paymentMethodLabel = (method) => {
  const map = {
    UPI: '📱 UPI',
    CASH: '💵 Cash',
    BANK_TRANSFER: '🏦 Bank Transfer',
    OTHER: '💳 Other',
  }
  return map[method] || method
}

// Status badge component data
export const statusConfig = {
  PENDING: { label: 'Pending', className: 'badge-pending' },
  VERIFIED: { label: 'Verified', className: 'badge-verified' },
  REJECTED: { label: 'Rejected', className: 'badge-rejected' },
}

// Generate UPI deep link for QR
export const buildUpiLink = (upiId, name, amount, note = 'Ganesh Chanda') => {
  const params = new URLSearchParams({
    pa: upiId,
    pn: name || 'Ganesh Utsav',
    am: amount || '',
    cu: 'INR',
    tn: note,
  })
  return `upi://pay?${params.toString()}`
}

// Download blob as file
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
}
