import type { CreateRulePayload, ValidationResult } from '../types'

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function isValidRegexSubstitution(url: string): boolean {
  const cleaned = url.replace(/\\/g, '').replace(/\$\d+/g, 'x')
  return isValidUrl(cleaned)
}

export function validateRule(payload: Partial<CreateRulePayload>): ValidationResult {
  const errors: ValidationResult['errors'] = {}

  if (!payload.name?.trim()) {
    errors.name = 'Rule name is required'
  } else if (payload.name.length > 100) {
    errors.name = 'Must be under 100 characters'
  }

  if (!payload.sourcePattern?.trim()) {
    errors.sourcePattern = 'Source pattern is required'
  } else if (payload.isRegex) {
    try {
      new RegExp(payload.sourcePattern)
    } catch {
      errors.sourcePattern = 'Invalid regular expression'
    }
  }

  if (!payload.targetUrl?.trim()) {
    errors.targetUrl = 'Target URL is required'
  } else if (payload.isRegex) {
    if (!isValidRegexSubstitution(payload.targetUrl)) {
      errors.targetUrl = 'Invalid target URL or regex substitution'
    }
  } else if (!isValidUrl(payload.targetUrl)) {
    errors.targetUrl = 'Must be a valid URL (e.g. http://localhost:3000)'
  }

  if (!payload.resourceTypes?.length) {
    errors.resourceTypes = 'Select at least one resource type'
  }

  return { isValid: Object.keys(errors).length === 0, errors }
}
