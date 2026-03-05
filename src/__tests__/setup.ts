import '@testing-library/jest-dom'
import { vi } from 'vitest'

const chromeMock = {
  storage: {
    local: {
      get: vi.fn().mockResolvedValue({}),
      set: vi.fn().mockResolvedValue(undefined),
      onChanged: {
        addListener: vi.fn(),
        removeListener: vi.fn(),
      },
    },
  },
  declarativeNetRequest: {
    getDynamicRules: vi.fn().mockResolvedValue([]),
    updateDynamicRules: vi.fn().mockResolvedValue(undefined),
    RuleActionType: {
      REDIRECT: 'redirect',
      BLOCK: 'block',
      ALLOW: 'allow',
    },
    ResourceType: {
      MAIN_FRAME: 'main_frame',
      SUB_FRAME: 'sub_frame',
      STYLESHEET: 'stylesheet',
      SCRIPT: 'script',
      IMAGE: 'image',
      FONT: 'font',
      OBJECT: 'object',
      XMLHTTPREQUEST: 'xmlhttprequest',
      PING: 'ping',
      CSP_REPORT: 'csp_report',
      MEDIA: 'media',
      WEBSOCKET: 'websocket',
      OTHER: 'other',
    }
  },
  runtime: {
    onInstalled: { addListener: vi.fn() },
    onMessage: { addListener: vi.fn() },
    sendMessage: vi.fn().mockResolvedValue({}),
  },
}

Object.defineProperty(globalThis, 'chrome', { value: chromeMock, writable: true })
