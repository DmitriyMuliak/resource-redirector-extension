import { useState, useCallback } from 'react'

export interface ModalState {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export function useModal(defaultOpen = false): ModalState {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const open = useCallback(() => {
    setIsOpen(true)
  }, [])
  const close = useCallback(() => {
    setIsOpen(false)
  }, [])
  const toggle = useCallback(() => {
    setIsOpen((v) => !v)
  }, [])
  return { isOpen, open, close, toggle }
}
