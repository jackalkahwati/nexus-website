// Mock the cn utility function for class name merging
const cn = (...inputs) => {
  return inputs.filter(Boolean).join(' ')
}

// Mock date formatting utilities
const formatDate = (date) => {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return date.toLocaleString()
}

const formatDateTime = (date) => {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return date.toLocaleString()
}

// Mock debounce utility
const debounce = (fn, ms = 300) => {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}

// Mock validation utilities
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Mock string utilities
const truncate = (str, length) => {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Mock number formatting utilities
const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num)
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

// Mock ID generation utility
const generateId = () => Math.random().toString(36).slice(2)

// Export all utilities
module.exports = {
  cn,
  formatDate,
  formatDateTime,
  debounce,
  isValidEmail,
  isValidUrl,
  truncate,
  capitalize,
  formatNumber,
  formatCurrency,
  generateId
}
