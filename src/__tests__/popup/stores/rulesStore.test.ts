import { describe, it, expect, beforeEach, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useRulesStore } from '../../../popup/stores/rulesStore'
import type { ResourceType } from '../../../shared/types'

vi.mock('../../../shared/utils/storage', () => ({
  storageService: {
    getRules: vi.fn().mockResolvedValue([]),
    saveRules: vi.fn().mockResolvedValue(undefined),
    onRulesChanged: vi.fn().mockReturnValue(() => undefined),
  },
}))

const BASE_PAYLOAD = {
  name: 'Test Rule',
  sourcePattern: 'https://example.com',
  targetUrl: 'http://localhost:3000',
  isRegex: false,
  isEnabled: true,
  resourceTypes: ['script'] as ResourceType[],
}

describe('useRulesStore', () => {
  beforeEach(() => {
    useRulesStore.setState({ rules: [], isLoaded: false, error: null })
  })

  it('initializes with rules from storage', async () => {
    const { result } = renderHook(() => useRulesStore())
    await act(async () => { await result.current.initialize() })

    expect(result.current.isLoaded).toBe(true)
    expect(result.current.rules).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('addRule appends a new rule with generated id', async () => {
    const { result } = renderHook(() => useRulesStore())
    await act(async () => { await result.current.addRule({ ...BASE_PAYLOAD }) })

    expect(result.current.rules).toHaveLength(1)
    expect(result.current.rules[0].name).toBe('Test Rule')
    expect(result.current.rules[0].id).toBeTruthy()
  })

  it('toggleRule flips isEnabled', async () => {
    const { result } = renderHook(() => useRulesStore())
    await act(async () => { await result.current.addRule({ ...BASE_PAYLOAD, isEnabled: true }) })
    const id = result.current.rules[0].id
    await act(async () => { await result.current.toggleRule(id) })

    expect(result.current.rules[0].isEnabled).toBe(false)
  })

  it('deleteRule removes the rule', async () => {
    const { result } = renderHook(() => useRulesStore())
    await act(async () => { await result.current.addRule({ ...BASE_PAYLOAD }) })
    const id = result.current.rules[0].id
    await act(async () => { await result.current.deleteRule(id) })

    expect(result.current.rules).toHaveLength(0)
  })

  it('duplicateRule creates a copy with " (copy)" suffix', async () => {
    const { result } = renderHook(() => useRulesStore())
    await act(async () => { await result.current.addRule({ ...BASE_PAYLOAD }) })
    const id = result.current.rules[0].id
    await act(async () => { await result.current.duplicateRule(id) })

    expect(result.current.rules).toHaveLength(2)
    expect(result.current.rules[1].name).toBe('Test Rule (copy)')
    expect(result.current.rules[1].id).not.toBe(id)
  })

  it('updateRule merges changes', async () => {
    const { result } = renderHook(() => useRulesStore())
    await act(async () => { await result.current.addRule({ ...BASE_PAYLOAD }) })
    const id = result.current.rules[0].id
    await act(async () => { await result.current.updateRule(id, { name: 'Updated' }) })

    expect(result.current.rules[0].name).toBe('Updated')
  })
})
