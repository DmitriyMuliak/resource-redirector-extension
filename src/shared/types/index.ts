export type ResourceType =
  | 'main_frame'
  | 'sub_frame'
  | 'stylesheet'
  | 'script'
  | 'image'
  | 'font'
  | 'object'
  | 'xmlhttprequest'
  | 'ping'
  | 'csp_report'
  | 'media'
  | 'websocket'
  | 'webtransport'
  | 'other'

export interface RedirectRule {
  id: string
  name: string
  sourcePattern: string
  targetUrl: string
  isRegex: boolean
  isEnabled: boolean
  resourceTypes: ResourceType[]
  createdAt: number
  updatedAt: number
}

export type CreateRulePayload = Omit<RedirectRule, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateRulePayload = Partial<CreateRulePayload>

export interface StorageData {
  rules: RedirectRule[]
  version: number
}

export interface ValidationResult {
  isValid: boolean
  errors: Partial<Record<keyof CreateRulePayload, string>>
}
