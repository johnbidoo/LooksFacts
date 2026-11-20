import { useEffect, useRef } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Accessible modal behaviour for an element that is mounted while open:
 * - moves focus inside (to `initialFocus` or the first focusable element)
 * - traps Tab / Shift+Tab within the dialog
 * - closes on Escape
 * - locks page scroll
 * - restores focus to the previously focused element on close
 *
 * Returns a ref to attach to the dialog container.
 */
export function useDialog(onClose, { initialFocus } = {}) {
  const ref = useRef(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const previouslyFocused = document.activeElement
    const node = ref.current
    const focusables = () => [...(node?.querySelectorAll(FOCUSABLE) ?? [])].filter((el) => el.offsetParent !== null)

    const target = initialFocus?.current ?? focusables().find((el) => !el.hasAttribute('data-dialog-backdrop'))
    target?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onCloseRef.current()
        return
      }
      if (e.key !== 'Tab' || !node) return
      const items = focusables().filter((el) => !el.hasAttribute('data-dialog-backdrop'))
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      } else if (!node.contains(document.activeElement)) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      if (previouslyFocused instanceof HTMLElement && document.contains(previouslyFocused)) previouslyFocused.focus()
    }
    // Run once per mount — dialogs are mounted only while open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ref
}
