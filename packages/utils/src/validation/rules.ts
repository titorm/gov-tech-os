export function isRequired(value: any): boolean {
  return value !== null && value !== undefined && value !== ''
}

export function isEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

export function isMinLength(value: string, minLength: number): boolean {
  return value.length >= minLength
}

export function isMaxLength(value: string, maxLength: number): boolean {
  return value.length <= maxLength
}

export function isNumeric(value: string): boolean {
  return /^-?\d+\.?\d*$/.test(value)
}

export function isInteger(value: string): boolean {
  return /^-?\d+$/.test(value)
}

export function isPositive(value: number): boolean {
  return value > 0
}

export function isURL(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export function isPhoneNumber(value: string): boolean {
  const phoneRegex = /^\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/
  return phoneRegex.test(value)
}

export function isStrongPassword(value: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return strongPasswordRegex.test(value)
}