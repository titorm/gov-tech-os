import { format, formatDistance, formatRelative, isValid, parseISO } from 'date-fns'
import { DATE_FORMATS } from '../constants'

export function formatDate(date: string | Date, pattern: string = DATE_FORMATS.MEDIUM): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  
  if (!isValid(dateObj)) {
    return 'Invalid date'
  }
  
  return format(dateObj, pattern)
}

export function formatRelativeDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  
  if (!isValid(dateObj)) {
    return 'Invalid date'
  }
  
  return formatRelative(dateObj, new Date())
}

export function formatDistanceFromNow(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  
  if (!isValid(dateObj)) {
    return 'Invalid date'
  }
  
  return formatDistance(dateObj, new Date(), { addSuffix: true })
}

export function isValidDate(date: any): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isValid(dateObj)
}

export function toISOString(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  
  if (!isValid(dateObj)) {
    throw new Error('Invalid date')
  }
  
  return dateObj.toISOString()
}