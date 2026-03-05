import type { ResourceType } from '../types'

export const STORAGE_KEY = 'url_redirector_data' as const
export const STORAGE_VERSION = 1 as const

export const ALL_RESOURCE_TYPES: ResourceType[] = [
  'main_frame',
  'sub_frame',
  'stylesheet',
  'script',
  'image',
  'font',
  'object',
  'xmlhttprequest',
  'ping',
  'csp_report',
  'media',
  'websocket',
  'webtransport',
  'other',
]

export const DEFAULT_RESOURCE_TYPES: ResourceType[] = [
  'script',
  'stylesheet',
  'xmlhttprequest',
  'main_frame',
  'sub_frame',
]

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  main_frame:    'Page',
  sub_frame:     'iFrame',
  stylesheet:    'CSS',
  script:        'JS',
  image:         'Image',
  font:          'Font',
  object:        'Object',
  xmlhttprequest:'XHR',
  ping:          'Ping',
  csp_report:    'CSP',
  media:         'Media',
  websocket:     'WS',
  webtransport:  'WebTransport',
  other:         'Other',
}
